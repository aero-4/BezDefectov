import abc
from typing import List

from src.lessons.domain.entities import LessonCreate, Lesson, LessonUpdate, Dialog, SeriesLesson
from src.users.domain.entities import User


class ILessonRepository(abc.ABC):

    @abc.abstractmethod
    async def add(self, lesson: LessonCreate) -> Lesson:
        pass

    @abc.abstractmethod
    async def update(self, lesson: LessonUpdate) -> Lesson:
        pass

    @abc.abstractmethod
    async def delete(self, id: int):
        pass

    @abc.abstractmethod
    async def get(self, id: int) -> Lesson:
        pass

    @abc.abstractmethod
    async def get_all_by_type(self, type: str) -> List[Lesson]:
        pass

    @abc.abstractmethod
    async def get_all(self) -> List[Lesson]:
        pass

    @abc.abstractmethod
    async def get_series(self, user: User) -> List[SeriesLesson]:
        pass

    @abc.abstractmethod
    async def add_series(self, user: User) -> SeriesLesson:
        pass
