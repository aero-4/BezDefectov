from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork


async def delete_lesson(id: int, uow: ILessonUnitOfWork) -> None:
    async with uow:
        await uow.lessons.delete(id)
        await uow.commit()
