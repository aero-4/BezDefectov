import datetime

from pydantic import BaseModel

from src.lessons.infrastructure.db.orm import LessonTypes


class Lesson(BaseModel):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    duration: int
    type: LessonTypes
    cards: list["CardsOrm"]


class LessonCreate(BaseModel):
    duration: int
    type: LessonTypes
    cards: list[int]


class LessonUpdate(BaseModel):
    id: int
    duration: int | None = None
    cards: list["CardsOrm"] | None = None
    type: LessonTypes | None = None
