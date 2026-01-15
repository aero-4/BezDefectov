from src.dialogs.domain.entities import DialogUpdate
from src.dialogs.domain.interfaces.dialog_uow import IDialogUnitOfWork
from src.dialogs.presentation.dtos import DialogUpdateDTO


async def update_dialog(id: int, dialog: DialogUpdateDTO, uow: IDialogUnitOfWork):
    dialog_data = DialogUpdate(id=id, **dialog.model_dump())
    async with uow:
        dialog = await uow.dialogs.update(dialog_data)
        await uow.commit()
    return dialog
