from src.cards.domain.interfaces.card_uow import ICardUnitOfWork
from src.cards.infrastructure.db.repositories import PGCardRepository
from src.db.engine import async_session_maker


class PGCardUnitOfWork(ICardUnitOfWork):

    def __init__(self, session_factory=async_session_maker):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.cards = PGCardRepository(self.session)

        return await super().__aenter__()

    async def __aexit__(self, *args):
        await super().__aexit__(args)
        await self.session.close()

    async def _commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()
