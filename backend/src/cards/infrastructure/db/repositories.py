from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.cards.domain.entities import CardCreate, Card
from src.cards.domain.interfaces.card_repo import ICardRepository
from src.cards.infrastructure.db.orm import CardsOrm
from src.core.domain.exceptions import AlreadyExists


class PGCardRepository(ICardRepository):

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, card: CardCreate) -> Card:
        obj = CardsOrm(**card.model_dump())
        self.session.add(obj)

        try:
            await self.session.flush()
        except IntegrityError:
            raise AlreadyExists()

        return self._to_domain(obj)

    @staticmethod
    def _to_domain(obj: CardsOrm):
        return Card(
            id=obj.id,
            lesson_id=obj.lesson_id,
            text=obj.text,
            title=obj.title
        )
