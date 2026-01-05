import abc


class ICardRepository(abc.ABC):

    @abc.abstractmethod
    async def add(self):
        pass

    @abc.abstractmethod
    async def update(self):
        pass

    @abc.abstractmethod
    async def delete(self):
        pass

    @abc.abstractmethod
    async def get_all(self):
        ...
