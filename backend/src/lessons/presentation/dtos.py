from pydantic import BaseModel

from src.lessons.infrastructure.db.orm import LessonTypes


class LessonCreateDTO(BaseModel):
    duration: int
    type: LessonTypes
