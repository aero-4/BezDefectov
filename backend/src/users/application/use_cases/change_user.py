from src.users.domain.entities import User, UserUpdate
from src.users.presentation.dependencies import UserUoWDep
from src.users.presentation.dtos import UserUpdateDTO


async def change_user(user_data: UserUpdateDTO, uow: UserUoWDep, user: User) -> User:
    user_data = UserUpdate(id=user.id, **user_data.model_dump())

    async with uow:
        user_updated = await uow.users.update(user_data)
        await uow.commit()
    return user_updated
