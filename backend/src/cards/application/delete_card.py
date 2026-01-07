from src.cards.domain.interfaces.card_uow import ICardUnitOfWork


async def delete_card(id: int, uow: ICardUnitOfWork) -> None:
    async with uow:
        await uow.cards.delete(id)
        await uow.commit()
