from fastapi import APIRouter

from src.cards.application.collect_cards import collect_cards_by_id
from src.cards.application.create_card import create_card
from src.cards.presentation.dependencies import CardUowDep
from src.cards.presentation.dtos import CardCreateDTO

cards_api_router = APIRouter()


@cards_api_router.post("/")
async def create(card: CardCreateDTO, uow: CardUowDep):
    return await create_card(card, uow)


@cards_api_router.get("/{lesson_id}")
async def get(lesson_id: int, uow: CardUowDep):
    return await collect_cards_by_id(lesson_id, uow)
