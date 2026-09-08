import httpx

from app.config import (
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
)


async def generate_response(
    message: str,
) -> str:

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": message,
        "stream": False,
    }

    async with httpx.AsyncClient(
        timeout=120.0
    ) as client:

        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
        )

        response.raise_for_status()

        data = response.json()

    return data["response"]