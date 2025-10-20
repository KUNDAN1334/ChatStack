from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # MongoDB
    mongodb_url: str
    database_name: str = "prodesk_chatbot"
    
    # Groq API
    groq_api_key: str = ""
    
    # Application
    api_host: str = "0.0.0.0"
    api_port: int = 8000  # Railway handles via $PORT in start command
    
    # CORS - Allow all for now
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "*"  # Allow all for testing
    ]
    
    # Vector Store
    vectorstore_path: str = "./data/vectorstore"
    knowledge_file: str = "./data/prodesk_knowledge.json"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()
