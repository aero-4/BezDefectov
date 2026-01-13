from pydantic import BaseModel


class CardCreateDTO(BaseModel):
    lesson_id: int
    title: str
    text: str
    dialog_index: int


class CardUpdateDTO(BaseModel):
    lesson_id: int | None = None
    title: str | None = None
    text: str | None = None
