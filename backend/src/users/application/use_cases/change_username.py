from src.users.domain.entities import UserUpdate, User
from src.users.presentation.dependencies import UserUoWDep


async def change_username(username: str, uow: UserUoWDep, user: User) -> User:
    user_data = UserUpdate(id=user.id,
                           user_name=username)

    async with uow:
        user = await uow.users.update(user_data)
        await uow.commit()

    return user
