import abc


class IAIProvider(abc.ABC):
    @abc.abstractmethod
    async def response(self, prompt: str) -> str:
        pass
