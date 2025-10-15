from fastapi import APIRouter, HTTPException, status, Depends
from ..models import AnalyticsResponse
from ..database import get_collection
from ..middleware.auth import verify_api_key
from datetime import datetime, timedelta
from typing import Dict

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/", response_model=AnalyticsResponse)
async def get_analytics(client: Dict = Depends(verify_api_key)):
    """Get analytics for authenticated client"""
    conversations_collection = get_collection("conversations")
    leads_collection = get_collection("leads")
    
    client_id = str(client["_id"])
    
    # Total chats
    total_chats = await conversations_collection.count_documents({"client_id": client_id})
    
    # Leads collected
    leads_collected = await leads_collection.count_documents({"client_id": client_id})
    
    # Chats today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    chats_today = await conversations_collection.count_documents({
        "client_id": client_id,
        "created_at": {"$gte": today_start}
    })
    
    # Leads today
    leads_today = await leads_collection.count_documents({
        "client_id": client_id,
        "created_at": {"$gte": today_start}
    })
    
    # Top queries (extract user messages)
    top_queries = []
    async for conv in conversations_collection.find({"client_id": client_id}).limit(100):
        for msg in conv.get("messages", []):
            if msg.get("role") == "user":
                top_queries.append(msg.get("content", ""))
    
    # Get most common queries (simple approach)
    from collections import Counter
    query_counts = Counter(top_queries)
    top_5_queries = [query for query, count in query_counts.most_common(5)]
    
    return AnalyticsResponse(
        total_chats=total_chats,
        leads_collected=leads_collected,
        avg_response_time=2.5,  # Placeholder - implement actual calculation
        top_queries=top_5_queries,
        chats_today=chats_today,
        leads_today=leads_today
    )

@router.get("/leads")
async def get_leads(client: Dict = Depends(verify_api_key)):
    """Get all leads for authenticated client"""
    leads_collection = get_collection("leads")
    
    client_id = str(client["_id"])
    
    leads = []
    async for lead in leads_collection.find({"client_id": client_id}).sort("created_at", -1):
        lead["_id"] = str(lead["_id"])
        leads.append(lead)
    
    return leads
