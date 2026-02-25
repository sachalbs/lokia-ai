from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: verify local model connectivity
    if settings.DEFAULT_AI_MODEL == "qwen-local":
        import httpx
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{settings.LOCAL_MODEL_URL}/api/tags",
                    timeout=5.0,
                )
                if resp.status_code == 200:
                    print(f"[Lokia] Connected to local model at {settings.LOCAL_MODEL_URL}")
                else:
                    print(f"[Lokia] Warning: Local model responded with status {resp.status_code}")
        except Exception as e:
            print(f"[Lokia] Warning: Cannot reach local model at {settings.LOCAL_MODEL_URL}: {e}")
            print("[Lokia] The model may not be running yet. Requests will fail until it's available.")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "model": settings.DEFAULT_AI_MODEL,
        "docs": f"{settings.API_V1_PREFIX}/docs",
    }
