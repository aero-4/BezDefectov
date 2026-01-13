import pydantic
from pydantic import BaseModel


class Dialog(BaseModel):
    id: int
    user_name: str
    content: str
    index: int
    lesson_id: int


class DialogCreate(BaseModel):
    user_name: str
    content: str
    index: int
    lesson_id: int


class DialogUpdate(BaseModel):
    id: int
    user_name: str | None
    content: str | None
    index: int | None
    lesson_id: int | None
