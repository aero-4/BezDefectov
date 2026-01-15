import httpx
import pytest

from src.auth.presentation.dtos import RegisterUserDTO
from src.users.domain.entities import User
from tests.integration.conftest import base_url


@pytest.mark.asyncio
async def test_get_me_user(clear_db, new_user):
    async with httpx.AsyncClient(base_url=base_url) as client:
        user = await new_user(client)
        print(user)


