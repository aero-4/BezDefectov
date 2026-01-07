from src.auth.presentation.dependencies import PasswordHasherDep
from src.users.domain.entities import User, UserCreate
from src.users.presentation.dependencies import UserUoWDeps
from src.users.presentation.dtos import UserCreateDTO


async def add_user(user: UserCreateDTO, uow: UserUoWDeps, pwd_hasher: PasswordHasherDep,
) -> User:
    user_data = UserCreate(email=user.email, hashed_password=pwd_hasher.hash(user.password), updated_at=user.updated_at, series_days=user.series_days)
    async with uow:
        new_user = await uow.users.add(user_data)
        await uow.commit()
    return new_user
