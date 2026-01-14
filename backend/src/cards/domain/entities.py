from pydantic import BaseModel


class Card(BaseModel):
    id: int
    title: str
    text: str
    lesson_id: int | None = None


class CardCreate(BaseModel):
    lesson_id: int | None = None
    title: str
    text: str


class CardUpdate(BaseModel):
    id: int
    lesson_id: int | None = None
    title: str | None = None
    text: str | None = None
