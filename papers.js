async function fetchPapers() {
    const response = await fetch('papers.json');
    const papers = await response.json();
    
    const container = document.getElementById('papers-list');
    container.innerHTML = papers.map(paper => `
        <article class="paper">
            <h2>${paper.title}</h2>
            <p class="authors">${paper.authors}</p>
            <p class="abstract">${paper.abstract}</p>
            <a href="${paper.pdf_url}" class="button" target="_blank">Download PDF</a>
        </article>
    `).join('');
}

fetchPapers();
