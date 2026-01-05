from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.domain.exceptions import AlreadyExists
from src.lessons.domain.entities import Lesson, LessonCreate
from src.lessons.domain.interfaces.lesson_repo import ILessonRepository
from src.lessons.infrastructure.db.orm import LessonsOrm


class LessonRepository(ILessonRepository):

    def __init__(self, session: AsyncSession):
        super().__init__()
        self.session = session

    async def add(self, lesson: LessonCreate):
        obj = LessonsOrm(**lesson.model_dump())
        self.session.add(obj)

        try:
            await self.session.flush()
        except IntegrityError:
            raise AlreadyExists()

        return self._to_domain(obj)

    @staticmethod
    async def _to_domain(lesson: LessonsOrm) -> Lesson:
        return Lesson(
            id=lesson.id,
            created_at=lesson.created_at,
            update_at=lesson.updated_at,
            cards=lesson.cards,
            duration=lesson.duration,
            type=lesson.type
        )
