from typing import AsyncGenerator, Optional
import httpx

from app.core.config import settings


class AIService:
    """Service for AI model interactions."""

    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.anthropic_api_key = settings.ANTHROPIC_API_KEY
        self.default_model = settings.DEFAULT_AI_MODEL

    async def generate_response(
        self,
        messages: list[dict],
        model: Optional[str] = None,
    ) -> str:
        """Generate a response from the AI model."""
        model = model or self.default_model

        if model.startswith("gpt"):
            return await self._openai_completion(messages, model)
        elif model.startswith("claude"):
            return await self._anthropic_completion(messages, model)
        else:
            raise ValueError(f"Unsupported model: {model}")

    async def _openai_completion(self, messages: list[dict], model: str) -> str:
        """Generate completion using OpenAI API."""
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not configured")

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": messages,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def _anthropic_completion(self, messages: list[dict], model: str) -> str:
        """Generate completion using Anthropic API."""
        if not self.anthropic_api_key:
            raise ValueError("Anthropic API key not configured")

        # Convert messages format for Anthropic
        system_message = None
        anthropic_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                anthropic_messages.append({
                    "role": msg["role"],
                    "content": msg["content"],
                })

        async with httpx.AsyncClient() as client:
            payload = {
                "model": model,
                "max_tokens": 4096,
                "messages": anthropic_messages,
            }
            if system_message:
                payload["system"] = system_message

            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.anthropic_api_key,
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01",
                },
                json=payload,
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["content"][0]["text"]


ai_service = AIService()
