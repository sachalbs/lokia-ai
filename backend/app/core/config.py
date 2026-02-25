from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Lokia AI"
    APP_VERSION: str = "0.2.0"
    DEBUG: bool = False

    # API
    API_V1_PREFIX: str = "/api/v1"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # Database
    DATABASE_URL: str = "postgresql://lokia:lokia@localhost:5432/lokia"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI Providers (cloud)
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    DEFAULT_AI_MODEL: str = "qwen-local"

    # Local Model (vLLM) - Points to the GPU server
    LOCAL_MODEL_URL: str = "http://localhost:8080/v1"
    LOCAL_MODEL_NAME: str = "Qwen/Qwen2.5-32B-Instruct-AWQ"

    # Inference parameters - optimized for Qwen 30B quality
    AI_TEMPERATURE: float = 0.7
    AI_TOP_P: float = 0.9
    AI_TOP_K: int = 20
    AI_MAX_TOKENS: int = 4096
    AI_REPETITION_PENALTY: float = 1.05

    # System prompt
    AI_SYSTEM_PROMPT: str = (
        "Tu es Lokia, une assistante IA intelligente, utile et bienveillante. "
        "Tu réponds de manière précise, structurée et naturelle. "
        "Tu t'adaptes à la langue de l'utilisateur. "
        "Quand on te pose une question technique, tu donnes des réponses détaillées avec des exemples concrets. "
        "Tu es honnête : si tu ne sais pas quelque chose, tu le dis clairement."
    )

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Backend performance
    UVICORN_WORKERS: int = 4

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
