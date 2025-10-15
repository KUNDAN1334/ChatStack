import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.services.scraper import WebScraper
from app.services.rag_service import RAGService

def main():
    print("Setting up Prodesk Chatbot Platform...")
    
    # Step 1: Scrape website
    print("\n Scraping Prodesk website...")
    scraper = WebScraper()
    scraper.save_to_file("../backend/data/prodesk_knowledge.json")
    
    # Step 2: Create vectorstore
    print("Creating vector store...")
    rag = RAGService()
    
    print("\nSetup complete!")
    print("\nNext steps:")
    print("1. Start backend: cd backend && uvicorn app.main:app --reload")
    print("2. Start dashboard: cd frontend/dashboard && npm run dev")
    print("3. Build widget: cd frontend/widget && npm run build")

if __name__ == "__main__":
    main()
