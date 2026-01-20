import httpx
from httpx import AsyncClient

from src import settings
from src.lessons.domain.interfaces.ai_provider import IAIProvider


class GptUnnelProvider(IAIProvider):

    async def response(self, prompt: str) -> str:
        model = "gpt-4o-mini"
        data = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        }
        headers = {"Authorization": settings.GPT_UNNEL_API_KEY,
                   "Content-Type": "application/json"}
        timeout = httpx.Timeout(10.0, read=None)
        async with AsyncClient(base_url="https://gptunnel.ru/v1/",
                               headers=headers,
                               timeout=timeout,
                               verify=False) as client:
            response = await client.post("/chat/completions", json=data)
            response.raise_for_status()
            content_result = response.json().get("choices")[0].get("message").get("content")
        return content_result
