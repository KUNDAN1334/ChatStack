"""
Simple Setup Script - Run from backend/ directory
No complex imports, direct execution
"""

import os
import json
import sys

def setup_python_path():
    """Add backend to Python path"""
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, backend_dir)
    print(f"✓ Python path: {backend_dir}\n")

def check_structure():
    """Verify folder structure"""
    if not os.path.exists('app'):
        print(" Error: 'app' folder not found!")
        print(f"Current directory: {os.getcwd()}")
        print("\n You must run this from 'backend/' directory")
        print("\nCorrect structure:")
        print("  backend/")
        print("    ├── app/")
        print("    ├── data/")
        print("    └── run_setup.py  ← This file")
        sys.exit(1)
    print("✓ Folder structure correct\n")

def scrape_website():
    """Step 1: Scrape Prodesk website"""
    print("=" * 60)
    print(" STEP 1: Scraping Prodesk Website")
    print("=" * 60)
    
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        print(" Missing packages!")
        print("Run: pip install requests beautifulsoup4 lxml")
        sys.exit(1)
    
    base_url = "https://prodesk.in"
    pages = [
        "/",
        "/services",
        "/software-development",
        "/who-we-are-1",
        "/what-we-do-1"
    ]
    
    knowledge = []
    
    for page in pages:
        url = base_url + page
        try:
            print(f"  Scraping: {url}")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
                tag.decompose()
            
            # Extract text
            text = soup.get_text(separator=' ', strip=True)
            text = ' '.join(text.split())
            
            if text:
                knowledge.append({
                    "url": url,
                    "content": text,
                    "source": page,
                    "word_count": len(text.split())
                })
                print(f"  ✓ Success ({len(text.split())} words)")
            else:
                print(f"  ✗ No content found")
                
        except Exception as e:
            print(f"  ✗ Error: {e}")
    
    # Save to file
    os.makedirs('data', exist_ok=True)
    filepath = 'data/prodesk_knowledge.json'
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(knowledge, f, indent=2, ensure_ascii=False)
    
    total_words = sum(p['word_count'] for p in knowledge)
    print(f"\n Scraping complete!")
    print(f"   Pages scraped: {len(knowledge)}")
    print(f"   Total words: {total_words}")
    print(f"   Saved to: {filepath}\n")
    
    return len(knowledge) > 0

def create_vectorstore():
    """Step 2: Create FAISS vector store"""
    print("=" * 60)
    print(" STEP 2: Creating Vector Store")
    print("=" * 60)
    
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_community.vectorstores import FAISS
        from langchain_community.embeddings import HuggingFaceEmbeddings
    except ImportError:
        print(" Missing packages!")
        print("Run: pip install langchain langchain-community sentence-transformers faiss-cpu")
        sys.exit(1)
    
    # Load knowledge
    knowledge_file = 'data/prodesk_knowledge.json'
    if not os.path.exists(knowledge_file):
        print(f" Knowledge file not found: {knowledge_file}")
        return False
    
    print(f"  Loading: {knowledge_file}")
    with open(knowledge_file, 'r', encoding='utf-8') as f:
        docs = json.load(f)
    
    print(f"  ✓ Loaded {len(docs)} documents")
    
    # Split into chunks
    print("  Splitting into chunks...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    
    texts = []
    metadatas = []
    
    for doc in docs:
        chunks = splitter.split_text(doc['content'])
        texts.extend(chunks)
        metadatas.extend([{"source": doc['source']} for _ in chunks])
    
    print(f"  ✓ Created {len(texts)} chunks")
    
    # Create embeddings
    print("  Creating embeddings (this may take a minute)...")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # Create vectorstore
    print("  Building FAISS index...")
    vectorstore = FAISS.from_texts(texts, embeddings, metadatas=metadatas)
    
    # Save
    vectorstore_path = 'data/vectorstore'
    os.makedirs(vectorstore_path, exist_ok=True)
    vectorstore.save_local(vectorstore_path)
    
    print(f"\n Vector store created!")
    print(f"   Chunks: {len(texts)}")
    print(f"   Saved to: {vectorstore_path}\n")
    
    return True

def main():
    print("\n" + "=" * 60)
    print(" PRODESK CHATBOT SETUP")
    print("=" * 60)
    print()
    
    # Setup Python path
    setup_python_path()
    
    # Check structure
    check_structure()
    
    # Step 1: Scrape
    if not scrape_website():
        print(" Setup failed at scraping step")
        return
    
    # Step 2: Vectorstore
    if not create_vectorstore():
        print("Setup failed at vectorstore step")
        return
    
    # Success
    print("=" * 60)
    print(" SETUP COMPLETE!")
    print("=" * 60)
    print()
    print(" Next Steps:")
    print("  1. Start backend:")
    print("     uvicorn app.main:app --reload")
    print()
    print("  2. Open API docs:")
    print("     http://localhost:8000/docs")
    print()
    print("  3. Start dashboard:")
    print("     cd ../frontend/dashboard && npm run dev")
    print()
    print("=" * 60)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  Setup interrupted by user")
    except Exception as e:
        print(f"\n Unexpected error: {e}")
        import traceback
        traceback.print_exc()
