async function fetchPapers() {
    try {
        const response = await fetch('papers.json');
        const data = await response.json();
        
        // Update last fetched time
        const lastUpdated = new Date(data.last_updated);
        document.getElementById('last-updated').textContent = 
            lastUpdated.toLocaleString();
        
        // Render papers
        const container = document.getElementById('papers-list');
        container.innerHTML = data.papers.map(paper => `
            <article class="paper-card">
                <h2>${paper.title}</h2>
                <p class="authors">Authors: ${paper.authors.join(', ')}</p>
                <p class="categories">Categories: ${paper.categories.join(', ')}</p>
                <p class="published">Published: ${paper.published}</p>
                <div class="abstract">
                    <h3>Abstract:</h3>
                    <p>${paper.abstract}</p>
                </div>
                <div class="paper-links">
                    <a href="${paper.arxiv_url}" class="button" target="_blank">View on arXiv</a>
                    <a href="${paper.pdf_url}" class="button" target="_blank">Download PDF</a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading papers:', error);
        document.getElementById('papers-list').innerHTML = 
            '<p class="error">Error loading papers. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchPapers);
