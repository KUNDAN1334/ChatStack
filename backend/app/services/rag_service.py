"""
Lightweight RAG without heavy ML libraries
Uses Groq API for everything
"""
import json
import logging
from pathlib import Path
import httpx

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.knowledge_file = Path(__file__).parent.parent.parent / "data" / "prodesk_knowledge.json"
        self.knowledge_base = self.load_knowledge()
        self.groq_api_key = None
    
    def load_knowledge(self):
        """Load knowledge from JSON"""
        try:
            if self.knowledge_file.exists():
                with open(self.knowledge_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load knowledge: {e}")
        return []
    
    async def get_response(self, query: str) -> str:
        """Get AI response using simple keyword matching + Groq"""
        try:
            # Simple keyword search
            context = self.search_knowledge(query)
            
            # Use Groq API
            response = await self.generate_with_groq(query, context)
            return response
            
        except Exception as e:
            logger.error(f"Error: {e}")
            return self.fallback_response(query)
    
    def search_knowledge(self, query: str) -> str:
        """Simple keyword-based search - no embeddings needed"""
        query_lower = query.lower()
        keywords = query_lower.split()
        
        scored = []
        for entry in self.knowledge_base:
            content = entry.get('content', '').lower()
            score = sum(1 for kw in keywords if kw in content)
            if score > 0:
                scored.append((score, entry))
        
        scored.sort(reverse=True, key=lambda x: x[0])
        top = [e for s, e in scored[:3]]
        return "\n\n".join([e.get('content', '') for e in top])[:800]
    
    async def generate_with_groq(self, query: str, context: str) -> str:
        """Call Groq API directly"""
        from ..config import settings
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.groq_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.1-8b-instant",
                        "messages": [
                            {"role": "system", "content": f"You are Prodesk AI assistant. Context: {context}"},
                            {"role": "user", "content": query}
                        ],
                        "max_tokens": 200,
                        "temperature": 0.7
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return response.json()['choices'][0]['message']['content']
        except Exception as e:
            logger.error(f"Groq API error: {e}")
        
        return self.fallback_response(query)
    
    def fallback_response(self, query: str) -> str:
        """Fallback for common queries"""
        q = query.lower()
        
        if any(w in q for w in ['service', 'offer']):
            return "Prodesk provides IT staffing, software development, and engineering services."
        if any(w in q for w in ['hello', 'hi']):
            return "Hello! I'm Prodesk AI Assistant. How can I help you?"
        if any(w in q for w in ['contact', 'email']):
            return "You can contact Prodesk through our website. We respond within 24 hours."
        
        return "Thank you for your question! Could you provide more details?"

rag_service = RAGService()
