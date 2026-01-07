from pydantic import BaseModel

from src.lessons.infrastructure.db.orm import LessonTypes


class LessonCreateDTO(BaseModel):
    duration: int
    type: LessonTypes


class LessonUpdateDTO(BaseModel):
    duration: int | None = None
    type: LessonTypes | None = None