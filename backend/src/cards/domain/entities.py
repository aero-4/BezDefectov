from pydantic import BaseModel


class Card(BaseModel):
    id: int
    lesson_id: int | None = None
    title: str
    text: str


class CardCreate(BaseModel):
    id: int
    lesson_id: int | None = None
    title: str
    text: str


class CardUpdate(BaseModel):
    id: int
    lesson_id: int | None = None
    title: str | None = None
    text: str | None = None
