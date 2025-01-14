async function searchBooks() {
    const query = document.getElementById('search').value.trim();
    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>Searching for "${query}"...</p>`;

    try {
        // Fetch results from Project Gutenberg's search page
        const response = await fetch(`https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(query)}`);
        const text = await response.text();

        // Parse the HTML response
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Extract book results
        const books = doc.querySelectorAll('.booklink');
        if (books.length === 0) {
            resultsDiv.innerHTML = `<p>No results found for "${query}".</p>`;
            return;
        }

        // Display results
        resultsDiv.innerHTML = '';
        books.forEach((book) => {
            const title = book.querySelector('.title').textContent;
            const author = book.querySelector('.subtitle')?.textContent || 'Unknown Author';
            const link = `https://www.gutenberg.org${book.querySelector('a').getAttribute('href')}`;

            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <h3><a href="${link}" target="_blank">${title}</a></h3>
                <p>${author}</p>
            `;
            resultsDiv.appendChild(resultItem);
        });
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error fetching results. Please try again later.</p>`;
        console.error('Error:', error);
    }
}