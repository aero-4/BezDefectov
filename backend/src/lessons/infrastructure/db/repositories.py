from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.cards.infrastructure.db.orm import CardsOrm
from src.core.domain.exceptions import AlreadyExists, NotFound
from src.lessons.domain.entities import Lesson, LessonCreate, LessonUpdate
from src.lessons.domain.interfaces.lesson_repo import ILessonRepository
from src.lessons.infrastructure.db.orm import LessonsOrm


class LessonRepository(ILessonRepository):

    def __init__(self, session: AsyncSession):
        super().__init__()
        self.session = session

    async def add(self, lesson: LessonCreate):
        # stmt_cards = (
        #     select(CardsOrm)
        #     .where(CardsOrm.id.in_(lesson.cards))
        # )
        # result = await self.session.execute(stmt_cards)
        # cards_orm = result.scalars().all()
        #
        # if len(cards_orm) != len(lesson.cards):
        #     raise ValueError("Some cards not found")

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
        ...

    async def get(self, id: int) -> Lesson:
        stmt = select(LessonsOrm).where(LessonsOrm.id == id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise NotFound()

        return self._to_domain(obj)



    async def get_all_by_filters(self, type: str) -> Lesson:
        ...

    async def delete(self, id: int):
        ...

    @staticmethod
    def _to_domain(lesson: LessonsOrm) -> Lesson:
        return Lesson(
            id=lesson.id,
            created_at=lesson.created_at,
            updated_at=lesson.updated_at,
            duration=lesson.duration,
            type=lesson.type,
            cards=[i.id for i in lesson.cards],
        )
