import datetime

import pytest
import httpx
from httpx import AsyncClient

from src.auth.presentation.dtos import AuthUserDTO
from src.cards.domain.entities import Card
from src.cards.presentation.dtos import CardCreateDTO
from src.lessons.domain.entities import Lesson
from src.lessons.infrastructure.db.orm import LessonTypes
from src.lessons.presentation.dtos import LessonCreateDTO, LessonUpdateDTO
from src.users.domain.entities import User
from src.users.presentation.dtos import UserCreateDTO
from src.utils.strings import generate_random_alphanum
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


@pytest.mark.asyncio
async def test_delete_lesson(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lesson = await test_add_lesson(clear_db)

        response = await client.delete(f"/api/lessons/{lesson.id}")

        assert response.status_code == 200
        assert response.json() is None


@pytest.mark.asyncio
async def test_update_lesson(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        lesson = await test_add_lesson(clear_db)

        lesson_data = LessonUpdateDTO(duration=21, type=LessonTypes.sh)
        response = await client.patch(f"/api/lessons/{lesson.id}", json=lesson_data.model_dump())
        lesson_updated = Lesson(**response.json())

        assert lesson_updated.id == lesson.id


@pytest.mark.asyncio
async def test_update_series_start(clear_db, new_user):
    async with AsyncClient(base_url=base_url) as client:
        lesson = await test_add_lesson(clear_db)

        await new_user(client)

        response = await client.options(f"/api/lessons/series")
        user = User(**response.json())

        print(user)
        assert user.series_days == 1



@pytest.mark.asyncio
async def test_update_series_continue(clear_db, new_user):
    async with AsyncClient(base_url=base_url) as client:
        lesson = await test_add_lesson(clear_db)

        await new_user(client)

        response = await client.options(f"/api/lessons/series")
        user = User(**response.json())
        assert user.series_days == 1

        response = await client.options(f"/api/lessons/series")
        user = User(**response.json())
        assert user.series_days != 2




@pytest.mark.asyncio
async def test_update_series_finish(clear_db, new_user):
    async with AsyncClient(base_url=base_url) as client:
        data = UserCreateDTO(email=generate_random_alphanum() + "@email.com",
                             password=generate_random_alphanum(),
                             updated_at=datetime.datetime(day=10, month=4, year=2024),
                             series_days=7)
        response = await client.post("/api/users/", json=data.model_dump(mode="json"))
        user = User(**response.json())

        response4 = await client.post("/api/auth/login", json=AuthUserDTO(email=data.email, password=data.password).model_dump())

        client.cookies.update(response4.cookies)

        response2 = await client.options("/api/lessons/series")
        user_updated = User(**response2.json())

        assert user_updated.series_days == 1

        response3 = await client.get("/api/users/me")
        user_me = User(**response3.json())

        assert user_me.series_days == 1
