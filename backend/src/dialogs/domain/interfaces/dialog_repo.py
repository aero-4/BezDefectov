import abc
from typing import List

from src.dialogs.domain.entities import DialogUpdate, Dialog, DialogCreate


class IDialogRepository(abc.ABC):

    @abc.abstractmethod
    async def add(self, dialog: DialogCreate) -> Dialog:
        pass

    @abc.abstractmethod
    async def update(self, dialog: DialogUpdate) -> Dialog:
        pass

    @abc.abstractmethod
    async def delete(self, id: int) -> None:
        pass

    @abc.abstractmethod
    async def get_all(self, lesson_id: int) -> List[Dialog]:
        pass
