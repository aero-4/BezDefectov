import datetime

from src.lessons.presentation.dependencies import LessonUoWDeps
from src.users.domain.entities import UserUpdate, User
from src.users.presentation.dependencies import UserUoWDeps
from src.utils.datetimes import is_yesterday_two_dates, is_today


async def update_series(uow: UserUoWDeps, user: User) -> User:
    if not user.updated_at:  # нет даты последнего обновления
        user_data = UserUpdate(id=user.id, series_days=1)

    elif is_today(user.updated_at.date()):  # сегодняшняя ничего не делаем
        return user

    elif is_yesterday_two_dates(user.updated_at.date()):  # вчера был пройден урок
        user_data = UserUpdate(id=user.id, series_days=user.series_days + 1)

    else:
        user_data = UserUpdate(id=user.id, series_days=1)

    async with uow:
        user = await uow.users.update(user_data)
        await uow.commit()

    return user
