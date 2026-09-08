from fastapi import APIRouter
from pydantic import BaseModel

from app.services.llm import generate_response


router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post(
    "",
    response_model=ChatResponse,
)
async def chat(
    request: ChatRequest,
):
    response = await generate_response(
        request.message
    )

    return ChatResponse(
        response=response
    )