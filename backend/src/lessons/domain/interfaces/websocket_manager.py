import abc

from starlette.requests import Request
from starlette.websockets import WebSocket

from src.lessons.domain.interfaces.lesson_provider import InterfaceAIProvider


class IWebsocketManager(abc.ABC):
    def __init__(self, provider: InterfaceAIProvider, websocket: WebSocket, request: Request):
        self.provider = provider
        self.websocket = websocket
        self.request = request

    @abc.abstractmethod
    async def accept(self):
        pass

    @abc.abstractmethod
    async def receive(self):
        pass

    @abc.abstractmethod
    async def _start(self) -> None:
        pass

    @abc.abstractmethod
    async def _chunk(self) -> None:
        pass

    @abc.abstractmethod
    async def _end(self) -> None:
        pass

