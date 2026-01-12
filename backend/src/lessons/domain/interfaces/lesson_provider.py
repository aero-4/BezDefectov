import abc


class InterfaceAIProvider(abc.ABC):

    def __init__(self, token: str):
        self.token = token

    @abc.abstractmethod
    async def request(self, data: dict):
        ...

    @abc.abstractmethod
    async def response(self, data: dict):
        ...
