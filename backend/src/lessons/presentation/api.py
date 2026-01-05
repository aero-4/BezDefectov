from fastapi import APIRouter

from src.lessons.application.use_cases.add_lesson import add_lesson
from src.lessons.presentation.dependencies import LessonUoWDeps
from src.lessons.presentation.dtos import LessonCreateDTO

lessons_api_router = APIRouter()


@lessons_api_router.post("/")
async def add(lesson_data: LessonCreateDTO, uow: LessonUoWDeps):
    return await add_lesson(lesson_data, uow)
