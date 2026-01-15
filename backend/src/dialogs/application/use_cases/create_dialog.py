from src.dialogs.domain.entities import DialogCreate
from src.dialogs.domain.interfaces.dialog_uow import IDialogUnitOfWork
from src.dialogs.presentation.dtos import DialogCreateDTO


async def create_dialog(dialog_data: DialogCreateDTO, uow: IDialogUnitOfWork):
    dialog_data = DialogCreate(**dialog_data.model_dump())
    async with uow:
        dialog = await uow.dialogs.add(dialog_data)
        await uow.commit()
    return dialog
