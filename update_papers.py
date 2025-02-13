import arxiv
import json
from datetime import datetime

def fetch_papers():
    try:
        # Search for causal inference papers
        search = arxiv.Search(
            query = "all:causal AND all:inference",
            max_results = 10,
            sort_by = arxiv.SortCriterion.SubmittedDate,
            sort_order = arxiv.SortOrder.Descending
        )
        
        papers = []
        for result in search.results():
            papers.append({
                'title': result.title,
                'authors': [author.name for author in result.authors],
                'abstract': result.summary,
                'pdf_url': result.pdf_url,
                'arxiv_url': result.entry_id,
                'published': result.published.strftime('%Y-%m-%d'),
                'categories': result.categories
            })
        
        # Save with timestamp
        output = {
            'last_updated': datetime.utcnow().isoformat(),
            'papers': papers
        }
        
        with open('papers.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully fetched {len(papers)} papers")
        
    except Exception as e:
        print(f"Error fetching papers: {e}")
        raise

if __name__ == '__main__':
    fetch_papers()
