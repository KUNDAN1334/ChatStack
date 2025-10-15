import requests
from bs4 import BeautifulSoup
import json
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class WebScraper:
    """Scrape Prodesk website for knowledge base"""
    
    def __init__(self, base_url: str = "https://prodesk.in"):
        self.base_url = base_url
        self.pages = [
            "/",
            "/services",
            "/software-development",
            "/who-we-are-1",
            "/what-we-do-1",
        ]
    
    def scrape_page(self, url: str) -> Dict[str, str]:
        """Scrape single page"""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header']):
                element.decompose()
            
            # Extract text
            text = soup.get_text(separator=' ', strip=True)
            
            # Clean text
            text = ' '.join(text.split())
            
            return {
                "url": url,
                "content": text,
                "source": url.replace(self.base_url, "")
            }
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
            return {"url": url, "content": "", "source": ""}
    
    def scrape_all(self) -> List[Dict[str, str]]:
        """Scrape all pages"""
        knowledge_base = []
        
        for page in self.pages:
            url = f"{self.base_url}{page}"
            logger.info(f"Scraping: {url}")
            
            data = self.scrape_page(url)
            if data["content"]:
                knowledge_base.append(data)
        
        return knowledge_base
    
    def save_to_file(self, filepath: str):
        """Scrape and save to JSON file"""
        knowledge = self.scrape_all()
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(knowledge, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Saved knowledge base to {filepath}")
        return knowledge

# Standalone script usage
if __name__ == "__main__":
    scraper = WebScraper()
    scraper.save_to_file("../data/prodesk_knowledge.json")
