from typing import AsyncIterator
from aioredis import from_url, Redis


async def init_redis() -> AsyncIterator[Redis]:
    session = from_url("redis://host.docker.internal:6379/3", encoding="utf-8", decode_responses=True)
    yield session
    session.close()
    await session.wait_closed()

