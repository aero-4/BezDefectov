import asyncio
import logging
from typing import List

from src.cards.domain.entities import CardCreate
from src.cards.domain.interfaces.card_uow import ICardUnitOfWork
from src.dialogs.domain.entities import DialogCreate
from src.dialogs.domain.interfaces.dialog_uow import IDialogUnitOfWork
from src.lessons.domain.entities import GenerateLessonCreate, LessonCreate, Lesson, Prompts
from src.lessons.domain.interfaces.lesson_uow import ILessonUnitOfWork
from src.lessons.domain.interfaces.ai_provider import IAIProvider
from src.lessons.presentation.dtos import GenerateLessonCreateDTO


async def generate_lesson(lesson_data: GenerateLessonCreateDTO,
                          gpt_provider: IAIProvider,
                          uow_cards: ICardUnitOfWork,
                          uow_dialogs: IDialogUnitOfWork,
                          uow_lessons: ILessonUnitOfWork) -> Lesson:
    lesson_data = GenerateLessonCreate(**lesson_data.model_dump())
    lesson = LessonCreate(**lesson_data.model_dump())
    prompt_cards, prompt_dialogs = Prompts.get(lesson_data.type)

    result = await gpt_provider.response(prompt_cards)
    result2 = await gpt_provider.response(prompt_dialogs)
    cards_response = result
    dialogs_response = result2

    print(cards_response, dialogs_response)

    async with uow_lessons:
        lesson = await uow_lessons.lessons.add(lesson)
        await uow_lessons.commit()

    async with uow_cards:
        cards_data = []
        for c in cards_response.split(Prompts.SEPARATOR_RESULT):
            try:
                title, text = c.split(Prompts.SEPARATOR_LINE)
                cards_data.append(CardCreate(title=title, text=text, lesson_id=lesson.id))
            except Exception as e:
                logging.exception("Error spliting", exc_info=True)

        cards = await uow_cards.cards.add_all(cards_data)
        await uow_cards.commit()

    async with uow_dialogs:
        dialogs_data = []
        for d in dialogs_response.split(Prompts.SEPARATOR_RESULT):
            try:
                user_name, content = d.split(Prompts.SEPARATOR_LINE)
                cards_data.append(DialogCreate(user_name=user_name, content=content, lesson_id=lesson.id))
            except Exception as e:
                logging.exception("Error spliting", exc_info=True)

        dialogs = await uow_dialogs.dialogs.add_all(dialogs_data)
        await uow_dialogs.commit()

    return lesson
