// ============================================
// DATA SECTION - PASTE EXPORTED DATA HERE
// ============================================
const defaultBooks = [
    { "title": "Blood Relatives", "category": "An Inspector Griffin Mystery", "meta": "Inspector Griffin Mystery", "coverUrl": "Blood Relatives.jpg", "synopsis": "Adam Griffin meets Finn Williams...", "amazonUrl": "", "goodreadsUrl": "", "pdfUrl": "", "epubUrl": "", "isVisible": true },
    { "title": "The Crypto Mystery Weekend", "category": "An Inspector Griffin Mystery", "meta": "Inspector Griffin Mystery", "coverUrl": "A Crypto Mystery Weekend3.jpg", "synopsis": "A murder at a luxury estate...", "amazonUrl": "", "goodreadsUrl": "", "pdfUrl": "", "epubUrl": "", "isVisible": true },
    { "title": "The Silent Observer", "category": "Other Works", "meta": "Psychological Thriller", "coverUrl": "silent.jpg", "synopsis": "A standalone thriller about a witness who saw too much.", "amazonUrl": "", "goodreadsUrl": "", "pdfUrl": "", "epubUrl": "", "isVisible": true }
];

const defaultCharacters = [
    { "name": "Adam Griffin", "role": "The Analytical Investigator", "bio": "Managing his grandmother's estate...", "coverUrl": "", "isVisible": true }
];

const defaultSocials = {
    facebook: "",
    x: "",
    instagram: ""
};
// ============================================
// END OF DATA SECTION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderPublic();
    renderFooter();
});

function renderPublic() {
    const griffinBooks = defaultBooks.filter(b => b.isVisible && b.category === "An Inspector Griffin Mystery");
    const otherBooks = defaultBooks.filter(b => b.isVisible && b.category === "Other Works");

    const createBookCard = (b) => `
        <div class="book-card">
            <div class="book-cover"><img src="${b.coverUrl}" onerror="this.style.display='none'"></div>
            <div class="card-content">
                <h3>${b.title}</h3>
                <p class="meta">${b.meta}</p>
                <p class="synopsis">${b.synopsis}</p>
                <div class="book-action-links">
                    ${b.amazonUrl ? `<a href="${b.amazonUrl}" target="_blank" class="btn-small btn-edit">Buy on Amazon</a>` : ''}
                    ${b.goodreadsUrl ? `<a href="${b.goodreadsUrl}" target="_blank" class="btn-small btn-toggle">Goodreads</a>` : ''}
                    ${b.pdfUrl ? `<a href="${b.pdfUrl}" target="_blank" class="btn-small btn-toggle">Download PDF</a>` : ''}
                    ${b.epubUrl ? `<a href="${b.epubUrl}" target="_blank" class="btn-small btn-toggle">Download EPUB</a>` : ''}
                </div>
            </div>
        </div>
    `;

    document.getElementById('books-griffin').innerHTML = griffinBooks.map(createBookCard).join('') || '<p style="color:var(--text-secondary); font-style:italic;">No books in this category yet.</p>';

    const otherBooksContainer = document.getElementById('books-other');
    const otherBooksHeader = document.getElementById('other-works-header');
    
    if (otherBooks.length === 0) {
        otherBooksContainer.style.display = 'none';
        otherBooksHeader.style.display = 'none';
    } else {
        otherBooksContainer.style.display = 'grid';
        otherBooksHeader.style.display = 'flex';
        otherBooksContainer.innerHTML = otherBooks.map(createBookCard).join('');
    }

    document.getElementById('dossiers-container').innerHTML = defaultCharacters.filter(c => c.isVisible).map(c => `
        <div class="dossier-card">
            ${c.coverUrl ? `<div class="book-cover" style="aspect-ratio: 1/1;"><img src="${c.coverUrl}" onerror="this.style.display='none'"></div>` : ''}
            <div class="card-content"><h3>${c.name}</h3><p class="meta">${c.role}</p><p class="synopsis">${c.bio}</p></div>
        </div>
    `).join('');
}

function renderFooter() {
    const container = document.getElementById('footer-socials');
    let html = '';
    
    if (defaultSocials.facebook) {
        html += `<a href="${defaultSocials.facebook}" target="_blank" aria-label="Facebook">
            <svg viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
        </a>`;
    }
    if (defaultSocials.x) {
        html += `<a href="${defaultSocials.x}" target="_blank" aria-label="X">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>`;
    }
    if (defaultSocials.instagram) {
        html += `<a href="${defaultSocials.instagram}" target="_blank" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>`;
    }
    container.innerHTML = html;
}

function toggleMenu() { 
    document.getElementById('navLinks').classList.toggle('active'); 
}
