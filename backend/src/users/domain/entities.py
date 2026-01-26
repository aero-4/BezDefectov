import datetime
import enum
from typing import List

from pydantic import BaseModel

from src.core.domain.entities import CustomModel
from src.lessons.domain.entities import SeriesLesson


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
    updated_at: datetime.datetime | None = None
    created_at: datetime.datetime | None
    email: str | None
    series_days: int | None
    series_last: List[SeriesLesson] | List | None = None


class UserCreate(CustomModel):
    email: str
    hashed_password: str
    updated_at: datetime.datetime | None = None
    series_days: int | None = None


class UserUpdate(BaseModel):
    id: int
    series_days: int | None = None
    user_name: str | None = None
    updated_at: datetime.datetime | None = None
    created_at: datetime.datetime | None = None
