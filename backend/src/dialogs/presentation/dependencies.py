from typing import Annotated

from fastapi import Depends

from src.dialogs.domain.interfaces.dialog_uow import IDialogUnitOfWork
from src.dialogs.infrastructure.db.unit_of_work import PGDialogUnitOfWork


def get_dialog_uow() -> IDialogUnitOfWork:
    return PGDialogUnitOfWork()


DialogUoWDep = Annotated[IDialogUnitOfWork, Depends(get_dialog_uow)]
