from typing import Optional
import os
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI, Header, HTTPException, Depends, Request, Response
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
from speechkit import model_repository, configure_credentials, creds

load_dotenv()

configure_credentials(
   yandex_credentials=creds.YandexCredentials(
      api_key=os.getenv('Y_API_KEY')
   ))

api = FastAPI()

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
async def create_text(text: TextModel, colors: Optional[dict] = None):
    analized = await analize_text(text.text)
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
async def text_to_speech(text: TextModel, voice: Optional[str] = 'anton'):
    model = model_repository.synthesis_model()
    model.voice = voice
    model.role = 'good'
    model.unsafe_mode = True
    filename = f'{uuid.uuid4()}.mp3'
    os.makedirs('temp', exist_ok=True)
    filepath = f'./temp/{filename}'
    try:
        result = model.synthesize(text.text, raw_format=False)
    except _MultiThreadedRendezvous as e:
        raise HTTPException(status_code=400, detail=str(e.code()))
    result.export(filepath, 'mp3')
    response = FileResponse(path=filepath, filename=filename)
    response.background = BackgroundTask(delete_audio_file, filepath=filepath)
    return response


app.mount('/api', api)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
