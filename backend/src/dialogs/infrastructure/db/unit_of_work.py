from src.db.engine import async_session_maker
from src.dialogs.domain.interfaces.dialog_repo import IDialogRepository
from src.dialogs.domain.interfaces.dialog_uow import IDialogUnitOfWork
from src.dialogs.infrastructure.db.repositories import PGDialogsRepository


class PGDialogUnitOfWork(IDialogUnitOfWork):

    def __init__(self, session_factory=async_session_maker):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.dialogs = PGDialogsRepository(self.session)

        return await super().__aenter__()

    async def __aexit__(self, *args):
        await super().__aexit__(*args)
        await self.session.close()

    async def rollback(self):
        await self.session.rollback()

    async def _commit(self):
        await self.session.commit()
