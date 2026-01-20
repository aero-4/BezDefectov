import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.auth.presentation.api import auth_api_router
from src.auth.presentation.middlewares.authentication import AuthenticationMiddleware
from src.auth.presentation.middlewares.jwtrefresh import JWTRefreshMiddleware
from src.auth.presentation.middlewares.security import SecurityMiddleware
from src.cards.presentation.api import cards_api_router
from src.core.config import settings
from src.core.domain.exceptions import AppException
from src.core.infrastructure.redis_setup import redis_ping_connection
from src.db.utils import recreate_schema
from src.dialogs.presentation.api import dialogs_api_router
from src.lessons.presentation.api import lessons_api_router
from src.users.presentation.api import users_api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis_ping_connection()
    # await recreate_schema()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            **(exc.extra or {})
        }
    )


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    try:
        app.openapi_schema = get_openapi(title=..., version=..., routes=app.routes)
    except Exception:
        import traceback;
        traceback.print_exc()
        raise
    return app.openapi_schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.add_middleware(SecurityMiddleware)
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(JWTRefreshMiddleware)

app.include_router(auth_api_router, prefix="/auth", tags=["Auth"])
app.include_router(lessons_api_router, prefix="/lessons", tags=["Lessons"])
app.include_router(cards_api_router, prefix="/cards", tags=["Cards"])
app.include_router(users_api_router, prefix="/users", tags=["Users"])
app.include_router(dialogs_api_router, prefix="/dialogs", tags=["Dialogs"])
