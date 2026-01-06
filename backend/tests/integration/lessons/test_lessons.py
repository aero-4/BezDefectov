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
async def test_add_lesson():
    async with AsyncClient(base_url=base_url) as client:
        create_card = CardCreateDTO(title="Слоги", text="ра-ра-ра ро-ро-ро ре-ре-ре")
        response2 = await client.post("/api/cards/", json=create_card.model_dump())

        card = Card(**response2.json())

        lesson_dto = LessonCreateDTO(duration=25, type=LessonTypes.r, cards=[card.id])

        response = await client.post("/api/lessons/", json=lesson_dto.model_dump())

        lesson = Lesson(**response.json())

        assert lesson.duration == lesson_dto.duration
        assert lesson.cards[0].id == card.id
