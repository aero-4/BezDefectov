from fastapi import APIRouter
from starlette.requests import Request

users_api_router = APIRouter()


@users_api_router.get("/me")
async def me(request: Request):
    return request.state.user.model_dump(
        exclude={"hashed_password", "id"}
    )
