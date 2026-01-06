from pydantic import BaseModel


class CardCreateDTO(BaseModel):
    lesson_id: int
    title: str
    text: str
