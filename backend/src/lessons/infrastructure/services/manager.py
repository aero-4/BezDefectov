import asyncio
import base64
import json
import logging
from typing import Any, Dict

from starlette.requests import Request
from starlette.types import Message
from starlette.websockets import WebSocket, WebSocketDisconnect

from src.lessons.domain.entities import Dialog, ResponseDialog
from src.lessons.domain.interfaces.lesson_provider import InterfaceAIProvider
from src.lessons.domain.interfaces.websocket_manager import IWebsocketManager


class DialogManager(IWebsocketManager):

    def __init__(self, provider: InterfaceAIProvider, websocket: WebSocket, request: Request):
        super().__init__(provider, websocket, request)

        self.queue = asyncio.Queue()
        self.finished = asyncio.Event()
        self.external_result = {}

        self.message: Dialog | None = None
        self.forward_task = None

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

        elif self.message.action == "chunk":
            await self._chunk()

        elif self.message.action == "end":
            await self._end()

    async def _start(self) -> None:
        meta_data: Dict[str, Any] = self.message.payload.get("meta")
        self.forward_task = asyncio.create_task(self.provider.request(meta_data))

        await self.websocket.send_json({"type": "started"})

    async def _chunk(self) -> None:
        data_b64 = self.message.payload.get("data")
        if not data_b64:
            return await self.websocket.send_json(
                ResponseDialog(type="error", reason="no_chunk_data").model_dump()
            )

        try:
            chunk_bytes = base64.b64decode(data_b64)
        except Exception as e:
            logging.error("Error decode chunk - %s", (e,))
            return await self.websocket.send_json(
                ResponseDialog(type="error", reason="invalid_base64").model_dump()
            )

        await self.queue.put(chunk_bytes)
        await self.websocket.send_json(
            ResponseDialog(type="ack", received_bytes=len(chunk_bytes))
        )

    async def _end(self) -> None:
        await self.queue.put(None)
        self.finished.set()

        if self.forward_task is None:
            return await self.websocket.send_json(
                ResponseDialog(type="error", reason="not_started")
            )

    async def _to_entity(self, message: Message):
        self.message = Dialog(**message)

        if self.message.type == "websocket.disconnect":
            raise WebSocketDisconnect()

        if self.message.bytes:
            await self.queue.put(self.message.bytes)

        if self.message.text:
            self.message.payload = json.loads(self.message.text)
            self.message.action = self.message.payload.get("action")
