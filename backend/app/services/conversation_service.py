from sqlalchemy.orm import Session
from typing import AsyncGenerator, List, Optional

from app.models.conversation import Conversation
from app.models.message import Message, MessageRole
from app.schemas.conversation import ConversationCreate
from app.schemas.message import MessageCreate
from app.services.ai_service import ai_service


class ConversationService:
    """Service for conversation operations."""

    def get_user_conversations(self, db: Session, user_id: int) -> List[Conversation]:
        """Get all conversations for a user."""
        return (
            db.query(Conversation)
            .filter(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .all()
        )

    def get_by_id(self, db: Session, conversation_id: int, user_id: int) -> Optional[Conversation]:
        """Get conversation by ID for a specific user."""
        return (
            db.query(Conversation)
            .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
            .first()
        )

    def create(self, db: Session, user_id: int, conversation_in: ConversationCreate) -> Conversation:
        """Create new conversation."""
        db_conversation = Conversation(
            title=conversation_in.title or "New Conversation",
            user_id=user_id,
        )
        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)
        return db_conversation

    def delete(self, db: Session, conversation_id: int, user_id: int) -> bool:
        """Delete conversation."""
        conversation = self.get_by_id(db, conversation_id, user_id)
        if not conversation:
            return False
        db.delete(conversation)
        db.commit()
        return True

    def get_messages(self, db: Session, conversation_id: int) -> List[Message]:
        """Get all messages in a conversation."""
        return (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .all()
        )

    async def add_message_and_respond(
        self,
        db: Session,
        conversation_id: int,
        message_in: MessageCreate,
        model: Optional[str] = None,
    ) -> tuple[Message, Message]:
        """Add user message and generate AI response."""
        # Save user message
        user_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=message_in.content,
        )
        db.add(user_message)
        db.commit()
        db.refresh(user_message)

        # Get conversation history for context
        messages = self.get_messages(db, conversation_id)
        message_history = [{"role": msg.role.value, "content": msg.content} for msg in messages]

        # Generate AI response
        ai_response_content = await ai_service.generate_response(message_history, model)

        # Save AI response
        ai_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=ai_response_content,
            model=model or ai_service.default_model,
        )
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)

        return user_message, ai_message

    async def add_message_and_respond_stream(
        self,
        db: Session,
        conversation_id: int,
        message_in: MessageCreate,
        model: Optional[str] = None,
    ) -> AsyncGenerator[tuple[str, Optional[Message]], None]:
        """Add user message and stream AI response chunks."""
        # Save user message
        user_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=message_in.content,
        )
        db.add(user_message)
        db.commit()
        db.refresh(user_message)

        # Get conversation history for context
        messages = self.get_messages(db, conversation_id)
        message_history = [{"role": msg.role.value, "content": msg.content} for msg in messages]

        # Stream AI response
        full_response = ""
        async for chunk in ai_service.generate_response_stream(message_history, model):
            full_response += chunk
            yield chunk, None

        # Save the complete AI response
        ai_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=full_response,
            model=model or ai_service.default_model,
        )
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)

        yield "", ai_message


conversation_service = ConversationService()
