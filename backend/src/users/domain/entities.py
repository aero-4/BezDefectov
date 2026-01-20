import datetime
import enum

from pydantic import BaseModel

from src.core.domain.entities import CustomModel


class Roles(enum.IntEnum):
    USER = 1
    ADMIN = 2


class User(BaseModel):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime | None = None
    user_name: str | None
    email: str
    hashed_password: str
    series_days: int | None = None
    role: int


class UserMe(CustomModel):
    created_at: datetime.datetime
    user_name: str | None
    email: str
    series_days: int


class UserCreate(CustomModel):
    email: str
    hashed_password: str
    updated_at: datetime.datetime | None = None
    series_days: int | None = None


class UserUpdate(BaseModel):
    id: int
    series_days: int | None = None
    user_name: str | None = None
