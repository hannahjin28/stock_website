import arxiv
import json
from datetime import datetime

def fetch_papers():
    search = arxiv.Search(
        query = "cat:cs.AI",  # Change this to your preferred category
        max_results = 10,
        sort_by = arxiv.SortCriterion.SubmittedDate
    )
    
    papers = []
    for result in search.results():
        papers.append({
            'title': result.title,
            'authors': ', '.join(author.name for author in result.authors),
            'abstract': result.summary,
            'pdf_url': result.pdf_url,
            'published': result.published.isoformat()
        })
    
    with open('papers.json', 'w') as f:
        json.dump(papers, f, indent=2)

if __name__ == '__main__':
    fetch_papers()
