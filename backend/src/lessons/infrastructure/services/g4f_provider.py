from src import settings
from src.lessons.domain.interfaces.ai_provider import IAIProvider
from g4f.client import AsyncClient


class G4FreeProvider(IAIProvider):  # not work bug lib
    def __init__(self):
        self.model = "gpt-4o-mini"
        self.client = AsyncClient()

    async def response(self, prompt: str, api_key: str = settings.OPENAI_API_KEY) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user",
                       "content": prompt}],
        )
        content = response.choices[0].message.content
        return content
