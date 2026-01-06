from src.lessons.domain.entities import Lesson
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork


async def collect_lesson(id: int, uow: ILessonUnitOfWork) -> Lesson:
    async with uow:
        lesson = await uow.lessons.get(id)
    return lesson
