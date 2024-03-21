from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None


class UserAuth(BaseModel):
    username: str = Field(..., description="user email")
    password: str = Field(..., min_length=5, max_length=24, description="user password")


class UserOut(BaseModel):
    id: UUID
    email: str


class SystemUser(UserOut):
    password: str


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
