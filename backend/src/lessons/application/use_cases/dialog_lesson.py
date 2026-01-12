import asyncio
import base64
from typing import Dict, Any, Optional, AsyncIterator

import aiohttp
from starlette.requests import Request
from starlette.websockets import WebSocket, WebSocketDisconnect

from src.users.domain.entities import User


async def dialog_lesson(websocket: WebSocket, request: Request, user: User):
    """
    Протокол сообщений (рекомендуемый):
    1) Клиент отправляет JSON {"action":"start", "meta": {...}}  — инициализация
    2) Клиент отправляет бинарные фреймы (bytes) или JSON {"action":"chunk", "data":"<base64>"} — аудио-чанки
    3) Клиент отправляет JSON {"action":"end"} — сигнал окончания
    4) Сервер пересылает ответ(ы) от внешнего сервиса: JSON-ответы и/или бинарные данные ответа (TTS)
    """
    await websocket.accept()
    queue: asyncio.Queue[bytes] = asyncio.Queue()
    finished = asyncio.Event()
    external_result: Optional[Dict[str, Any]] = None

    # параметры и заголовки внешнего сервиса
    external_url = "https://external.example/api/process-audio-stream"

    # async def queue_reader() -> AsyncIterator[bytes]:
    #     """Генератор для aiohttp, отдаёт данные по мере поступления в очередь."""
    #     while True:
    #         chunk = await queue.get()
    #         if chunk is None:
    #             # sentinel — окончание передачи
    #             break
    #         yield chunk
    #         queue.task_done()
    #
    # async def forward_to_external() -> Dict[str, Any]:
    #     """
    #     Открывает POST на внешний сервис с телом из queue_reader и ждёт ответа.
    #     Возвращает разобранный ответ (json) или бросит исключение.
    #     """
    #     # timeout, retry и т.п. — по необходимости
    #     async with aiohttp.ClientSession() as session:
    #         async with session.post(
    #                 external_url,
    #                 data=queue_reader(),
    #         ) as resp:
    #             content_type = resp.headers.get("Content-Type", "")
    #             if "application/json" in content_type:
    #                 return await resp.json()
    #             else:
    #                 body = await resp.read()
    #                 return {"binary": body, "content_type": content_type, "status": resp.status}

    forward_task = None

    try:
        while True:
            msg = await websocket.receive()

            # клиент может посылать type и данные:
            # - если type == "websocket.disconnect" -> выйти
            # - если type == "websocket.receive" -> process
            if "type" in msg and msg["type"] == "websocket.disconnect":
                raise WebSocketDisconnect(code=1000)

            # если пришёл бинарный фрейм (fastapi даёт 'bytes')
            if "bytes" in msg and msg["bytes"] is not None:
                chunk_bytes: bytes = msg["bytes"]
                await queue.put(chunk_bytes)
                continue

            # если пришёл текст — парсим JSON
            text = msg.get("text")
            if text is None:
                # неизвестный формат — пропускаем
                continue

            # ожидаем JSON-пакет
            try:
                import json
                payload = json.loads(text)
            except Exception:
                # некорректный JSON
                await websocket.send_json({"type": "error", "reason": "invalid_json"})
                continue

            action = payload.get("action")

            if action == "start":
                # метаданные: encoding, sample_rate, language и т.д.
                meta = payload.get("meta", {})
                # можно передать meta как query params или заголовки внешнему сервису,
                # но в этом примере мы их добавим в headers как X-*
                if meta:
                    # осторожно: не добавляйте чувствительные данные в заголовки без проверки
                    headers["X-Audio-Encoding"] = str(meta.get("encoding", "pcm16"))
                    headers["X-Sample-Rate"] = str(meta.get("sample_rate", 16000))
                    language = meta.get("language")
                    if language:
                        headers["X-Language"] = language

                # старт задачи форварда — откроем post и начнём отправлять, данные будут поступать из queue_reader
                forward_task = asyncio.create_task(forward_to_external())
                await websocket.send_json({"type": "started"})
                continue

            if action == "chunk":
                # может прийти как base64-строка в поле data
                data_b64 = payload.get("data")
                if not data_b64:
                    await websocket.send_json({"type": "error", "reason": "no_chunk_data"})
                    continue
                try:
                    chunk_bytes = base64.b64decode(data_b64)
                except Exception:
                    await websocket.send_json({"type": "error", "reason": "invalid_base64"})
                    continue
                await queue.put(chunk_bytes)
                # опционально отправляем ACK
                await websocket.send_json({"type": "ack", "received_bytes": len(chunk_bytes)})
                continue

            if action == "end":
                # помечаем queue конечным элементом и ждём результата от внешнего сервиса
                await queue.put(None)  # sentinel
                finished.set()
                if forward_task is None:
                    # если forward_task не был стартован — возможно клиент не отправил start
                    await websocket.send_json({"type": "error", "reason": "no_forward_task"})
                    break

                # ждём ответ от внешнего сервиса
                try:
                    external_result = await forward_task
                except Exception as e:
                    await websocket.send_json({"type": "error", "reason": f"external_error:{e}"})
                    external_result = {"error": str(e)}
                # отправляем ответ клиенту; если получен бинарный ответ, шлём base64
                if external_result is None:
                    await websocket.send_json({"type": "result", "result": None})
                elif "binary" in external_result:
                    b = external_result["binary"]
                    b64 = base64.b64encode(b).decode("ascii")
                    await websocket.send_json({
                        "type": "result",
                        "content_type": external_result.get("content_type"),
                        "audio_base64": b64
                    })
                else:
                    await websocket.send_json({"type": "result", "result": external_result})

                # завершить сессию корректно
                break

            # неизвестное действие
            await websocket.send_json({"type": "error", "reason": "unknown_action"})

    except WebSocketDisconnect:
        # клиент закрыл соединение
        # очистка: если передача не завершена — уведомим внешний сервис о завершении
        try:
            await queue.put(None)
        except Exception:
            pass
    finally:
        # убедиться, что forward_task завершён
        if forward_task and not forward_task.done():
            try:
                # подождём небольшое время
                await asyncio.wait_for(forward_task, timeout=5.0)
            except Exception:
                forward_task.cancel()
        await websocket.close()