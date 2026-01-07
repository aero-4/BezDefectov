import httpx
import pytest

from src.auth.presentation.dtos import RegisterUserDTO
from src.users.domain.entities import User
from tests.integration.conftest import base_url


@pytest.mark.asyncio
async def test_get_me_user(clear_db):
    async with httpx.AsyncClient(base_url=base_url) as client:
        register_dto = RegisterUserDTO(email="asbadksdad@gmail.com", password="dakjsldjoiqewuieqw1")
        response = await client.post("/api/auth/register", json=register_dto.model_dump())

        client.cookies.set("access_token", response.cookies.get("access_token"))
        client.cookies.set("refresh_token", response.cookies.get("refresh_token"))

        assert response.status_code == 200
        assert response.json() == {"msg": "Register successful"}

        response2 = await client.get("/api/users/me")
        user = response2.json()

        assert user["email"] == register_dto.email
