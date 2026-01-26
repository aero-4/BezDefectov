import abc
from typing import List

from src.users.domain.entities import UserCreate, User, UserUpdate
from src.users.infrastructure.db.orm import SeriesOrm


class IUserRepository(abc.ABC):

    @abc.abstractmethod
    def add(self, user: UserCreate) -> User:
        pass

    @abc.abstractmethod
    def get_by_email(self, email: str) -> User:
        pass

    @abc.abstractmethod
    def get_by_id(self, id: int) -> User:
        pass

    @abc.abstractmethod
    def delete(self, id: int) -> bool:
        pass

    @abc.abstractmethod
    def get_all(self) -> List[User]:
        pass

    @abc.abstractmethod
    def update(self, user_data: UserUpdate) -> User:
        pass


