from fastapi import APIRouter

from src.lessons.application.use_cases.add_lesson import add_lesson
from src.lessons.application.use_cases.collect_lessons import collect_lesson, collect_with_type_lessons
from src.lessons.application.use_cases.delete_lesson import delete_lesson
from src.lessons.application.use_cases.update_lesson import update_lesson
from src.lessons.presentation.dependencies import LessonUoWDeps
from src.lessons.presentation.dtos import LessonCreateDTO, LessonUpdateDTO

lessons_api_router = APIRouter()


@lessons_api_router.post("/")
async def add(lesson_data: LessonCreateDTO, uow: LessonUoWDeps):
    return await add_lesson(lesson_data, uow)


@lessons_api_router.get("/{id}")
async def get(id: int, uow: LessonUoWDeps):
    return await collect_lesson(id, uow)


@lessons_api_router.get("/types/{type}")
async def get_by_type(type: str, uow: LessonUoWDeps):
    return await collect_with_type_lessons(type, uow)


@lessons_api_router.delete("/{id}")
async def delete(id: int, uow: LessonUoWDeps):
    return await delete_lesson(id, uow)


@lessons_api_router.patch("/{id}")
async def update(id: int, lesson_data: LessonUpdateDTO, uow: LessonUoWDeps):
    return await update_lesson(id, lesson_data, uow)