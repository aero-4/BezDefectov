from typing import List

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.domain.exceptions import AlreadyExists, NotFound
from src.dialogs.domain.entities import DialogCreate, Dialog, DialogUpdate
from src.dialogs.domain.interfaces.dialog_repo import IDialogRepository
from src.dialogs.infrastructure.db.orm import DialogsOrm


class PGDialogsRepository(IDialogRepository):

    def __init__(self, session):
        self.session: AsyncSession = session

    async def add(self, dialog: DialogCreate) -> Dialog:
        obj = DialogsOrm(**dialog.model_dump())
        self.session.add(obj)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise AlreadyExists()

        return self._to_entity(obj)

    async def add_all(self, dialogs: List[DialogCreate]) -> List[Dialog]:
        objs = [DialogsOrm(**i.model_dump()) for i in dialogs]

        self.session.add_all(objs)

        try:
            await self.session.flush()
        except IntegrityError as e:
            raise AlreadyExists()

        return [self._to_entity(i) for i in objs]

    async def get(self, lesson_id: int) -> List[Dialog]:
        stmt = select(DialogsOrm).where(DialogsOrm.lesson_id == lesson_id)
        result = await self.session.execute(stmt)
        objs = [self._to_entity(i) for i in result.scalars().all()]
        return objs

    async def get_all(self) -> List[Dialog]:
        stmt = select(DialogsOrm)
        result = await self.session.execute(stmt)
        objs = [self._to_entity(i) for i in result.scalars().all()]
        return objs

    async def delete(self, id: int) -> None:
        stmt = select(DialogsOrm).where(DialogsOrm.id == id)
        result = await self.session.execute(stmt)
        obj = result.scalar_one_or_none()
        if not obj:
            raise NotFound()

        await self.session.delete(obj)
        await self.session.flush()

    async def update(self, dialog: DialogUpdate) -> Dialog:
        stmt = select(DialogsOrm).where(DialogsOrm.id == dialog.id)
        result = await self.session.execute(stmt)
        obj: DialogsOrm | None = result.scalar_one_or_none()
        if not obj:
            raise NotFound()

        for key, value in dialog.model_dump(exclude_none=True).items():
            setattr(obj, key, value)

        await self.session.flush()

        return self._to_entity(obj)

    @staticmethod
    def _to_entity(obj: DialogsOrm) -> Dialog:
        return Dialog(
            id=obj.id,
            user_name=obj.user_name,
            content=obj.content,
            lesson_id=obj.lesson_id
        )
