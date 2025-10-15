from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Client Models
class ThemeConfig(BaseModel):
    primary_color: str = "#0066cc"
    position: str = "bottom-right"  # bottom-right, bottom-left
    welcome_message: str = "Hello! How can I help you today?"

class ClientCreate(BaseModel):
    name: str
    email: EmailStr
    website_url: Optional[str] = None
    custom_knowledge: Optional[List[Dict[str, str]]] = []

class ClientResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    api_key: str
    website_url: Optional[str]
    theme: ThemeConfig
    is_active: bool
    created_at: datetime
    
    class Config:
        populate_by_name = True

# Chat Models
class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class Message(BaseModel):
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    api_key: str
    message: str
    session_id: str

class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []
    session_id: str

# Lead Models
class LeadCapture(BaseModel):
    api_key: str
    session_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None

class LeadResponse(BaseModel):
    id: str = Field(alias="_id")
    client_id: str
    session_id: str
    name: str
    email: str
    phone: Optional[str]
    message: Optional[str]
    created_at: datetime
    
    class Config:
        populate_by_name = True

# Analytics Models
class AnalyticsResponse(BaseModel):
    total_chats: int
    leads_collected: int
    avg_response_time: float
    top_queries: List[str]
    chats_today: int
    leads_today: int

# Conversation Models
class ConversationResponse(BaseModel):
    id: str = Field(alias="_id")
    client_id: str
    session_id: str
    messages: List[Message]
    lead_captured: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
