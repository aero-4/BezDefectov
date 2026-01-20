import datetime
import enum
import json
from typing import Any, Literal, List

from pydantic import BaseModel, model_validator

from src.core.domain.entities import CustomModel
from src.lessons.infrastructure.db.orm import LessonTypes


class Lesson(CustomModel):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    duration: int
    type: LessonTypes


class LessonCreate(BaseModel):
    duration: int
    type: LessonTypes


class LessonUpdate(BaseModel):
    id: int
    duration: int | None = None
    type: LessonTypes | None = None
    cards: list | None = None


class Dialog(BaseModel):
    user_name: str
    content: str
    lesson_id: int


class Prompts(enum.StrEnum):
    SEPARATOR_RESULT = "|"
    SEPARATOR_LINE = ":"

    _PROMPT_CARDS_TEMPLATE = " ".join([
        "Сгенерируй контент для моих карточек для тренировок {type_defect} - они должны тренировать ту или иную букву по формату.",
        "Генерируй по порядку от самых простых до самых сложных, распределив количество равномерно до своего лимита в одном ответе.",
        "Язык: русский.",
        "Без комментариев. Без нумерации. Следовать строго промту. Ни одной новой строки в ответе. Убрать все лишние пробелы и не добавлять пробелы вокруг разделителей, кроме тех, что включены в сам текст.",
        "От 50-100 карточек (карточкой является строка - Название карточки{sep_line}Текст).",
        "Типы карточек/тематика: Слоги, Слова, Словосочетания, Предложения, Скороговорки, Текст (из книги или любой другой).",
        "Формат: Название карточки (1 буква с заглавной){sep_line}Текст{sep}Название карточки{sep_line}Текст{sep}Название карточки{sep_line}Текст и т.д.",
        "пример вывода (образец): Скороговорки:Абажур на столе{sep}Скороговорки:Барабан весело гремит{sep}Скороговорки:Варенье на полке лежит{sep}Слоги:ра-ра-ра{sep}Слоги:ро-дро-тра-пра-кра-хря{sep}Предложения:Арина приводит комнату в порядок",
        "Если модель не может выдать 50-100 карточек из-за ограничения токенов, выдать максимально возможное количество в том же формате и без пояснений.",
        "Запрещено тренировать не ту букву если указан тип {type_defect} - то это либо Р либо Ш,З,Л - В слогах и в других запрещены другие буквы не включающие в себе дефектную букву"
    ])

    PROMPT_CARDS = _PROMPT_CARDS_TEMPLATE

    PROMPT_R_CARDS = _PROMPT_CARDS_TEMPLATE.format(type_defect="картавости", sep=SEPARATOR_RESULT, sep_line=SEPARATOR_LINE)
    PROMPT_SH_CARDS = _PROMPT_CARDS_TEMPLATE.format(type_defect="шипилявости", sep=SEPARATOR_RESULT, sep_line=SEPARATOR_LINE)

    _PROMPT_DIALOGS_TEMPLATE = " ".join([
        "Сгенерируй контент для моих фейковых диалогов для тренировок {type_defect} - они должны тренировать ту или иную букву и автоматизм по формату Имя говорящего{sep_line}Текст.",
        "Генерируй по порядку от самых простых до самых сложных, распределив количество равномерно до своего лимита в одном ответе.",
        "Язык: русский. Имена нормальные адекватные русские.",
        "Без комментариев. Без нумерации. Следовать строго промту. Ни одной новой строки в ответе. Убрать все лишние пробелы и не добавлять пробелы вокруг разделителей, кроме тех, что включены в самом тексте.",
        "Тематика: любая (из книги, из фильма, из сериала или фейковая). Диалоги должны быть со смыслом и больше 3 слов в одном предложении не касаясь приветствия! Также через 1-2 слова всегда должен отрабатываться дефект",
        "Диалог всегда на 2 и более человек.",
        "Длина ВСЕГО диалога: от 50 до 100 реплик (от 2 и более говорящих персон).",
        "Формат: Имя говорящего(1 буква с заглавной){sep_line}Реплика{sep}Имя говорящего(1 буква с заглавной){sep_line}Реплика{sep}... (все реплики в одной строке через '{sep}').",
        "пример вывода (образец): Александр{sep_line}Привет, как дела?{sep}Борис{sep_line}Привет, всё хорошо!{sep}Александр{sep_line}Расскажи о книге... (все реплики в одной строке через '{sep}' не использовать в предложениях '{sep}' '{sep_line}' В САМОЙ РЕПЛИКЕ имеется ввиду то есть - Александр{sep_line}Привет я изучаю эти предметы{sep_line} биология, математика ТАКАЯ РЕПЛИКА ЗАПРЕЩЕНА ПОТОМУ ЧТО В НЕЙ СИМВОЛЫ '{sep}' '{sep_line}').",
        "Если модель не может выдать требуемую длину, выдать максимально возможное количество реплик в том же формате и без пояснений."
        "В конце и в начале диалога не должно быть '{sep}'",
    ])

    PROMPT_DIALOGS = _PROMPT_DIALOGS_TEMPLATE

    PROMPT_R_DIALOGS = _PROMPT_DIALOGS_TEMPLATE.format(type_defect="картавости", sep=SEPARATOR_RESULT, sep_line=SEPARATOR_LINE)
    PROMPT_SH_DIALOGS = _PROMPT_DIALOGS_TEMPLATE.format(type_defect="шипилявости", sep=SEPARATOR_RESULT, sep_line=SEPARATOR_LINE)

    @classmethod
    def get(cls, value):
        if value == LessonTypes.r:
            return cls.PROMPT_R_CARDS, cls.PROMPT_R_DIALOGS
        else:
            return cls.PROMPT_SH_CARDS, cls.PROMPT_SH_DIALOGS


class GenerateLessonCreate(BaseModel):
    duration: int
    type: LessonTypes
