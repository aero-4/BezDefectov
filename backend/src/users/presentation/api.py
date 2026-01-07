from fastapi import APIRouter
from starlette.requests import Request

from src.auth.presentation.dependencies import PasswordHasherDep
from src.users.application.use_cases.add_user import add_user
from src.users.presentation.dependencies import UserUoWDeps
from src.users.presentation.dtos import UserCreateDTO

users_api_router = APIRouter()


@users_api_router.get("/me")
async def me(request: Request):
    return request.state.user.model_dump(
        exclude={"hashed_password", "id"}
    )


@users_api_router.post("/")
async def new_user(user: UserCreateDTO, uow: UserUoWDeps, pwd_hashed: PasswordHasherDep):
    return await add_user(user, uow, pwd_hashed)