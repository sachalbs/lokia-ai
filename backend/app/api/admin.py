"""
Admin API endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel, EmailStr

router = APIRouter()


class StatsResponse(BaseModel):
    """Admin statistics response"""
    total_users: int
    total_documents: int
    total_conversations: int
    storage_used_mb: float


class UserResponse(BaseModel):
    """User response"""
    id: str
    email: str
    name: str
    role: str
    is_active: bool
    created_at: str
    last_login: Optional[str] = None


class CreateUserRequest(BaseModel):
    """Create user request"""
    email: EmailStr
    password: str
    name: str
    role: str = "user"


class UpdateUserRequest(BaseModel):
    """Update user request"""
    name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """
    Get tenant statistics
    """
    # TODO: Implement statistics retrieval
    return StatsResponse(
        total_users=0,
        total_documents=0,
        total_conversations=0,
        storage_used_mb=0.0
    )


@router.get("/users", response_model=List[UserResponse])
async def list_users():
    """
    List tenant users
    """
    # TODO: Implement user listing
    return []


@router.post("/users", response_model=UserResponse)
async def create_user(user_data: CreateUserRequest):
    """
    Create a new user
    """
    # TODO: Implement user creation
    return UserResponse(
        id="placeholder_id",
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        is_active=True,
        created_at="2026-02-01T00:00:00Z"
    )


@router.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_data: UpdateUserRequest):
    """
    Update user
    """
    # TODO: Implement user update
    raise HTTPException(status_code=404, detail="User not found")


@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """
    Delete user
    """
    # TODO: Implement user deletion
    return {"message": "User deleted"}
