from fastapi import APIRouter
from starlette.requests import Request
from starlette.websockets import WebSocket

from src.lessons.application.use_cases.add_lesson import add_lesson
from src.lessons.application.use_cases.collect_lessons import collect_lesson, collect_with_type_lessons, collect_lessons
from src.lessons.application.use_cases.confirm_lesson import update_series
from src.lessons.application.use_cases.delete_lesson import delete_lesson
from src.lessons.application.use_cases.update_lesson import update_lesson
from src.lessons.presentation.dependencies import LessonUoWDep
from src.lessons.presentation.dtos import LessonCreateDTO, LessonUpdateDTO
from src.users.presentation.dependencies import UserUoWDep

lessons_api_router = APIRouter()


@lessons_api_router.post("/")
async def add(lesson_data: LessonCreateDTO, uow: LessonUoWDep):
    return await add_lesson(lesson_data, uow)


@lessons_api_router.get("/{id}")
async def get(id: int, uow: LessonUoWDep):
    return await collect_lesson(id, uow)


@lessons_api_router.get("/types/{type}")
async def get_by_type(type: str, uow: LessonUoWDep):
    return await collect_with_type_lessons(type, uow)


@lessons_api_router.get("/")
async def get_all(uow: LessonUoWDep):
    return await collect_lessons(uow)


@lessons_api_router.delete("/{id}")
async def delete(id: int, uow: LessonUoWDep):
    return await delete_lesson(id, uow)


@lessons_api_router.patch("/{id}")
async def update(id: int, lesson_data: LessonUpdateDTO, uow: LessonUoWDep):
    return await update_lesson(id, lesson_data, uow)


@lessons_api_router.post("/series")
async def series(request: Request, user_uow: UserUoWDep):
    return await update_series(user_uow, request.state.user)
