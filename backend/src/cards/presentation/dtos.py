from pydantic import BaseModel


class CardCreateDTO(BaseModel):
    lesson_id: int
    title: str
    text: str


class CardUpdateDTO(BaseModel):
    lesson_id: int | None = None
    title: str | None = None
    text: str | None = None
