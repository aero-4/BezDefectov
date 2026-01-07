import logging

import pytest
import pytest_asyncio
from sqlalchemy import text

from src.db.engine import engine

base_url = "http://localhost:8000"
TABLES_TO_TRUNCATE = ["cards", "lessons", "users"]


@pytest_asyncio.fixture(loop_scope="session")
async def clear_db():
    async with engine.begin() as conn:
        tables = ", ".join(TABLES_TO_TRUNCATE)
        query = f"TRUNCATE TABLE {tables} RESTART IDENTITY CASCADE;"
        await conn.execute(text(query))
        logging.info("DB cleared")

    return True