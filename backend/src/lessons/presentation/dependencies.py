from typing import Annotated

from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.infrastructure.db.unit_of_work import PGLessonUnitOfWork


def get_lessons_uow() -> ILessonUnitOfWork:
    return PGLessonUnitOfWork()


LessonUoWDeps = Annotated[ILessonUnitOfWork, get_lessons_uow()]