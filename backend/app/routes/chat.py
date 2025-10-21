from fastapi import APIRouter, HTTPException, status
from ..models import ChatRequest, ChatResponse, Message, MessageRole, LeadCapture, LeadResponse
from ..database import get_collection
from ..services.rag_service import rag_service
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handle chat message"""
    clients_collection = get_collection("clients")
    conversations_collection = get_collection("conversations")
    
    # Verify API key
    client = await clients_collection.find_one({"api_key": request.api_key, "is_active": True})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    # Query RAG system
    result = await rag_service.get_response(request.message)
    
    # Save conversation
    user_message = Message(role=MessageRole.USER, content=request.message)
    assistant_message = Message(role=MessageRole.ASSISTANT, content=result)
    
    await conversations_collection.update_one(
        {
            "client_id": str(client["_id"]),
            "session_id": request.session_id
        },
        {
            "$push": {
                "messages": {
                    "$each": [
                        user_message.dict(),
                        assistant_message.dict()
                    ]
                }
            },
            "$set": {
                "updated_at": datetime.utcnow()
            },
            "$setOnInsert": {
                "created_at": datetime.utcnow(),
                "client_id": str(client["_id"]),
                "session_id": request.session_id,
                "lead_captured": None
            }
        },
        upsert=True
    )
    
    return ChatResponse(
        answer=result,
        sources=[],
        session_id=request.session_id
    )

@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def capture_lead(lead_data: LeadCapture):
    """Capture lead information"""
    clients_collection = get_collection("clients")
    conversations_collection = get_collection("conversations")
    leads_collection = get_collection("leads")
    
    # Verify API key
    client = await clients_collection.find_one({"api_key": lead_data.api_key, "is_active": True})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    # Create lead document
    lead_doc = {
        "client_id": str(client["_id"]),
        "session_id": lead_data.session_id,
        "name": lead_data.name,
        "email": lead_data.email,
        "phone": lead_data.phone,
        "message": lead_data.message,
        "created_at": datetime.utcnow()
    }
    
    result = await leads_collection.insert_one(lead_doc)
    lead_doc["_id"] = str(result.inserted_id)
    
    # Update conversation with lead info
    await conversations_collection.update_one(
        {
            "client_id": str(client["_id"]),
            "session_id": lead_data.session_id
        },
        {
            "$set": {
                "lead_captured": {
                    "name": lead_data.name,
                    "email": lead_data.email,
                    "phone": lead_data.phone
                }
            }
        }
    )
    
    return LeadResponse(**lead_doc)

@router.get("/conversations/{session_id}")
async def get_conversation(session_id: str, api_key: str):
    """Get conversation by session ID"""
    clients_collection = get_collection("clients")
    conversations_collection = get_collection("conversations")
    
    # Verify API key
    client = await clients_collection.find_one({"api_key": api_key, "is_active": True})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    conversation = await conversations_collection.find_one({
        "client_id": str(client["_id"]),
        "session_id": session_id
    })
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    conversation["_id"] = str(conversation["_id"])
    return conversation
