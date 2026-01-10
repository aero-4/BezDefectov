import datetime
import random

import pytest
import httpx
from httpx import AsyncClient

from src.auth.presentation.dtos import AuthUserDTO
from src.cards.domain.entities import Card
from src.cards.presentation.dtos import CardCreateDTO
from src.lessons.domain.entities import Lesson
from src.lessons.infrastructure.db.orm import LessonTypes
from src.lessons.presentation.dtos import LessonCreateDTO, LessonUpdateDTO
from src.users.domain.entities import User, UserMe
from src.users.presentation.dtos import UserCreateDTO
from src.utils.strings import generate_random_alphanum
from tests.integration.conftest import base_url


@pytest.mark.asyncio
async def test_add_some_test_lessons(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        cards = ["Слоги", "Предложения", "Скороговорки"]
        texts = ["ра-ра-ра ро-ро-ро ре-ре-ре", "Арина приводит комнату в порядок", "Белые бараны били в барабаны"]
        types = [LessonTypes.r, LessonTypes.sh]

        for i in range(random.randint(50, 100)):
            lesson_dto = LessonCreateDTO(duration=random.randint(15, 30), type=random.choice(types))
            response = await client.post("/api/lessons/", json=lesson_dto.model_dump(mode="json"))
            lesson = Lesson(**response.json())

            for i in range(random.randint(50, 100)):
                create_card = CardCreateDTO(title=random.choice(cards), text=random.choice(texts), lesson_id=lesson.id)
                response2 = await client.post("/api/cards/", json=create_card.model_dump(mode="json"))

                card = Card(**response2.json())

                assert lesson.duration == lesson_dto.duration
                assert create_card.text == card.text

        return lesson


def load_lines(path: str) -> list[str]:
    with open(path, encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


@pytest.mark.asyncio
async def test_massive_real_unique_content(clear_db):
    async with AsyncClient(base_url=base_url) as client:

        content_r = {
            "Скороговорки": load_lines("files/r_skorogovorki.txt"),
            "Слоги": load_lines("files/r_slogi.txt"),
            "Предложения": load_lines("files/r_predlojenie.txt"),
        }

        content_sh = {
            "Скороговорки": load_lines("files/sh_skorogovorki.txt"),
            "Слоги": load_lines("files/sh_slogi.txt"),
            "Предложения": load_lines("files/sh_predlojenie.txt"),
        }

        lessons = []
        for _ in range(10):  # Можно уменьшить количество уроков, если все карты будут в одном
            lesson_type = random.choice([LessonTypes.r, LessonTypes.sh])
            dto = LessonCreateDTO(
                duration=random.randint(15, 30),
                type=lesson_type,
            )
            r = await client.post("/api/lessons/", json=dto.model_dump(mode="json"))
            assert r.status_code == 200
            lessons.append(Lesson(**r.json()))

        for lesson in lessons:
            queues = content_r if lesson.type == LessonTypes.r else content_sh

            cards = []
            for category, texts in queues.items():
                for idx, text in enumerate(texts, start=1):
                    title = f"{category}"
                    cards.append((title, text))

            random.shuffle(cards) 

            for title, text in cards:
                card_dto = CardCreateDTO(
                    title=title,
                    text=text,
                    lesson_id=lesson.id,
                )
                r = await client.post(
                    "/api/cards/",
                    json=card_dto.model_dump(mode="json"),
                )
                assert r.status_code == 200

                card = Card(**r.json())
                assert card.title == title
                assert card.text == text
                assert card.lesson_id == lesson.id


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

        assert user.series_days == 1


@pytest.mark.asyncio
async def test_update_series_start(clear_db, new_user):
    async with AsyncClient(base_url=base_url) as client:
        lesson = await test_add_lesson(clear_db)

        await new_user(client)

        response = await client.post(f"/api/lessons/series")
        user = User(**response.json())
        assert user.series_days == 1

        response = await client.post(f"/api/lessons/series")
        user = User(**response.json())
        assert user.series_days == 1


@pytest.mark.asyncio
async def test_update_series_finish_to_start(clear_db, new_user):
    async with AsyncClient(base_url=base_url) as client:
        user_data = UserCreateDTO(email=generate_random_alphanum() + "@email.com",
                                  password=generate_random_alphanum(),
                                  updated_at=datetime.datetime(day=10, month=4, year=2024),
                                  series_days=8)
        response = await client.post("/api/users/", json=user_data.model_dump(mode="json"))
        user = User(**response.json())

        assert user.email == user_data.email

        response2 = await client.post("/api/auth/login", json=AuthUserDTO(email=user_data.email, password=user_data.password).model_dump())

        assert response2.status_code == 200
        assert response2.json() == {"msg": "Login successful"}

        client.cookies.clear()
        client.cookies.set("access_token", response2.cookies.get("access_token"))
        client.cookies.set("refresh_token", response2.cookies.get("refresh_token"))

        response3 = await client.post("/api/lessons/series")
        user_updated = User(**response3.json())

        assert user_updated.series_days == 1

        response3 = await client.get("/api/users/me")
        user_me = UserMe(**response3.json())

        assert user_me.series_days == 1


@pytest.mark.asyncio
async def test_update_series_started_today(clear_db, new_user):
    async with AsyncClient(base_url=base_url) as client:
        SERIES_DAYS = 3
        user_data = UserCreateDTO(email=generate_random_alphanum() + "@email.com",
                                  password=generate_random_alphanum(),
                                  updated_at=datetime.datetime.now(),  # today
                                  series_days=SERIES_DAYS)
        response = await client.post("/api/users/", json=user_data.model_dump(mode="json"))
        user = User(**response.json())

        assert user.email == user_data.email

        response2 = await client.post("/api/auth/login", json=AuthUserDTO(email=user_data.email, password=user_data.password).model_dump())

        assert response2.status_code == 200
        assert response2.json() == {"msg": "Login successful"}

        client.cookies.clear()
        client.cookies.set("access_token", response2.cookies.get("access_token"))
        client.cookies.set("refresh_token", response2.cookies.get("refresh_token"))

        response3 = await client.post("/api/lessons/series")
        user_updated = User(**response3.json())

        assert user_updated.series_days == SERIES_DAYS

        response3 = await client.get("/api/users/me")
        user_me = UserMe(**response3.json())

        assert user_me.series_days == SERIES_DAYS
