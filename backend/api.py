import os
import subprocess
import time
import uuid
from typing import Annotated, Optional
from logging import getLogger
import httpx
import uvicorn
from fastapi import APIRouter, Body, Depends, FastAPI, Header, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google.cloud import texttospeech
from grpc._channel import _MultiThreadedRendezvous
from starlette.background import BackgroundTask
from starlette.responses import FileResponse

from app.schemas import TextModel
from settings import Settings, get_settings
from utils.analize import TextAnalizer, analize_text, count_words

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
logger = getLogger(__name__)

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
    analizer = TextAnalizer(text.text)
    voice = analizer.get_voice_params()
    client = texttospeech.TextToSpeechClient()
    chunks = analizer.split_text(4500)
    filenames = []
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    os.makedirs('temp', exist_ok=True)
    for i, chunk in enumerate(chunks):
        synthesis_input = texttospeech.SynthesisInput(text=chunk)
        try:
            response = client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )
        except _MultiThreadedRendezvous as e:
            raise HTTPException(status_code=400, detail=str(e.code()))
        filename = f'{uuid.uuid4()}.mp3'
        with open(f'./temp/{filename}', 'wb') as f:
            f.write(response.audio_content)
            filenames.append(f'./temp/{filename}')
    merged_filename = f'temp/merged_{uuid.uuid4()}.mp3'
    command = ['ffmpeg', '-y', '-i', "concat:" + "|".join(filenames), '-acodec', 'copy', merged_filename]
    subprocess.run(command, check=True)
    for filename in filenames:
        os.remove(filename)
    response = FileResponse(path=merged_filename)
    response.background = BackgroundTask(delete_audio_file, filepath=merged_filename)
    return response


@api.post('/token/verify/')
async def validate_token(password: Annotated[str, Body(..., embed=True)], settings: Settings = Depends(get_settings)):
    if password != settings.AUTH_PASSWRD:
        raise HTTPException(status_code=401, detail='Invalid password')
    return Response(status_code=200)

@api.api_route('/{path:path}', methods=['POST'])
async def proxy(settings: Annotated[Settings, Depends(get_settings)], request: Request, path: str):
    url = f'{settings.API_GATEWAY_URL}/{path}'
    headers = dict(request.headers)
    headers = {
        'Authorization': f'Bearer {settings.API_GATEWAY_TOKEN}'
    }
    data = await request.form()
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url=url, headers=headers, data=data)
        except Exception as e:
            logger.exception('erorr making request')
            return Response(status_code=500)
    try:
        return JSONResponse(status_code=response.status_code, content={'status': 'Ok'})
    except Exception as e:
        logger.exception('error returning response')
        return Response(status_code=response.status_code)


app.include_router(api)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
