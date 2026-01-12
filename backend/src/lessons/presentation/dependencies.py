from typing import Annotated

from fastapi import Depends
from starlette.requests import Request
from starlette.websockets import WebSocket

from src import settings
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.domain.interfaces.websocket_manager import IWebsocketManager
from src.lessons.infrastructure.db.unit_of_work import PGLessonUnitOfWork
from src.lessons.infrastructure.services.gpt_provider import GPTVoiceToTextProvider
from src.lessons.infrastructure.services.manager import DialogManager


def get_lessons_uow() -> ILessonUnitOfWork:
    return PGLessonUnitOfWork()



def get_websocket_manager(websocket: WebSocket = None, request: Request = None) -> IWebsocketManager:
    provider = GPTVoiceToTextProvider(settings.OPENAI_API_KEY)

    return DialogManager(provider, websocket, request)



LessonUoWDeps = Annotated[ILessonUnitOfWork, Depends(get_lessons_uow)]