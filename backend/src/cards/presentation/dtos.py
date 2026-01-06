from pydantic import BaseModel


class CardCreateDTO(BaseModel):
    title: str
    text: str
