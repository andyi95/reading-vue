from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi import Response
from utils.analize import analize_text, count_words
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional


class Counted(BaseModel):
    count: int
    word: str



class TextModel(BaseModel):
    text: str


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8088",
    "http://192.168.1.6:8088",
    'https://reader.dev.andyi95.com/',
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

@app.post('/parse/')
async def create_text(text: TextModel, colors: Optional[dict] = None):
    analized = analize_text(text.text, colors)
    return analized


@app.post('/count/')
async def cout_text(text: TextModel) -> Counted:
    counted = count_words(text.text)
    res = []
    for item, value in counted.items():
        res.append({'word': item, 'count': value})
    return JSONResponse(res)

@app.get('/parse')
async def get_text():
    return analized


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)