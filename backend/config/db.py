import os

from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from tortoise import Tortoise

DB_URL = 'postgres://postgres:postgres@127.0.0.1:5432/postgres'

TORTOISE_ORM = {
    "connections": {"default": DB_URL},
    "apps": {
        "models": {
            "models": ["models", "aerich.models"],
            "default_connection": "default",
        },
    },
}


def init_fastapi_db(app: FastAPI) -> None:
    register_tortoise(
        app,
        db_url=DB_URL,
        modules={"models": ["models", 'aerich.models']},
        generate_schemas=False,
        add_exception_handlers=True,
    )


async def init_db():
    # Here we create a SQLite DB using file "db.sqlite3"
    #  also specify the app name of "models"
    #  which contain models from "app.models"
    await Tortoise.init(
        db_url=DB_URL,
        modules={'models': ['models', 'aerich.models']}
    )
run_async()