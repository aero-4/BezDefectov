from src.lessons.domain.entities import LessonCreate, Lesson
from src.lessons.presentation.dependencies import LessonUoWDep
from src.lessons.presentation.dtos import LessonCreateDTO


async def add_lesson(lesson_data: LessonCreateDTO, uow: LessonUoWDep) -> Lesson:
    lesson_data = LessonCreate(**lesson_data.model_dump())
    async with uow:
        lesson = await uow.lessons.add(lesson_data)
        await uow.commit()
    return lesson
