import pytest
from httpx import AsyncClient

from src.cards.domain.entities import Card
from src.cards.presentation.dtos import CardCreateDTO, CardUpdateDTO
from src.lessons.domain.entities import Lesson
from src.lessons.infrastructure.db.orm import LessonTypes
from src.lessons.presentation.dtos import LessonCreateDTO
from tests.integration.conftest import base_url


@pytest.mark.asyncio
async def test_get_cards_with_id(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lesson_dto = LessonCreateDTO(duration=25, type=LessonTypes.r)
        response = await client.post("/lessons/", json=lesson_dto.model_dump(mode="json"))
        lesson = Lesson(**response.json())

        create_card = CardCreateDTO(title="Слоги", text="ра-ра-ра ро-ро-ро ре-ре-ре", lesson_id=lesson.id)
        response2 = await client.post("/cards/", json=create_card.model_dump(mode="json"))

        card = Card(**response2.json())

        response3 = await client.get(f"/cards/{lesson.id}")
        cards = [Card(**i) for i in response3.json()]

        assert cards[0].id == card.id


@pytest.mark.asyncio
async def test_delete_card(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lesson_dto = LessonCreateDTO(duration=25, type=LessonTypes.r)

        response = await client.post("/lessons/", json=lesson_dto.model_dump(mode="json"))
        lesson = Lesson(**response.json())
        create_card = CardCreateDTO(title="Слоги", text="ра-ра-ра ро-ро-ро ре-ре-ре", lesson_id=lesson.id)

        response2 = await client.post("/cards/", json=create_card.model_dump(mode="json"))
        card = Card(**response2.json())

        response3 = await client.delete(f"/cards/{card.id}")

        assert response3.json() is None

        response4 = await client.delete(f"/cards/{card.id}")

        assert response4.json() == {"detail": "Not found"}


@pytest.mark.asyncio
async def test_update_card(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lesson_dto = LessonCreateDTO(duration=25, type=LessonTypes.r)

        response = await client.post("/lessons/", json=lesson_dto.model_dump(mode="json"))
        lesson = Lesson(**response.json())
        create_card = CardCreateDTO(title="Слоги", text="ра-ра-ра ро-ро-ро ре-ре-ре", lesson_id=lesson.id)

        response2 = await client.post("/cards/", json=create_card.model_dump(mode="json"))
        card = Card(**response2.json())

        card_update_dto = CardUpdateDTO(lesson_id=lesson.id, text="RA_RA_RA_SH_SH_SH")
        response3 = await client.patch(f"/cards/{card.id}", json=card_update_dto.model_dump())

        card_updated = Card(**response3.json())

        assert card.text != card_updated.text
        assert card_updated.text == card_update_dto.text


