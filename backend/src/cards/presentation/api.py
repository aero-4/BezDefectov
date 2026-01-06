from fastapi import APIRouter

from src.cards.application.create_card import create_card
from src.cards.presentation.dependencies import CardUowDep
from src.cards.presentation.dtos import CardCreateDTO

cards_api_router = APIRouter()


@cards_api_router.post("/")
async def create(card: CardCreateDTO, uow: CardUowDep):
    return await create_card(card, uow)
