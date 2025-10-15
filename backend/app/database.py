from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from .config import settings
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
db = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def get_database():
    """Get database instance"""
    return db.client[settings.database_name]

def get_collection(collection_name: str):
    """Get collection from database"""
    database = get_database()
    return database[collection_name]
