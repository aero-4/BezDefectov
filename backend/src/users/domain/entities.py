import datetime

from pydantic import BaseModel


class User(BaseModel):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime | None = None
    user_name: str | None
    email: str
    hashed_password: str
    series_days: int | None = None


class UserMe(BaseModel):
    created_at: datetime.datetime
    updated_at: datetime.datetime | None
    user_name: str | None
    email: str
    series_days: int


class UserCreate(BaseModel):
    email: str
    hashed_password: str
    updated_at: datetime.datetime | None = None
    series_days: int | None = None


class UserUpdate(BaseModel):
    id: int
    series_days: int | None = None
