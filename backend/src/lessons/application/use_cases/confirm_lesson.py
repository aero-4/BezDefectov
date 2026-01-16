from typing import Dict, Any

from src.users.domain.entities import UserUpdate, User, UserMe
from src.users.presentation.dependencies import UserUoWDep
from src.utils.datetimes import is_yesterday_two_dates, is_today


async def update_series(uow: UserUoWDep, user: User) -> dict[str, Any] | Any:
    series = 1

    if not user.updated_at:
        series = 1

    elif is_today(user.updated_at.date()):
        return UserMe(**user.model_dump())

    elif is_yesterday_two_dates(user.updated_at.date()):
        series += 1

    user_data = UserUpdate(id=user.id, series_days=series)

    async with uow:
        user = await uow.users.update(user_data)
        await uow.commit()

    return UserMe(**user.model_dump())
