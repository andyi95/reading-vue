from typing import Optional, List

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from models import Users, User_Pydantic
from config import init_fastapi_db
from utils.analize import analize_text, count_words


class Counted(BaseModel):
    count: int
    word: str


class TextModel(BaseModel):
    text: str


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
analized = str

@api.get('/users', response_model=List[User_Pydantic])
async def get_users():
    return await User_Pydantic.from_queryset(Users.all())


@api.post('/parse/')
async def create_text(text: TextModel, colors: Optional[dict] = None):
    analized = analize_text(text.text, colors)
    return analized


@api.post('/count/')
async def count_text(text: TextModel):
    counted = count_words(text.text)
    res = []
    for item, value in counted.items():
        res.append({'word': item, 'count': value})
    return JSONResponse(res)


@api.get('/parse')
async def get_text():
    return analized


if __name__ == "__main__":
    init_fastapi_db(app)
    app.mount('/api', api)
    uvicorn.run(app, host="0.0.0.0", port=8000)
