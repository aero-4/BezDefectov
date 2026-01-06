from typing import Annotated

from fastapi import Depends

from src.cards.domain.interfaces.card_uow import ICardUnitOfWork
from src.cards.infrastructure.db.unit_of_work import PGCardUnitOfWork


def get_card_uow() -> ICardUnitOfWork:
    return PGCardUnitOfWork()


CardUowDep = Annotated[ICardUnitOfWork, Depends(get_card_uow)]
