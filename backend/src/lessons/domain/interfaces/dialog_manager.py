import abc
import asyncio
from asyncio import Event
from typing import Optional, Dict, Any

from starlette.requests import Request
from starlette.types import Message
from starlette.websockets import WebSocket

from src.lessons.domain.interfaces.lesson_provider import ILessonAIProvider


class IDialogManager(abc.ABC):
    queue: asyncio.Queue[bytes]
    finished: Event
    external_result: Optional[Dict[str, Any]]

    def __init__(self, provider: ILessonAIProvider, websocket: WebSocket, request: Request):
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

