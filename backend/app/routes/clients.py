from fastapi import APIRouter, HTTPException, status
from ..models import ClientCreate, ClientResponse, ThemeConfig
from ..database import get_collection
from datetime import datetime
import secrets
from typing import List

router = APIRouter(prefix="/api/clients", tags=["clients"])

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(client_data: ClientCreate):
    """Create a new client"""
    clients_collection = get_collection("clients")
    
    # Check if email exists
    existing = await clients_collection.find_one({"email": client_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client with this email already exists"
        )
    
    # Generate API key
    api_key = f"pk_{secrets.token_urlsafe(32)}"
    
    # Create client document
    client_doc = {
        "name": client_data.name,
        "email": client_data.email,
        "api_key": api_key,
        "website_url": client_data.website_url,
        "custom_knowledge": client_data.custom_knowledge or [],
        "theme": ThemeConfig().dict(),
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    result = await clients_collection.insert_one(client_doc)
    client_doc["_id"] = str(result.inserted_id)
    
    return ClientResponse(**client_doc)

@router.get("/", response_model=List[ClientResponse])
async def list_clients():
    """List all clients"""
    clients_collection = get_collection("clients")
    
    clients = []
    async for client in clients_collection.find():
        client["_id"] = str(client["_id"])
        clients.append(ClientResponse(**client))
    
    return clients

@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: str):
    """Get client by ID"""
    from bson import ObjectId
    clients_collection = get_collection("clients")
    
    client = await clients_collection.find_one({"_id": ObjectId(client_id)})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    client["_id"] = str(client["_id"])
    return ClientResponse(**client)

@router.patch("/{client_id}/theme")
async def update_client_theme(client_id: str, theme: ThemeConfig):
    """Update client theme configuration"""
    from bson import ObjectId
    clients_collection = get_collection("clients")
    
    result = await clients_collection.update_one(
        {"_id": ObjectId(client_id)},
        {"$set": {"theme": theme.dict()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return {"message": "Theme updated successfully"}

@router.delete("/{client_id}")
async def deactivate_client(client_id: str):
    """Deactivate a client"""
    from bson import ObjectId
    clients_collection = get_collection("clients")
    
    result = await clients_collection.update_one(
        {"_id": ObjectId(client_id)},
        {"$set": {"is_active": False}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return {"message": "Client deactivated successfully"}
