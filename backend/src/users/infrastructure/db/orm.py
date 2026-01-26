import datetime
import enum
from typing import List

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.lessons.domain.entities import SeriesLesson
from src.users.domain.entities import Roles
from src.utils.datetimes import get_timezone_now


class UsersOrm(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), onupdate=get_timezone_now, default=get_timezone_now)

    user_name: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    series_days: Mapped[int] = mapped_column(default=0)
    series: Mapped[List["SeriesOrm"]] = relationship(back_populates="user", uselist=True, lazy="selectin")
    role: Mapped[int] = mapped_column(default=Roles.USER)


class SeriesOrm(Base):
    __tablename__ = "series"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    user: Mapped["UsersOrm"] = relationship(back_populates="series", uselist=False)

    def to_entity(self):
        return SeriesLesson(
            user_id=self.user_id,
            created_at=self.created_at,
        )
