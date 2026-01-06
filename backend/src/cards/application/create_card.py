from src.cards.domain.entities import CardCreate
from src.cards.presentation.dependencies import CardUowDep
from src.cards.presentation.dtos import CardCreateDTO


async def create_card(card_data: CardCreateDTO, uow: CardUowDep):
    card_data = CardCreate(**card_data.model_dump())

    async with uow:
        card = await uow.cards.add(card_data)
    return card
