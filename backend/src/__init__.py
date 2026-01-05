import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.auth.presentation.api import auth_api_router
from src.auth.presentation.middlewares.authentication import AuthenticationMiddleware
from src.auth.presentation.middlewares.jwtrefresh import JWTRefreshMiddleware
from src.auth.presentation.middlewares.security import SecurityMiddleware
from src.core.config import settings
from src.core.domain.exceptions import AppException
from src.core.infrastructure.redis_setup import check_redis_connection
from src.db.utils import create_and_delete_tables_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await check_redis_connection()
    await create_and_delete_tables_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
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


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SecurityMiddleware)
app.add_middleware(AuthenticationMiddleware)
app.add_middleware(JWTRefreshMiddleware)

app.include_router(auth_api_router, prefix="/auth", tags=["Auth"])

