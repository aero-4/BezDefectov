from typing import List

from src.dialogs.domain.entities import Dialog
from src.dialogs.domain.interfaces.dialog_uow import IDialogUnitOfWork


async def collect_dialogs(lesson_id: int, uow: IDialogUnitOfWork) -> List[Dialog]:
    async with uow:
        dialogs = await uow.dialogs.get_all(lesson_id)
    return dialogs
