from typing import Annotated

from fastapi import Depends
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.domain.interfaces.ai_provider import IAIProvider
from src.lessons.infrastructure.db.unit_of_work import PGLessonUnitOfWork
from src.lessons.infrastructure.services.gpt_unnel_provider import GptUnnelProvider


def get_lessons_uow() -> ILessonUnitOfWork:
    return PGLessonUnitOfWork()


def get_ai_provider() -> IAIProvider:
    return GptUnnelProvider()



LessonUoWDep = Annotated[ILessonUnitOfWork, Depends(get_lessons_uow)]
AIProviderDep = Annotated[IAIProvider, Depends(get_ai_provider)]