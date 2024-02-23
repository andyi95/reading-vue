from typing import Optional
import os
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from aioredis import from_url
import uuid

from starlette.background import BackgroundTask
from starlette.responses import FileResponse

from utils.analize import analize_text, count_words

from speechkit import model_repository, configure_credentials, creds

load_dotenv()

configure_credentials(
   yandex_credentials=creds.YandexCredentials(
      api_key=os.getenv('Y_API_KEY')
   )
)
REDIS_URL = os.getenv('REDIS_URL')


class Counted(BaseModel):
    count: int
    word: str


class TextModel(BaseModel):
    text: str


class TextResponse(BaseModel):
    id: int
    word: str
    tag: Optional[str]
    normal_form: Optional[str]


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


@api.post('/text-to-speech/')
async def text_to_speech(text: TextModel, voice: Optional[str] = 'anton'):
    model = model_repository.synthesis_model()
    model.voice = voice
    model.role = 'good'
    filename = f'{uuid.uuid4()}.wav'
    os.makedirs('temp', exist_ok=True)
    filepath = f'./temp/{filename}'

    result = model.synthesize(text.text, raw_format=False)
    result.export(filepath, 'wav')
    response = FileResponse(path=filepath, filename=filename)
    response.background = BackgroundTask(delete_audio_file, filepath=filepath)
    return response


app.mount('/api', api)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
