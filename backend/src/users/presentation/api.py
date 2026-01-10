from fastapi import APIRouter
from starlette.requests import Request

from src.auth.presentation.dependencies import PasswordHasherDep
from src.users.application.use_cases.add_user import add_user
from src.users.application.use_cases.change_username import change_username
from src.users.presentation.dependencies import UserUoWDeps
from src.users.presentation.dtos import UserCreateDTO, UserUpdateDTO

users_api_router = APIRouter()


@users_api_router.get("/me")
async def me(request: Request):
    return request.state.user.model_dump(
        exclude={"hashed_password", "id"}
    )


@users_api_router.patch("/username")
async def username(request: Request, dto: UserUpdateDTO, uow: UserUoWDeps):
    return await change_username(dto.user_name, uow, request.state.user)


@users_api_router.post("/")
async def new_user(user: UserCreateDTO, uow: UserUoWDeps, pwd_hashed: PasswordHasherDep):
    return await add_user(user, uow, pwd_hashed)