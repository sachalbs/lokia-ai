from typing import AsyncGenerator, Optional
import httpx
import json

from app.core.config import settings


class AIService:
    """Service for AI model interactions — supports local vLLM + cloud APIs."""

    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.anthropic_api_key = settings.ANTHROPIC_API_KEY
        self.default_model = settings.DEFAULT_AI_MODEL
        self.local_model_url = settings.LOCAL_MODEL_URL
        self.local_model_name = settings.LOCAL_MODEL_NAME

        # Inference parameters
        self.temperature = settings.AI_TEMPERATURE
        self.top_p = settings.AI_TOP_P
        self.top_k = settings.AI_TOP_K
        self.max_tokens = settings.AI_MAX_TOKENS
        self.repetition_penalty = settings.AI_REPETITION_PENALTY
        self.system_prompt = settings.AI_SYSTEM_PROMPT

    def _build_messages_with_system(self, messages: list[dict]) -> list[dict]:
        """Prepend system prompt if not already present."""
        has_system = any(m.get("role") == "system" for m in messages)
        if has_system or not self.system_prompt:
            return messages
        return [{"role": "system", "content": self.system_prompt}] + messages

    async def generate_response(
        self,
        messages: list[dict],
        model: Optional[str] = None,
    ) -> str:
        """Generate a response from the AI model."""
        model = model or self.default_model

        if model == "qwen-local" or model.startswith("local:"):
            return await self._local_completion(messages)
        elif model.startswith("gpt"):
            return await self._openai_completion(messages, model)
        elif model.startswith("claude"):
            return await self._anthropic_completion(messages, model)
        else:
            # Default: try local model
            return await self._local_completion(messages)

    async def generate_response_stream(
        self,
        messages: list[dict],
        model: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """Generate a streaming response from the local model."""
        model = model or self.default_model

        if model == "qwen-local" or model.startswith("local:") or model not in ["gpt-4", "gpt-3.5-turbo"]:
            async for chunk in self._local_completion_stream(messages):
                yield chunk
        elif model.startswith("gpt"):
            async for chunk in self._openai_completion_stream(messages, model):
                yield chunk
        else:
            async for chunk in self._local_completion_stream(messages):
                yield chunk

    async def _local_completion(self, messages: list[dict]) -> str:
        """Generate completion using local vLLM (OpenAI-compatible API)."""
        full_messages = self._build_messages_with_system(messages)

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.local_model_url}/chat/completions",
                headers={"Content-Type": "application/json"},
                json={
                    "model": self.local_model_name,
                    "messages": full_messages,
                    "temperature": self.temperature,
                    "top_p": self.top_p,
                    "max_tokens": self.max_tokens,
                    "repetition_penalty": self.repetition_penalty,
                    "stream": False,
                },
                timeout=120.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def _local_completion_stream(
        self, messages: list[dict]
    ) -> AsyncGenerator[str, None]:
        """Stream completion from local vLLM."""
        full_messages = self._build_messages_with_system(messages)

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                f"{self.local_model_url}/chat/completions",
                headers={"Content-Type": "application/json"},
                json={
                    "model": self.local_model_name,
                    "messages": full_messages,
                    "temperature": self.temperature,
                    "top_p": self.top_p,
                    "max_tokens": self.max_tokens,
                    "repetition_penalty": self.repetition_penalty,
                    "stream": True,
                },
                timeout=120.0,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            delta = data["choices"][0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue

    async def _openai_completion(self, messages: list[dict], model: str) -> str:
        """Generate completion using OpenAI API."""
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not configured")

        full_messages = self._build_messages_with_system(messages)

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": full_messages,
                    "temperature": self.temperature,
                    "top_p": self.top_p,
                    "max_tokens": self.max_tokens,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def _openai_completion_stream(
        self, messages: list[dict], model: str
    ) -> AsyncGenerator[str, None]:
        """Stream completion from OpenAI."""
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not configured")

        full_messages = self._build_messages_with_system(messages)

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": full_messages,
                    "temperature": self.temperature,
                    "top_p": self.top_p,
                    "max_tokens": self.max_tokens,
                    "stream": True,
                },
                timeout=60.0,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            delta = data["choices"][0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue

    async def _anthropic_completion(self, messages: list[dict], model: str) -> str:
        """Generate completion using Anthropic API."""
        if not self.anthropic_api_key:
            raise ValueError("Anthropic API key not configured")

        full_messages = self._build_messages_with_system(messages)

        # Convert messages format for Anthropic
        system_message = None
        anthropic_messages = []
        for msg in full_messages:
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
                "max_tokens": self.max_tokens,
                "messages": anthropic_messages,
                "temperature": self.temperature,
                "top_p": self.top_p,
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
