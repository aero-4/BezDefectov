import httpx
import pytest

from src.dialogs.domain.entities import Dialog
from src.dialogs.presentation.dtos import DialogCreateDTO, DialogUpdateDTO
from tests.integration.conftest import base_url
from tests.integration.lessons.test_lessons import test_add_lesson


@pytest.mark.asyncio
async def test_add_dialog_success(clear_db):
    async with httpx.AsyncClient(base_url=base_url) as client:
        lesson = await test_add_lesson(clear_db)

        dto = DialogCreateDTO(user_name="Alex", content="Привет, как у вас дела?", lesson_id=lesson.id)
        response = await client.post("/dialogs/", json=dto.model_dump())

        dialog = Dialog(**response.json())

        assert response.status_code == 200
        assert dialog.lesson_id == lesson.id

        return lesson, dialog


@pytest.mark.asyncio
async def test_update_dialog_success(clear_db, new_user):
    async with httpx.AsyncClient(base_url=base_url) as client:
        lesson, dialog = await test_add_dialog_success(clear_db, new_user)
        dto = DialogUpdateDTO(user_name="Leila1234")
        response = await client.patch(f"/dialogs/{lesson.id}", json=dto.model_dump())

        dialog = Dialog(**response.json())

        assert response.status_code == 200
        assert dialog.user_name == dto.user_name


@pytest.mark.asyncio
async def test_delete_dialog_success(clear_db, new_user):
    async with httpx.AsyncClient(base_url=base_url) as client:
        lesson, dialog = await test_add_dialog_success(clear_db, new_user)

        response = await client.delete(f"/dialogs/{lesson.id}")

        assert response.json() is None
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_all_dialogs_success(clear_db, new_user):
    async with httpx.AsyncClient(base_url=base_url) as client:
        lesson, dialog = await test_add_dialog_success(clear_db, new_user)

        response = await client.get(f"/dialogs/{lesson.id}")
        dialogs = [Dialog(**i) for i in response.json()]

        assert dialogs[0].user_name == dialog.user_name
