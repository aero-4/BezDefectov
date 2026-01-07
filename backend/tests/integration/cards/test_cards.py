import pytest
from httpx import AsyncClient

from src.cards.domain.entities import Card
from src.cards.presentation.dtos import CardCreateDTO
from src.lessons.domain.entities import Lesson
from src.lessons.infrastructure.db.orm import LessonTypes
from src.lessons.presentation.dtos import LessonCreateDTO
from tests.integration.conftest import base_url


@pytest.mark.asyncio
async def test_get_cards_with_id(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lesson_dto = LessonCreateDTO(duration=25, type=LessonTypes.r)
        response = await client.post("/api/lessons/", json=lesson_dto.model_dump(mode="json"))
        lesson = Lesson(**response.json())

        create_card = CardCreateDTO(title="Слоги", text="ра-ра-ра ро-ро-ро ре-ре-ре", lesson_id=lesson.id)
        response2 = await client.post("/api/cards/", json=create_card.model_dump(mode="json"))

        card = Card(**response2.json())

        response3 = await client.get(f"/api/cards/{lesson.id}")
        cards = [Card(**i) for i in response3.json()]

        assert cards[0].id == card.id
