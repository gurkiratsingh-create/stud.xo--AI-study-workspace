from fastapi import FastAPI

from app.routes.chat import router as chat_router


app = FastAPI(
    title="Stud.xo AI Service",
    version="1.0.0",
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "studxo-ai-service",
    }


app.include_router(chat_router)