#!/usr/bin/env python3
"""
Prodesk Website Scraper
Scrapes content from Prodesk website for chatbot knowledge base
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import logging
from typing import List, Dict
from urllib.parse import urljoin, urlparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ProdeskScraper:
    """Web scraper for Prodesk website"""
    
    def __init__(self, base_url: str = "https://prodesk.in"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Pages to scrape
        self.pages = [
            "/",
            "/services",
            "/software-development",
            "/who-we-are-1",
            "/what-we-do-1",
        ]
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = ' '.join(text.split())
        # Remove special characters but keep basic punctuation
        text = text.replace('\n', ' ').replace('\r', ' ')
        return text.strip()
    
    def scrape_page(self, url: str) -> Dict[str, str]:
        """
        Scrape a single page
        
        Args:
            url: URL to scrape
            
        Returns:
            Dictionary with page data
        """
        try:
            logger.info(f"Scraping: {url}")
            
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'meta', 'link']):
                element.decompose()
            
            # Extract title
            title = soup.find('title')
            page_title = title.get_text(strip=True) if title else url
            
            # Extract main content
            # Try to find main content area
            main_content = (
                soup.find('main') or 
                soup.find('article') or 
                soup.find('div', class_=['content', 'main-content', 'page-content']) or
                soup.find('body')
            )
            
            if main_content:
                text = main_content.get_text(separator=' ', strip=True)
            else:
                text = soup.get_text(separator=' ', strip=True)
            
            # Clean text
            cleaned_text = self.clean_text(text)
            
            # Extract metadata
            description = soup.find('meta', {'name': 'description'})
            meta_description = description.get('content', '') if description else ''
            
            return {
                "url": url,
                "title": page_title,
                "content": cleaned_text,
                "description": meta_description,
                "source": url.replace(self.base_url, "") or "/",
                "word_count": len(cleaned_text.split()),
                "scraped_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
        except requests.RequestException as e:
            logger.error(f"Error scraping {url}: {e}")
            return {
                "url": url,
                "title": "",
                "content": "",
                "description": "",
                "source": url.replace(self.base_url, ""),
                "word_count": 0,
                "error": str(e)
            }
        
        except Exception as e:
            logger.error(f"Unexpected error scraping {url}: {e}")
            return {
                "url": url,
                "content": "",
                "error": str(e)
            }
    
    def scrape_all(self) -> List[Dict[str, str]]:
        """
        Scrape all configured pages
        
        Returns:
            List of page data dictionaries
        """
        knowledge_base = []
        
        logger.info(f"Starting scraping of {len(self.pages)} pages...")
        
        for page_path in self.pages:
            url = urljoin(self.base_url, page_path)
            data = self.scrape_page(url)
            
            if data.get("content"):
                knowledge_base.append(data)
                logger.info(f"✓ Scraped {url} ({data['word_count']} words)")
            else:
                logger.warning(f"✗ No content from {url}")
            
            # Be polite - add delay between requests
            time.sleep(1)
        
        logger.info(f"Scraping complete. Collected {len(knowledge_base)} pages.")
        return knowledge_base
    
    def save_to_file(self, filepath: str = "../backend/data/prodesk_knowledge.json"):
        """
        Scrape and save to JSON file
        
        Args:
            filepath: Path to save JSON file
        """
        knowledge = self.scrape_all()
        
        # Calculate statistics
        total_words = sum(page.get('word_count', 0) for page in knowledge)
        
        # Create output with metadata
        output = {
            "metadata": {
                "source": self.base_url,
                "scraped_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "total_pages": len(knowledge),
                "total_words": total_words,
            },
            "pages": knowledge
        }
        
        # Ensure directory exists
        import os
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Save to file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        logger.info(f"✅ Saved knowledge base to {filepath}")
        logger.info(f"📊 Statistics: {len(knowledge)} pages, {total_words} words")
        
        return knowledge
    
    def extract_structured_data(self) -> Dict:
        """
        Extract structured information about Prodesk
        
        Returns:
            Dictionary with structured company info
        """
        # Based on the attached file content
        return {
            "company": {
                "name": "Prodesk Engineering Manpower",
                "founded": "2012",
                "employees": "156",
                "locations": "5 global locations",
                "headquarters": "91springboard, Plot No. D-107, Sector 2, Noida, UP 201301"
            },
            "leadership": {
                "founder": "Dr. Amit Maheshwari",
                "background": "Ex-Tech Mahindra, HR Manager"
            },
            "services": [
                "Software Development",
                "IT Consulting",
                "Cybersecurity",
                "Cloud Solutions",
                "Data Analytics",
                "Mobile Application Development",
                "Website Development",
                "Logo Design"
            ],
            "industries": [
                "Manufacturing",
                "Telecom",
                "Pharmaceuticals",
                "Engineering"
            ],
            "technologies": [
                "Web Applications",
                "Mobile Apps",
                "Enterprise Software",
                "Cloud Infrastructure"
            ]
        }


def main():
    """Main execution function"""
    print("=" * 60)
    print("Prodesk Website Scraper")
    print("=" * 60)
    
    # Initialize scraper
    scraper = ProdeskScraper()
    
    # Scrape and save
    scraper.save_to_file()
    
    # Extract structured data
    structured = scraper.extract_structured_data()
    
    # Save structured data separately
    with open('../backend/data/prodesk_structured.json', 'w', encoding='utf-8') as f:
        json.dump(structured, f, indent=2, ensure_ascii=False)
    
    logger.info("✅ Structured data saved to prodesk_structured.json")
    
    print("\n" + "=" * 60)
    print("✅ Scraping Complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Check ../backend/data/prodesk_knowledge.json")
    print("2. Run: python setup_vectorstore.py")
    print("3. Start backend: uvicorn app.main:app --reload")
    print("=" * 60)


if __name__ == "__main__":
    main()
