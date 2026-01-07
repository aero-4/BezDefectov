from typing import List

from src.cards.domain.entities import Card
from src.cards.presentation.dependencies import CardUowDep


async def collect_cards_by_id(lesson_id: int, uow: CardUowDep) -> List[Card]:
    async with uow:
        cards = await uow.cards.get_by_id(lesson_id)
    return cards
