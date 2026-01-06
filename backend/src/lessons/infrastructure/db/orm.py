import datetime
from enum import Enum, StrEnum

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.utils.datetimes import get_timezone_now
from src.cards.infrastructure.db.orm import *

class LessonTypes(StrEnum):
    sh = "sh"
    r = "r"


class LessonsOrm(Base):
    __tablename__ = "lessons"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now())
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now(), onupdate=get_timezone_now())

    duration: Mapped[int] = mapped_column(nullable=False)
    type: Mapped[LessonTypes] = mapped_column(nullable=False)

    cards: Mapped[list["CardsOrm"]] = relationship(back_populates="lesson")

