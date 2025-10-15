from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_groq import ChatGroq
from typing import Dict, List, Optional
import json
import os
import logging
from ..config import settings

logger = logging.getLogger(__name__)

class RAGService:
    """Retrieval-Augmented Generation service"""
    
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        self.vectorstore = None
        self.llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.5,
            groq_api_key=settings.groq_api_key
        )
        self.sessions: Dict[str, ConversationBufferMemory] = {}
        
        # Load or create vectorstore
        self._initialize_vectorstore()
    
    def _initialize_vectorstore(self):
        """Load existing vectorstore or create new one"""
        vectorstore_path = settings.vectorstore_path
        
        if os.path.exists(vectorstore_path):
            logger.info("Loading existing vectorstore...")
            try:
                self.vectorstore = FAISS.load_local(
                    vectorstore_path,
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                logger.info("Vectorstore loaded successfully")
            except Exception as e:
                logger.error(f"Error loading vectorstore: {e}")
                self._create_vectorstore()
        else:
            self._create_vectorstore()
    
    def _create_vectorstore(self):
        """Create new vectorstore from knowledge file"""
        logger.info("Creating new vectorstore...")
        
        knowledge_file = settings.knowledge_file
        
        if not os.path.exists(knowledge_file):
            logger.error(f"Knowledge file not found: {knowledge_file}")
            return
        
        # Load knowledge
        with open(knowledge_file, 'r', encoding='utf-8') as f:
            docs = json.load(f)
        
        # Split into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            length_function=len,
        )
        
        texts = []
        metadatas = []
        
        for doc in docs:
            chunks = text_splitter.split_text(doc['content'])
            texts.extend(chunks)
            metadatas.extend([{"source": doc['source']} for _ in chunks])
        
        # Create vectorstore
        self.vectorstore = FAISS.from_texts(
            texts,
            self.embeddings,
            metadatas=metadatas
        )
        
        # Save vectorstore
        os.makedirs(settings.vectorstore_path, exist_ok=True)
        self.vectorstore.save_local(settings.vectorstore_path)
        
        logger.info(f"Vectorstore created with {len(texts)} chunks")
    
    def get_or_create_memory(self, session_id: str) -> ConversationBufferMemory:
        """Get or create conversation memory for session"""
        if session_id not in self.sessions:
            self.sessions[session_id] = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="answer"
            )
        return self.sessions[session_id]
    
    def query(self, question: str, session_id: str) -> Dict[str, any]:
        """Query the RAG system"""
        try:
            if not self.vectorstore:
                return {
                    "answer": "System is initializing. Please try again in a moment.",
                    "sources": []
                }
            
            # Get memory
            memory = self.get_or_create_memory(session_id)
            
            # Create retrieval chain
            qa_chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=self.vectorstore.as_retriever(
                    search_kwargs={"k": 3}
                ),
                memory=memory,
                return_source_documents=True,
                verbose=False
            )
            
            # Get answer
            result = qa_chain({"question": question})
            
            # Extract sources
            sources = [
                doc.page_content[:100] + "..."
                for doc in result.get('source_documents', [])
            ]
            
            return {
                "answer": result['answer'],
                "sources": sources
            }
        
        except Exception as e:
            logger.error(f"RAG query error: {e}")
            return {
                "answer": "I apologize, but I encountered an error. Please try rephrasing your question.",
                "sources": []
            }
    
    def clear_session(self, session_id: str):
        """Clear conversation memory for session"""
        if session_id in self.sessions:
            del self.sessions[session_id]

# Global instance
rag_service = RAGService()
