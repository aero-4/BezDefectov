import logging
import random

import httpx
import pytest
import pytest_asyncio
from sqlalchemy import text

from src.auth.presentation.dtos import RegisterUserDTO
from src.db.engine import engine
from src.utils.strings import generate_random_alphanum

<<<<<<< HEAD
base_url = "http://backend:8000"
=======
base_url = "http://0.0.0.0:8000"
>>>>>>> c28c48c9eb05beb14316fbb59f462d82882ba646
TABLES_TO_TRUNCATE = ["cards", "lessons", "users"]


@pytest_asyncio.fixture(loop_scope="session")
async def clear_db():
    async with engine.begin() as conn:
        tables = ", ".join(TABLES_TO_TRUNCATE)
        query = f"TRUNCATE TABLE {tables} RESTART IDENTITY CASCADE;"
        await conn.execute(text(query))
        logging.info("DB cleared")

    return True


@pytest_asyncio.fixture(loop_scope="session")
def new_user():
    async def registrate(client):
        register_dto = RegisterUserDTO(email=f"{generate_random_alphanum(16)}@gmail.com",
                                       password=f"{generate_random_alphanum(16)}")
        response = await client.post("/api/auth/register", json=register_dto.model_dump())

        client.cookies.set("access_token", response.cookies.get("access_token"))
        client.cookies.set("refresh_token", response.cookies.get("refresh_token"))

        assert response.status_code == 200
        assert response.json() == {"msg": "Register successful"}

        response2 = await client.get("/api/users/me")
        user = response2.json()

        assert user["email"] == register_dto.email

    return registrate
