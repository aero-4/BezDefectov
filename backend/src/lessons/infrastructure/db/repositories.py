from typing import List

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.cards.domain.entities import Card
from src.cards.infrastructure.db.orm import CardsOrm
from src.core.domain.exceptions import AlreadyExists, NotFound
from src.lessons.domain.entities import Lesson, LessonCreate, LessonUpdate
from src.lessons.domain.interfaces.lesson_repo import ILessonRepository
from src.lessons.infrastructure.db.orm import LessonsOrm


class LessonRepository(ILessonRepository):

    def __init__(self, session: AsyncSession):
        super().__init__()
        self.session = session

    async def add(self, lesson: LessonCreate) -> Lesson:
        obj = LessonsOrm(**lesson.model_dump())
        self.session.add(obj)

        try:
            await self.session.flush()
        except IntegrityError:
            raise AlreadyExists()

        stmt = select(LessonsOrm).where(LessonsOrm.id == obj.id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()

        return self._to_domain(obj)

    async def update(self, lesson: LessonUpdate) -> Lesson:
        stmt = select(LessonsOrm).where(LessonsOrm.id == lesson.id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise NotFound()

        for field, value in lesson.model_dump(exclude_none=True).items():
            setattr(obj, field, value)

        await self.session.flush()

        return self._to_domain(obj)

    async def get(self, id: int) -> Lesson:
        stmt = select(LessonsOrm).where(LessonsOrm.id == id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise NotFound()

        return self._to_domain(obj)

    async def get_all_by_type(self, type: str) -> List[Lesson]:
        stmt = select(LessonsOrm).filter_by(type=type)
        result = await self.session.execute(stmt)
        objs = result.scalars().all()

        return [self._to_domain(obj) for obj in objs]

    async def delete(self, id: int) -> None:
        stmt = select(LessonsOrm).where(LessonsOrm.id == id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()
        if not obj:
            raise NotFound()

        await self.session.delete(obj)
        await self.session.flush()

        return None

    @staticmethod
    def _to_domain(lesson: LessonsOrm) -> Lesson:
        return Lesson(
            id=lesson.id,
            created_at=lesson.created_at,
            updated_at=lesson.updated_at,
            duration=lesson.duration,
            type=lesson.type,
        )
