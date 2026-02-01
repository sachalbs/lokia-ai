from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class ConversationBase(BaseModel):
    title: Optional[str] = None


class ConversationCreate(ConversationBase):
    pass


class ConversationResponse(ConversationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ConversationWithMessages(ConversationResponse):
    messages: List["MessageResponse"] = []


from app.schemas.message import MessageResponse
ConversationWithMessages.model_rebuild()
