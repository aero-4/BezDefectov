import datetime
from enum import Enum

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.utils.datetimes import get_timezone_now


class LessonTypes(Enum, str):
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
