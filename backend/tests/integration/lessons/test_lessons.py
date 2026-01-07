import pytest
import httpx
from httpx import AsyncClient

from src.cards.domain.entities import Card
from src.cards.presentation.dtos import CardCreateDTO
from src.lessons.domain.entities import Lesson
from src.lessons.infrastructure.db.orm import LessonTypes
from src.lessons.presentation.dtos import LessonCreateDTO
from tests.integration.conftest import base_url


@pytest.mark.asyncio
async def test_add_lesson(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lesson_dto = LessonCreateDTO(duration=25, type=LessonTypes.r)
        response = await client.post("/api/lessons/", json=lesson_dto.model_dump(mode="json"))
        lesson = Lesson(**response.json())

        create_card = CardCreateDTO(title="Слоги", text="ра-ра-ра ро-ро-ро ре-ре-ре", lesson_id=lesson.id)
        response2 = await client.post("/api/cards/", json=create_card.model_dump(mode="json"))

        card = Card(**response2.json())

        assert lesson.duration == lesson_dto.duration
        assert create_card.text == card.text

        return lesson


@pytest.mark.asyncio
async def test_get_lessons_with_type(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lessons_dto1 = LessonCreateDTO(duration=10, type=LessonTypes.r)
        lessons_dto2 = LessonCreateDTO(duration=20, type=LessonTypes.sh)
        lessons_dto3 = LessonCreateDTO(duration=5, type=LessonTypes.r)

        resp1 = await client.post("/api/lessons/", json=lessons_dto1.model_dump())
        resp2 = await client.post("/api/lessons/", json=lessons_dto2.model_dump())
        resp3 = await client.post("/api/lessons/", json=lessons_dto3.model_dump())

        l1 = Lesson(**resp1.json())
        l3 = Lesson(**resp3.json())

        resp4 = await client.get(f"/api/lessons/types/{LessonTypes.r}")
        data = resp4.json()

        assert data[0]["id"] == l1.id
        assert data[1]["id"] == l3.id
