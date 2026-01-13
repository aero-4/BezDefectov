import abc

from src.dialogs.domain.interfaces.dialog_repo import IDialogRepository


class IDialogUnitOfWork(abc.ABC):
    dialogs: IDialogRepository

    async def __aenter__(self, *args):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.rollback()

    async def commit(self):
        await self._commit()

    @abc.abstractmethod
    async def _commit(self):
        pass

    @abc.abstractmethod
    async def rollback(self):
        pass
