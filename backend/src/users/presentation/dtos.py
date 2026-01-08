import datetime

from pydantic import EmailStr, Field

from src.core.domain.entities import CustomModel


class UserCreateDTO(CustomModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=32)
    updated_at: datetime.datetime | None = None
    series_days: int | None = None
