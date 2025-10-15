from groq import Groq
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class GroqService:
    """Service for Groq API interactions"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = "llama-3.1-8b-instant"
    
    def generate_response(self, prompt: str, temperature: float = 0.5) -> str:
        """Generate response using Groq"""
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful customer support assistant for Prodesk, a software development company. Provide accurate, friendly, and professional responses based on the provided context."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=temperature,
                max_tokens=500,
            )
            
            return completion.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again."

groq_service = GroqService()
