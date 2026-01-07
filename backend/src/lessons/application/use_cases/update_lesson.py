from src.lessons.domain.entities import LessonUpdate
from src.lessons.presentation.dependencies import LessonUoWDeps
from src.lessons.presentation.dtos import LessonUpdateDTO


async def update_lesson(id: int, lesson_data: LessonUpdateDTO, uow: LessonUoWDeps):
    lesson = LessonUpdate(id=id, **lesson_data.model_dump())

    async with uow:
        lesson_updated = await uow.lessons.update(lesson)
        await uow.commit()
    return lesson_updated
