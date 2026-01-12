from abc import ABC

import httpx

from src.lessons.domain.interfaces.lesson_provider import InterfaceAIProvider


class GPTVoiceToTextProvider(InterfaceAIProvider, ABC):
    API_URL = "https://example.com"

    def __init__(self, token):
        super().__init__(token)

    async def request(self, data: dict) -> dict:
        async with httpx.AsyncClient(base_url=self.API_URL) as client:
            response = await client.post("/", data=data)

        return response.json()
