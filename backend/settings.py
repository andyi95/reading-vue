from functools import lru_cache

from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    Y_API_KEY: str = os.getenv('Y_API_KEY')
    REDIS_RUL: str = os.getenv('REDIS_URL', 'redis://redis:6379/0')
    SECRET_KEY: str = os.getenv('SECRET_KEY')
    AUTH_PASSWRD: str = os.getenv('AUTH_PASSWRD')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"
    CORS_ORIGINS: list = [
    "http://localhost",
    'http://localhost:4000/',
    'backend',
    'nginx'
]
    API_GATEWAY_URL: str = os.getenv('API_GATEWAY_URL', 'http://localhost:8088')
    API_GATEWAY_HOST: str = os.getenv('API_GATEWAY_HOST', 'localhost')


@lru_cache()
def get_settings() -> BaseSettings:
    return Settings()