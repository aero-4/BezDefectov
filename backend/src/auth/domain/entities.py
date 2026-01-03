import dataclasses
from pydantic import BaseModel


class TokenType(enum.StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"


class TokenData(BaseModel):
    user_id: int
    aud: str | None = None
    iss: str | None = None
    jti: str | None = None
    exp: datetime.datetime