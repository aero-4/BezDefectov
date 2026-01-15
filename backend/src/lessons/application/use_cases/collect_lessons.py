from src.lessons.domain.entities import Lesson
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork


async def collect_lesson(id: int, uow: ILessonUnitOfWork) -> Lesson:
    async with uow:
        lesson = await uow.lessons.get(id)
    return lesson


async def collect_with_type_lessons(type: str, uow: ILessonUnitOfWork) -> list[Lesson]:
    async with uow:
        lessons = await uow.lessons.get_all_by_type(type)
    return lessons


async def collect_lessons(uow: ILessonUnitOfWork) -> list[Lesson]:
    async with uow:
        lessons = await uow.lessons.get_all()

    return lessons