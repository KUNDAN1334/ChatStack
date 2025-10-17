from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
from typing import Optional
import logging
import certifi

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
db = Database()

async def connect_to_mongo():
    """Connect to MongoDB with SSL"""
    try:
        db.client = AsyncIOMotorClient(
            settings.mongodb_url,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        # Test connection
        await db.client.admin.command('ping')
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        logger.warning("⚠️  App will run but database features disabled")
        db.client = None  # Set to None on failure

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        logger.info("Closed MongoDB connection")

def get_database():
    """Get database instance"""
    if db.client is not None:  # Changed: is not None instead of if db.client
        return db.client[settings.database_name]
    return None

def get_collection(collection_name: str):
    """Get collection from database"""
    database = get_database()
    if database is not None:  # Changed: is not None instead of if database
        return database[collection_name]
    return None
