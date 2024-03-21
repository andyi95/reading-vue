from typing import Annotated, Optional
import os
import uvicorn
from fastapi import FastAPI, Header, HTTPException, Depends, Request, Response, APIRouter
import httpx
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid

from grpc._channel import _MultiThreadedRendezvous
from starlette.background import BackgroundTask
from starlette.responses import FileResponse

from app.schemas import TextModel
from settings import Settings, get_settings
from utils.analize import analize_text, count_words
from google.cloud import texttospeech



api = APIRouter(prefix='/api', dependencies=[Depends(get_settings)])

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)


origins = [
    "http://localhost",
    'http://localhost:4000/',
    'backend',
    'nginx'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@api.post('/parse/')
async def create_text(text: TextModel, settings: Settings = Depends(get_settings)):
    analized = await analize_text(text.text, settings)
    return analized


@api.post('/count/')
async def count_text(text: TextModel):
    counted = count_words(text.text)
    res = []
    for item, value in counted.items():
        res.append({'word': item, 'count': value})
    return JSONResponse(res)


def delete_audio_file(filepath: str):
    os.remove(filepath)


def authenticate_user(authorization: str = Header(...), settings: Settings = Depends(get_settings)):
    try:
        scheme, password = authorization.split()
        if scheme.lower() != 'password':
            raise HTTPException(status_code=401, detail='Invalid authorization scheme')
    except ValueError:
        raise HTTPException(status_code=401, detail='Invalid authorization header')

    if password != settings.AUTH_PASSWRD:
        raise HTTPException(status_code=401, detail='Invalid password')
    return True


@api.post('/text-to-speech/', dependencies=[Depends(authenticate_user)])
async def text_to_speech(settings: Annotated[Settings, Depends(get_settings)], text: TextModel, voice: Optional[str]
= 'anton') -> FileResponse:
    """ru-RU-Standard-B	"""
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=text.text)
    voice = texttospeech.VoiceSelectionParams(
        language_code='ru-Ru',
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
        name='ru-RU-Standard-B'
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    filename = f'{uuid.uuid4()}.mp3'
    os.makedirs('temp', exist_ok=True)
    filepath = f'./temp/{filename}'
    try:
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
    except _MultiThreadedRendezvous as e:
        raise HTTPException(status_code=400, detail=str(e.code()))
    with open(filepath, 'wb') as f:
        f.write(response.audio_content)
    response = FileResponse(path=filepath, filename=filename)
    response.background = BackgroundTask(delete_audio_file, filepath=filepath)
    return response


@api.post('token/verify/', dependencies=[Depends(authenticate_user)])
async def validate_token():
    return Response(status_code=200)



app.include_router(api)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
