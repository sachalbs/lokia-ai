from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageBase(BaseModel):
    content: str
    role: MessageRole = MessageRole.USER


class MessageCreate(BaseModel):
    content: str


class MessageResponse(MessageBase):
    id: int
    conversation_id: int
    model: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
