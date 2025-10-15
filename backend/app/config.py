from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = os.getenv("MONGODB_URL")
    database_name: str = os.getenv("DATABASE_NAME", "prodesk_chatbot")
    
    # Groq API
    groq_api_key: str = os.getenv("GROQ_API_KEY")
    
    # Application
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", 8000))
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ]
    
    # Vector Store
    vectorstore_path: str = os.getenv("VECTORSTORE_PATH", "./data/vectorstore")
    knowledge_file: str = os.getenv("KNOWLEDGE_FILE", "./data/prodesk_knowledge.json")
    
    class Config:
        env_file = ".env"

settings = Settings()
