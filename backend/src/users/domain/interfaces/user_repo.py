import abc
from typing import List

from src.users.domain.entities import UserCreate, User


class IUserRepository(abc.ABC):

    @abc.abstractmethod
    def add(self, user: UserCreate) -> User:
        ...

    @abc.abstractmethod
    def get_by_email(self, email: str) -> User:
        ...

    @abc.abstractmethod
    def get_by_id(self, id: int) -> User:
        ...

    @abc.abstractmethod
    def delete(self, id: int) -> bool:
        ...

    @abc.abstractmethod
    def get_all(self) -> List[User]:
        ...
