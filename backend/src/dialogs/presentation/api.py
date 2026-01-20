from fastapi import APIRouter

from src.auth.presentation.permissions import access_control
from src.dialogs.application.use_cases.collect_dialogs import collect_dialogs
from src.dialogs.application.use_cases.create_dialog import create_dialog
from src.dialogs.application.use_cases.delete_dialog import delete_dialog
from src.dialogs.application.use_cases.update_dialog import update_dialog
from src.dialogs.presentation.dependencies import DialogUoWDep
from src.dialogs.presentation.dtos import DialogCreateDTO, DialogUpdateDTO
from src.users.domain.entities import Roles

dialogs_api_router = APIRouter()


@dialogs_api_router.post("/")
async def create(dialog_data: DialogCreateDTO, uow: DialogUoWDep):
    return await create_dialog(dialog_data, uow)


@dialogs_api_router.get("/{lesson_id}")
async def get(lesson_id: int, uow: DialogUoWDep):
    return await collect_dialogs(lesson_id, uow)


@dialogs_api_router.patch("/{id}")
async def update(id: int, dialog_data: DialogUpdateDTO, uow: DialogUoWDep):
    return await update_dialog(id, dialog_data, uow)



@dialogs_api_router.delete("/{id}")
async def delete(id: int, uow: DialogUoWDep):
    return await delete_dialog(id, uow)
