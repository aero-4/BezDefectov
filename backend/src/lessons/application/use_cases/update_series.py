import datetime
from typing import Dict, Any

from src.lessons.presentation.dependencies import LessonUoWDep
from src.users.domain.entities import UserUpdate, User, UserMe
from src.users.presentation.dependencies import UserUoWDep
from src.utils.datetimes import is_yesterday, is_today


async def update_series(uow: UserUoWDep, uow_lesson: LessonUoWDep, user: User) -> dict[str, Any] | Any:
    async with uow_lesson:
        all_series = await uow_lesson.lessons.get_series(user)

        last_series = all_series[-1] if len(all_series) > 0 else []

        if last_series and last_series.created_at:
            if is_yesterday(last_series.created_at, datetime.datetime.today()):
                series = user.series_days + 1
            elif is_today(last_series.created_at, datetime.datetime.today()):
                series = user.series_days
        else:
            series = 1
        today_series = await uow_lesson.lessons.add_series(user)
        all_series.append(today_series)

    user_data = UserUpdate(id=user.id, series_days=series)

    async with uow:
        user = await uow.users.update(user_data)
        await uow.commit()

    return UserMe(series_last=all_series, **user.model_dump())
