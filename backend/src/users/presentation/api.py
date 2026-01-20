from fastapi import APIRouter
from starlette.requests import Request

from src.auth.presentation.dependencies import PasswordHasherDep
from src.auth.presentation.permissions import access_control
from src.users.application.use_cases.add_user import add_user
from src.users.application.use_cases.change_username import change_username
from src.users.application.use_cases.get_all_users import get_all_users
from src.users.domain.entities import Roles, UserMe
from src.users.presentation.dependencies import UserUoWDep
from src.users.presentation.dtos import UserCreateDTO, UserUpdateDTO

users_api_router = APIRouter()


@users_api_router.get("/me")
async def me(request: Request):
    return UserMe(
        created_at=request.state.user.created_at,
        user_name=request.state.user.user_name,
        email=request.state.user.email,
        series_days=request.state.user.series_days,
    )


@users_api_router.get("/")
async def get_all(uow: UserUoWDep):
    return await get_all_users(uow)


@users_api_router.patch("/username")
async def username(request: Request, dto: UserUpdateDTO, uow: UserUoWDep):
    return await change_username(dto.user_name, uow, request.state.user)


@users_api_router.post("/")
async def new_user(user: UserCreateDTO, uow: UserUoWDep, pwd_hashed: PasswordHasherDep):
    return await add_user(user, uow, pwd_hashed)
