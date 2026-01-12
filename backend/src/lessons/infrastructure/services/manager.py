import asyncio
import json
from typing import Any, Dict

from starlette.requests import Request
from starlette.types import Message
from starlette.websockets import WebSocket, WebSocketDisconnect

from src.lessons.domain.entities import Dialog
from src.lessons.domain.interfaces.dialog_manager import IDialogManager


class DialogManager(IDialogManager):
    queue = asyncio.Queue()
    finished = asyncio.Event()
    external_result = {}

    def __init__(self, websocket: WebSocket, request: Request):
        super().__init__(websocket, request)
        self.message: Dialog | None = None

    async def accept(self):
        await self.websocket.accept()

        while True:
            try:
                await self.receive()
            except WebSocketDisconnect():
                await self.queue.put(None)
            finally:
                await self.websocket.close()

    async def receive(self):
        message = await self.websocket.receive()
        await self._to_entity(message)

        if self.message.action == "start":
            await self._start()

    async def _start(self) -> None:
        meta_data: Dict[str, Any] = self.message.payload.get("meta")
        forward_task = asyncio.create_task(self.provider.request)
        await self.websocket.send_json({"type": "started"})





    async def _to_entity(self, message: Message):
        self.message = Dialog(**message)

        if self.message.type == "websocket.disconnect":
            raise WebSocketDisconnect()

        if self.message.bytes:
            await self.queue.put(self.message.bytes)

        if self.message.text:
            self.message.payload = json.loads(self.message.text)
            self.message.action = self.message.payload.get("action")
