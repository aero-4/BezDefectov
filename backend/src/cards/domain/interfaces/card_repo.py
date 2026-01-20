import abc
from typing import List

from src.cards.domain.entities import CardCreate, Card, CardUpdate


class ICardRepository(abc.ABC):

    @abc.abstractmethod
    async def add(self, card: CardCreate) -> Card:
        pass

    @abc.abstractmethod
    async def add_all(self, cards: List[CardCreate]) -> List[Card]:
        pass

    @abc.abstractmethod
    async def update(self, card: CardUpdate) -> Card:
        pass

    @abc.abstractmethod
    async def delete(self, id: int) -> None:
        pass

    @abc.abstractmethod
    async def get_by_id(self, lesson_id: int) -> List[Card]:
        pass
