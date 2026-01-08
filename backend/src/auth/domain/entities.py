import datetime
import enum

from src.core.domain.entities import CustomModel


class TokenType(enum.StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"


class TokenData(CustomModel):
    user_id: int
    exp: datetime.datetime
    aud: str | None = None
    iss: str | None = None
    jti: str | None = None


class AnonymousUser(CustomModel):
    id: int | None = None
    created_at: datetime.datetime | None = None
    updated_at: datetime.datetime | None = None
    user_name: str | None = None
    email: str | None = None
    hashed_password: str | None = None
    series_days: int | None = None
