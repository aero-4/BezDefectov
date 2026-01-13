import asyncio
import base64
from typing import Dict, Any, Optional, AsyncIterator, List

import aiohttp
from starlette.requests import Request
from starlette.websockets import WebSocket, WebSocketDisconnect

from src.lessons.domain.entities import Dialog
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.domain.interfaces.websocket_manager import IWebsocketManager
from src.lessons.presentation.dependencies import get_websocket_manager
from src.users.domain.entities import User


async def dialogs_lesson(id: int, uow: ILessonUnitOfWork) -> List[Dialog]:
    async with uow:
        dialogs = await uow.lessons.get_dialogs(id)
    return dialogs
