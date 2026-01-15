from src.dialogs.domain.interfaces.dialog_uow import IDialogUnitOfWork


async def delete_dialog(id: int, uow: IDialogUnitOfWork) -> None:
    async with uow:
        await uow.dialogs.delete(id)
        await uow.commit()

