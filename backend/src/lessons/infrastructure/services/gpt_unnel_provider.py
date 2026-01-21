import httpx
from httpx import AsyncClient
from aiohttp.client import ClientSession
from src import settings
from src.lessons.domain.interfaces.ai_provider import IAIProvider


class GptUnnelProvider(IAIProvider):

    async def response(self, prompt: str, model: str = settings.GPT_UNNEL_MODEL, api_key: str = settings.GPT_UNNEL_API_KEY) -> str:
        data = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        }
        headers = {"Authorization": api_key,
                   "Content-Type": "application/json"}
        async with ClientSession(headers=headers) as client:
            response = await client.post("https://gptunnel.ru/v1/chat/completions", json=data)
            response.raise_for_status()
            data = await response.json()
            content_result = data.get("choices")[0].get("message").get("content")
        return content_result
