from abc import ABC

from src.db.engine import async_session_maker
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.infrastructure.db.repositories import LessonRepository


class PGLessonUnitOfWork(ILessonUnitOfWork, ABC):

    def __init__(self, session=async_session_maker):
        self.session_factory = session

    async def __aenter__(self):
        self.session = self.session_factory()
        self.lessons = LessonRepository(self.session)

        return await super().__aenter__()

    async def __aexit__(self, *args):
        await super().__aexit__(*args)
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()
