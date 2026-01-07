from src.cards.domain.entities import CardUpdate, Card
from src.cards.domain.interfaces.card_uow import ICardUnitOfWork
from src.cards.presentation.dtos import CardUpdateDTO


async def update_card(id: int, card_data: CardUpdateDTO, uow: ICardUnitOfWork) -> Card:
    card_data = CardUpdate(id=id, **card_data.model_dump())

    async with uow:
        card = await uow.cards.update(card_data)
        await uow.commit()
    return card
