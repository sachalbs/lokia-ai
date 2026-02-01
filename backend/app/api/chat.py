"""
Chat API endpoints
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message request"""
    message: str
    conversation_id: Optional[str] = None
    llm_mode: str = "local"


class MessageResponse(BaseModel):
    """Message response"""
    id: str
    role: str
    content: str
    sources: Optional[List[dict]] = None
    created_at: str


class ConversationResponse(BaseModel):
    """Conversation response"""
    id: str
    title: str
    llm_mode: str
    created_at: str
    updated_at: str


class ConversationDetailResponse(ConversationResponse):
    """Conversation detail with messages"""
    messages: List[MessageResponse]


@router.post("")
async def send_message(chat_message: ChatMessage):
    """
    Send a chat message (streaming response)

    - **message**: User message
    - **conversation_id**: Optional conversation ID
    - **llm_mode**: LLM mode (local or api)
    """
    # TODO: Implement RAG + LLM streaming
    async def generate():
        yield "data: {\"content\": \"Response placeholder\"}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations():
    """
    List user conversations
    """
    # TODO: Implement conversation listing
    return []


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(conversation_id: str):
    """
    Get conversation with messages
    """
    # TODO: Implement conversation retrieval
    raise HTTPException(status_code=404, detail="Conversation not found")


@router.patch("/conversations/{conversation_id}")
async def update_conversation(conversation_id: str, title: str):
    """
    Rename conversation
    """
    # TODO: Implement conversation update
    return {"message": "Conversation updated"}


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Delete conversation
    """
    # TODO: Implement conversation deletion
    return {"message": "Conversation deleted"}
