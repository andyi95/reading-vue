from typing import Optional

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from aioredis import from_url, Redis
from utils.analize import analize_text, count_words
from asyncio import sleep
REDIS_URL = 'redis:6379/0'


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
app = FastAPI()

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



app.mount('/api', api)


@app.on_event('startup')
async def init_cache():
    redis = from_url(f'redis://{REDIS_URL}', encoding="utf8", decode_responses=True)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
