from typing import Annotated

from fastapi import Depends
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.infrastructure.db.unit_of_work import PGLessonUnitOfWork


def get_lessons_uow() -> ILessonUnitOfWork:
    return PGLessonUnitOfWork()



LessonUoWDep = Annotated[ILessonUnitOfWork, Depends(get_lessons_uow)]
