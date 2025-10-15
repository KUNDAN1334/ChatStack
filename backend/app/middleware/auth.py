from fastapi import Header, HTTPException, status
from ..database import get_collection

async def verify_api_key(api_key: str = Header(..., alias="X-API-Key")):
    """Verify API key middleware"""
    clients_collection = get_collection("clients")
    
    client = await clients_collection.find_one({"api_key": api_key, "is_active": True})
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key"
        )
    
    return client
