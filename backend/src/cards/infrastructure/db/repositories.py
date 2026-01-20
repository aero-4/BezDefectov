from typing import List

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.cards.domain.entities import CardCreate, Card, CardUpdate
from src.cards.domain.interfaces.card_repo import ICardRepository
from src.cards.infrastructure.db.orm import CardsOrm
from src.core.domain.exceptions import AlreadyExists, NotFound


class PGCardRepository(ICardRepository):

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, card: CardCreate) -> Card:
        obj = CardsOrm(**card.model_dump())
        self.session.add(obj)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise AlreadyExists()

        return self._to_domain(obj)

    async def add_all(self, cards: List[CardCreate]) -> List[Card]:
        objs = [CardsOrm(**i.model_dump()) for i in cards]
        self.session.add_all(objs)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise AlreadyExists()

        return [self._to_domain(i) for i in objs]

    async def get_by_id(self, lesson_id: int) -> List[Card]:
        stmt = select(CardsOrm).where(CardsOrm.lesson_id == lesson_id)
        result = await self.session.execute(stmt)
        objs = [self._to_domain(obj) for obj in result.scalars().all()]
        return objs

    async def delete(self, id: int) -> None:
        stmt = select(CardsOrm).where(CardsOrm.id == id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()
        if not obj:
            raise NotFound()

        await self.session.delete(obj)
        await self.session.flush()

    async def update(self, card: CardUpdate) -> Card:
        stmt = select(CardsOrm).where(CardsOrm.id == card.id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()

        if not obj:
            raise NotFound()

        for field, value in card.model_dump(exclude_none=True).items():
            setattr(obj, field, value)

        await self.session.flush()

        return self._to_domain(obj)

    @staticmethod
    def _to_domain(obj: CardsOrm):
        return Card(
            id=obj.id,
            lesson_id=obj.lesson_id,
            text=obj.text,
            title=obj.title
        )
