from typing import List
from src.lessons.domain.entities import Dialog
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork


async def dialogs_lesson(id: int, uow: ILessonUnitOfWork) -> List[Dialog]:
    async with uow:
        dialogs = await uow.lessons.get_dialogs(id)
    return dialogs
