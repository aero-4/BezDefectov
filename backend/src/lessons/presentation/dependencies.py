from typing import Annotated

from fastapi import Depends

from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.infrastructure.db.unit_of_work import PGLessonUnitOfWork


def get_lessons_uow() -> ILessonUnitOfWork:
    return PGLessonUnitOfWork()


LessonUoWDeps = Annotated[ILessonUnitOfWork, Depends(get_lessons_uow)]