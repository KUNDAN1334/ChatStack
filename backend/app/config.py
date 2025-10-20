"""Application configuration"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database (required)
    mongodb_url: str
    database_name: str = "prodesk_chatbot"
    
    # AI API (optional with default)
    groq_api_key: str = ""
    
    # Server (hardcoded - Railway handles port via start command)
    api_host: str = "0.0.0.0"
    api_port: int = int(os.environ.get("PORT", 8000))
    
    # CORS
    cors_origins: List[str] = ["*"]
    
    # Paths
    vectorstore_path: str = "./data/vectorstore"
    knowledge_file: str = "./data/prodesk_knowledge.json"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore',  # Ignore extra env vars like PORT
        case_sensitive=False
    )

settings = Settings()
