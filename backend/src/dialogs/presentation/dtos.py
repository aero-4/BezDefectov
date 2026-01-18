from pydantic import BaseModel


class DialogCreateDTO(BaseModel):
    user_name: str
    content: str
    lesson_id: int


class DialogUpdateDTO(BaseModel):
    lesson_id: int | None = None
    user_name: str | None = None
    content: str | None = None
