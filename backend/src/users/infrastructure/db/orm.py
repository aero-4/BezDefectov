import datetime
import enum
from typing import List

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.users.domain.entities import Roles
from src.utils.datetimes import get_timezone_now


class UsersOrm(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_timezone_now)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), onupdate=get_timezone_now, nullable=True)

    user_name: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    series_days: Mapped[int] = mapped_column(default=0)
    role: Mapped[int] = mapped_column(default=Roles.USER)
