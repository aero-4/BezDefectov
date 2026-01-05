import datetime

from pydantic import BaseModel


class User(BaseModel):
    id: int
    created_at: datetime.datetime
    user_name: str | None
    email: str
    hashed_password: str


class UserCreate(BaseModel):
    email: str
    hashed_password: str