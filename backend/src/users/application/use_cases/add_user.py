import datetime

from src.auth.presentation.dependencies import PasswordHasherDep
from src.users.domain.entities import User, UserCreate
from src.users.presentation.dependencies import UserUoWDep
from src.users.presentation.dtos import UserCreateDTO
from src.utils.datetimes import get_timezone_now


async def add_user(user: UserCreateDTO, uow: UserUoWDep, pwd_hasher: PasswordHasherDep) -> User:
    user_data = UserCreate(email=user.email,
                           hashed_password=pwd_hasher.hash(user.password),
                           updated_at=user.updated_at or get_timezone_now(),
                           series_days=user.series_days)
    async with uow:
        new_user = await uow.users.add(user_data)
        await uow.commit()
    return new_user
