import logging

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from src.db.base import Base
from src.db.engine import engine


async def drop_all_tables_cascade():
    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(
                text(f'DROP TABLE IF EXISTS "{table.name}" CASCADE')
            )

async def recreate_schema():
    async with engine.begin() as conn:
        try:
            await conn.run_sync(Base.metadata.drop_all)
            logging.error("drop all tables")
        except SQLAlchemyError as e:
            logging.warning("drop_all failed, using CASCADE", exc_info=e)
            await drop_all_tables_cascade()

        await conn.run_sync(Base.metadata.create_all)