from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    mongodb_url: str
    database_name: str = "prodesk_chatbot"
    groq_api_key: str = ""
    api_host: str = "0.0.0.0"    # not used directly
    api_port: int = 8000         # not used directly
    cors_origins: List[str] = ["*"]
    vectorstore_path: str = "./data/vectorstore"
    knowledge_file: str = "./data/prodesk_knowledge.json"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        extra='ignore',
        case_sensitive=False
    )

settings = Settings()

