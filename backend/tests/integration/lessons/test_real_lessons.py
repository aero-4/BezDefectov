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

from src.dialogs.presentation.dtos import DialogCreateDTO
from src.dialogs.domain.entities import Dialog


def load_lines(path: str) -> list[str]:
    with open(path, encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


@pytest.mark.asyncio
async def test_some_real_dialogs(clear_db):
    async with AsyncClient(base_url=base_url) as client:
        content_r = {
            "Скороговорки": load_lines("./files/r_skorogovorki.txt"),
            "Слоги": load_lines("./files/r_slogi.txt"),
            "Предложения": load_lines("./files/r_predlojenie.txt"),
            "Диалоги": load_lines("./files/r_dialogi.txt")
        }

        content_sh = {
            "Скороговорки": load_lines("./files/sh_skorogovorki.txt"),
            "Слоги": load_lines("./files/sh_slogi.txt"),
            "Предложения": load_lines("./files/sh_predlojenie.txt"),
            "Диалоги": load_lines("./files/sh_dialogi.txt")
        }

        lessons = []
        for _ in range(10):
            lesson_type = random.choice([LessonTypes.r, LessonTypes.sh])
            dto = LessonCreateDTO(
                duration=random.randint(10, 20),
                type=lesson_type,
            )
            r = await client.post("/api/lessons/", json=dto.model_dump(mode="json"))
            assert r.status_code == 200
            lessons.append(Lesson(**r.json()))

        for lesson in lessons:
            queues = content_r if lesson.type == LessonTypes.r else content_sh

            cards = []
            dialogs = []
            for category, texts in queues.items():
                for idx, text in enumerate(texts, start=1):
                    if category == "Диалоги":
                        user_name, content = text.split(":")
                        dialogs.append((user_name, content, idx - 1))
                    else:
                        cards.append((category, text))

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

            for user_name, content, index in dialogs:
                dialog_dto = DialogCreateDTO(
                    user_name=user_name,
                    content=content,
                    lesson_id=lesson.id
                )
                r = await client.post(
                    "/api/dialogs/",
                    json=dialog_dto.model_dump(mode="json"),
                )

                assert r.status_code == 200

                dialog = Dialog(**r.json())

                assert dialog.user_name == user_name
                assert dialog.content == content
                assert dialog.lesson_id == lesson.id
