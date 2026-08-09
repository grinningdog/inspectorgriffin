// ============================================
// DATA SECTION - PASTE EXPORTED DATA HERE
// ============================================
// REMEMBER: After pasting this into script.js and uploading to GitHub,
// also update the version number in index.html (change ?v=1 to ?v=2, etc.)
// to ensure visitors see the new content immediately.
// ============================================
const defaultBooks = [
    {
        "category": "An Inspector Griffin Mystery",
        "isVisible": true,
        "amazonUrl": "",
        "goodreadsUrl": "",
        "pdfUrl": "Blood Relatives.pdf",
        "epubUrl": "Blood Relatives - Robert Chester.epub",
        "pageUrl": "blood-relatives.html",
        "title": "Blood Relatives",
        "meta": "Inspector Griffin Mystery",
        "coverUrl": "Blood Relatives.jpg",
        "synopsis": "A near-miss with a speeding van at Waterloo Station is just the opening move in a deadly new game for Adam Griffin. Reunited with his old school friend, Finn Williams—now an elite white-hat hacker—Adam thinks his biggest challenge is navigating a sudden romance and managing his grandmother's massive literary estate.\n\nA ghost from Adam's past: a woman he had never met, driven by a lifetime of bitter envy and a desperate hunger for his fortune.\n\nIn this 21st-century mystery, Adam and Finn must use every ounce of financial logic and hacking prowess to track a killer who is rapidly unravelling—before her final, desperate strike hits home."
    },
{
    "category": "An Inspector Griffin Mystery",
    "isVisible": true,
    "amazonUrl": "",
    "goodreadsUrl": "",
    "pdfUrl": "The Crypto Mystery Weekend - Robert Chester.pdf",
    "epubUrl": "The Crypto Mystery Weekend - Robert Chester.epub",
    "pageUrl": "crypto-mystery.html",
    "title": "The Crypto Mystery Weekend",
    "meta": "Inspector Griffin Mystery",
    "coverUrl": "The Crypto Mystery Weekend3.jpg",
    "synopsis": "An exclusive Murder Mystery weekend at a luxury Oxfordshire estate turns deadly when a real body is found bludgeoned in the garden.\n\nFor independently wealthy Adam Griffin and his partner Finn, a top-tier ethical hacker, the investigation quickly morphs from a cozy whodunit into a high-stakes cyber chase.\n\nAt the centre of it all? A fastidiously arrogant guest, a manipulative psychic medium and a hidden USB drive holding a secret. A secret worth killing for.\n\nTo catch a killer who has played everyone for a fool, they must follow the money—before the digital trail goes cold forever."
},
{
    "category": "An Inspector Griffin Mystery",
    "isVisible": true,
    "amazonUrl": "",
    "goodreadsUrl": "",
    "pdfUrl": "",
    "epubUrl": "",
    "pageUrl": "#",
    "title": "The Choirboy Killer",
    "meta": "An Inspector Griffin Mystery",
    "coverUrl": "the choirboy killer.jpg",
    "synopsis": "Coming Soon\n\nA killer stalks Soho. Can Adam and Finn find the murderer before he strikes again?"
}
];
const defaultCharacters = [
    {
        "isVisible": true,
        "pageUrl": "adam-griffin.html",
        "name": "Adam Griffin",
        "role": "The wealthy grandson of one of the world's greatest mystery writers.",
        "bio": "Adam Griffin inherited a fortune from his grandmother - probably the greatest crime writer of the last hundred years. He also inherited her instinct for investigating crime and scandal.\n\nWhen Adam met his partner Finn Williams they found themselves embroiled in mystery and intrigue.",
        "coverUrl": ""
    },
{
    "isVisible": true,
    "pageUrl": "finn-williams.html",
    "name": "Finn Williams",
    "role": "Master Hacker",
    "bio": "Recruited to MI5 as a teenager, Finn Williams is one of the top five computer hackers in the world. After leaving the intelligence services he became a white-hat hacker committed to protecting computer systems around the world.\n\nWhen he met Adam Griffin their mutual attraction and instant connection made a strong bond.",
    "coverUrl": ""
},
{
    "name": "Robby Dorset",
    "role": "Old family friend",
    "bio": "Robby Dorset has known Adam from Adam's birth and was the best friend of his grandmother.  Always full of surprises he is a man who knows everyone, know all their secrets and loves mystery and intrigue",
    "coverUrl": "",
    "pageUrl": "robby-dorset.html",
    "isVisible": true
}
];
const defaultSocials = {
    "facebook": "https://www.facebook.com/",
    "x": "https://www.x.com/",
    "instagram": "https://www.instagram.com/"
};
// ============================================
// END OF DATA SECTION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderPublic();
    renderFooter();
    renderDynamicBookPage();
    renderDynamicCharacterPage();
});

function renderPublic() {
    const griffinBooks = defaultBooks.filter(b => b.isVisible && b.category === "An Inspector Griffin Mystery");
    const otherBooks = defaultBooks.filter(b => b.isVisible && b.category === "Other Works");

    const createBookCard = (b) => `
    <div class="book-card">
    <div class="book-cover"><img src="${b.coverUrl}" alt="Cover of ${b.title}" onerror="this.style.display='none'"></div>
    <div class="card-content">
    <h3>${b.title}</h3>
    <p class="meta">${b.meta}</p>
    <p class="synopsis">${b.synopsis.substring(0, 150)}...</p>
    <div class="book-action-links">
    ${b.pageUrl && b.pageUrl !== '#' ? `<a href="${b.pageUrl}" class="btn-small btn-edit">Read More and download free</a>` : ''}
    ${b.pdfUrl ? `<a href="javascript:void(0);" data-url="${b.pdfUrl}" onclick="openDownloadModal(this.dataset.url)" class="btn-small btn-edit">Quick PDF Download</a>` : ''}
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
    ${c.coverUrl ? `<div class="book-cover" style="aspect-ratio: 1/1;"><img src="${c.coverUrl}" alt="Portrait of ${c.name}" onerror="this.style.display='none'"></div>` : ''}
    <div class="card-content">
    <h3>${c.name}</h3>
    <p class="meta">${c.role}</p>
    <p class="synopsis">${c.bio.substring(0, 100)}...</p>
    <div class="book-action-links">
    ${c.pageUrl ? `<a href="${c.pageUrl}" class="btn-small btn-edit">Read Interview</a>` : ''}
    </div>
    </div>
    </div>
    `).join('');
}

function renderDynamicBookPage() {
    const titleEl = document.getElementById('dynamic-title');
    if (!titleEl) return;

    const currentPage = window.location.pathname.split('/').pop();
    const book = defaultBooks.find(b => b.pageUrl && b.pageUrl.trim() === currentPage);

    if (book) {
        document.getElementById('dynamic-title').innerText = book.title;

        const coverEl = document.getElementById('dynamic-cover');
        if(coverEl) {
            coverEl.src = book.coverUrl;
            coverEl.alt = `Cover of ${book.title}`;
        }

        const synopsisEl = document.getElementById('dynamic-synopsis');
        if(synopsisEl) {
            synopsisEl.innerText = book.synopsis;
            synopsisEl.style.whiteSpace = 'pre-line';
        }

        const pdfLink = document.getElementById('dynamic-pdf-link');
        const epubLink = document.getElementById('dynamic-epub-link');
        if(pdfLink && book.pdfUrl) pdfLink.setAttribute('onclick', `openDownloadModal('${book.pdfUrl}')`);
        if(epubLink && book.epubUrl) epubLink.setAttribute('onclick', `openDownloadModal('${book.epubUrl}')`);
    }
}

function renderDynamicCharacterPage() {
    const nameEl = document.getElementById('dynamic-name');
    if (!nameEl) return;

    const currentPage = window.location.pathname.split('/').pop();
    const character = defaultCharacters.find(c => c.pageUrl && c.pageUrl.trim() === currentPage);

    if (character) {
        document.getElementById('dynamic-name').innerText = character.name;

        const roleEl = document.getElementById('dynamic-role');
        if(roleEl) roleEl.innerText = character.role;

        const bioEl = document.getElementById('dynamic-bio');
        if(bioEl) {
            bioEl.innerText = character.bio;
            bioEl.style.whiteSpace = 'pre-line';
        }
    }
}

function renderFooter() {
    const container = document.getElementById('footer-socials');
    if(!container) return;

    let html = '';
    if (defaultSocials.facebook) html += `<a href="${defaultSocials.facebook}" target="_blank" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg></a>`;
    if (defaultSocials.x) html += `<a href="${defaultSocials.x}" target="_blank" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>`;
    if (defaultSocials.instagram) html += `<a href="${defaultSocials.instagram}" target="_blank" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>`;
    container.innerHTML = html;
}

function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }

let currentDownloadUrl = '';
function openDownloadModal(url) {
    currentDownloadUrl = url;
    document.getElementById('download-modal').classList.add('active');
    document.getElementById('modal-initial-actions').classList.remove('hidden');
    document.getElementById('modal-form-container').classList.remove('active');
    document.getElementById('modal-success').style.display = 'none';
}
function closeDownloadModal() { document.getElementById('download-modal').classList.remove('active'); }
function showMailingListForm() {
    document.getElementById('modal-initial-actions').classList.add('hidden');
    document.getElementById('modal-form-container').classList.add('active');
}
function triggerDirectDownload() {
    if (currentDownloadUrl) {
        const link = document.createElement('a');
        link.href = currentDownloadUrl;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    closeDownloadModal();
}

async function handleFormSubmit(event, successMessageId, callback) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
            const successEl = document.getElementById(successMessageId);
            if(successEl) {
                successEl.style.display = 'block';
                successEl.innerText = "Success! Check your inbox.";
            }
            form.reset();
            if (callback) callback();
        } else { alert('Something went wrong. Please try again.'); }
    } catch (error) { alert('Network error. Please try again.'); }
    finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

function handleMailingListSubmit(event) {
    handleFormSubmit(event, 'modal-success', () => {
        const successEl = document.getElementById('modal-success');
        if(successEl) successEl.innerText = "You're on the list! Downloading your book...";
        setTimeout(triggerDirectDownload, 1500);
    });
}

function handleNewsletterSubmit(event) {
    handleFormSubmit(event, 'nl-success');
}

function handleContactSubmit(event) {
    handleFormSubmit(event, 'contact-success');
}
