// Force HTTPS for Secure Context (Required for Web Crypto API)
// Skip this for local files (file:// protocol)
if (location.protocol !== 'https:' && location.protocol !== 'file:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    location.replace('https:' + location.href.substring(location.protocol.length));
}

// ============================================
// SECURE URL CONFIGURATION (HASHED)
// ============================================
const SECRET_HASH = '7e54c1decffb96bac7476f995ca33e6ac21ceee0e002d7afbf5f1c8f62250c69'; // MUST MATCH YOUR PUBLIC SITE

async function verifyKey(key) {
    if (!key) return false;
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return inputHash === SECRET_HASH;
}

// ============================================
// DEFAULT FALLBACK DATA
// ============================================
const defaultBooks = [
    { "title": "Blood Relatives", "category": "An Inspector Griffin Mystery", "meta": "Inspector Griffin Mystery", "coverUrl": "Blood Relatives.jpg", "synopsis": "Adam Griffin meets Finn Williams...", "amazonUrl": "", "goodreadsUrl": "", "pdfUrl": "", "epubUrl": "", "isVisible": true },
    { "title": "The Crypto Mystery Weekend", "category": "An Inspector Griffin Mystery", "meta": "Inspector Griffin Mystery", "coverUrl": "A Crypto Mystery Weekend3.jpg", "synopsis": "A murder at a luxury estate...", "amazonUrl": "", "goodreadsUrl": "", "pdfUrl": "", "epubUrl": "", "isVisible": true },
    { "title": "The Silent Observer", "category": "Other Works", "meta": "Psychological Thriller", "coverUrl": "silent.jpg", "synopsis": "A standalone thriller about a witness who saw too much.", "amazonUrl": "", "goodreadsUrl": "", "pdfUrl": "", "epubUrl": "", "isVisible": true }
];
const defaultCharacters = [
    { "name": "Adam Griffin", "role": "The Analytical Investigator", "bio": "Managing his grandmother's estate...", "coverUrl": "", "isVisible": true }
];
const defaultSocials = { facebook: "", x: "", instagram: "" };

let books = [], characters = [], socials = {}, isAdmin = false;

document.addEventListener('DOMContentLoaded', async () => {
    loadData();
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('key');
    
    // Check if already logged in or has valid URL key
    if (localStorage.getItem('admin') === 'true') {
        enableAdminMode();
    } else if (urlKey && await verifyKey(urlKey)) {
        localStorage.setItem('admin', 'true');
        enableAdminMode();
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        // Show login modal
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    }
});
function loadData() {
    let storedBooks = localStorage.getItem('rc_books');
    let storedChars = localStorage.getItem('rc_characters');
    let storedSocials = localStorage.getItem('rc_socials');
    
    books = storedBooks ? JSON.parse(storedBooks) : JSON.parse(JSON.stringify(defaultBooks));
    characters = storedChars ? JSON.parse(storedChars) : JSON.parse(JSON.stringify(defaultCharacters));
    socials = storedSocials ? JSON.parse(storedSocials) : JSON.parse(JSON.stringify(defaultSocials));
    
    // Ensure all fields exist (migration)
    books = books.map(b => ({ category: "An Inspector Griffin Mystery", isVisible: true, amazonUrl: "", goodreadsUrl: "", pdfUrl: "", epubUrl: "", ...b }));
    characters = characters.map(c => ({ isVisible: true, ...c }));
    if(!socials.facebook) socials = { ...defaultSocials, ...socials };
}

function saveData() {
    localStorage.setItem('rc_books', JSON.stringify(books));
    localStorage.setItem('rc_characters', JSON.stringify(characters));
    localStorage.setItem('rc_socials', JSON.stringify(socials));
    if (isAdmin) renderAdminLists();
}

function resetData() {
    if(confirm("This will clear all local data and restore defaults. Continue?")) {
        localStorage.removeItem('rc_books');
        localStorage.removeItem('rc_characters');
        localStorage.removeItem('rc_socials');
        location.reload();
    }
}

function enableAdminMode() {
    isAdmin = true;
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('admin-status').innerText = "Admin Access Granted";
    document.getElementById('admin-status').style.color = "var(--accent-1)";
    renderAdminLists();
    loadSocialsForm();
}

function logout() { 
    localStorage.removeItem('admin'); 
    location.reload(); 
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    ['books', 'dossiers', 'socials', 'sync'].forEach(p => document.getElementById(`admin-${p}-panel`).style.display = 'none');
    document.getElementById(`admin-${tab}-panel`).style.display = 'block';
}

// --- Render Lists ---
function renderAdminLists() {
    document.getElementById('admin-books-list').innerHTML = books.map((b, i) => `
        <div class="admin-list-item">
            <img class="admin-thumb" src="${b.coverUrl}" onerror="this.style.display='none'">
            <div class="admin-info"><h4>${b.title}</h4><span class="admin-badge">${b.category}</span><p>${b.meta}</p></div>
            <div class="admin-actions">
                <button class="btn-small btn-move" onclick="moveItem('book', ${i}, -1)" ${i === 0 ? 'disabled' : ''}>↑</button>
                <button class="btn-small btn-move" onclick="moveItem('book', ${i}, 1)" ${i === books.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="btn-small btn-toggle ${!b.isVisible ? 'is-hidden' : ''}" onclick="toggleVisibility('book', ${i})">${b.isVisible ? 'Hide' : 'Show'}</button>
                <button class="btn-small btn-edit" onclick="openBookModal(${i})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteBook(${i})">Delete</button>
            </div>
        </div>
    `).join('');

    document.getElementById('admin-dossiers-list').innerHTML = characters.map((c, i) => `
        <div class="admin-list-item">
            <img class="admin-thumb" src="${c.coverUrl || ''}" onerror="this.style.display='none'">
            <div class="admin-info"><h4>${c.name}</h4><span class="admin-badge">Character</span><p>${c.role}</p></div>
            <div class="admin-actions">
                <button class="btn-small btn-move" onclick="moveItem('char', ${i}, -1)" ${i === 0 ? 'disabled' : ''}>↑</button>
                <button class="btn-small btn-move" onclick="moveItem('char', ${i}, 1)" ${i === characters.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="btn-small btn-toggle ${!c.isVisible ? 'is-hidden' : ''}" onclick="toggleVisibility('char', ${i})">${c.isVisible ? 'Hide' : 'Show'}</button>
                <button class="btn-small btn-edit" onclick="openCharacterModal(${i})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteCharacter(${i})">Delete</button>
            </div>
        </div>
    `).join('');
}

function moveItem(type, index, direction) {
    const array = type === 'book' ? books : characters;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= array.length) return;
    const temp = array[index];
    array[index] = array[newIndex];
    array[newIndex] = temp;
    saveData();
}

function toggleVisibility(type, index) {
    if (type === 'book') books[index].isVisible = !books[index].isVisible;
    else characters[index].isVisible = !characters[index].isVisible;
    saveData();
}

// --- Modals & Saving ---
function openBookModal(index = -1) {
    document.getElementById('book-modal-title').innerText = index === -1 ? "Add Book" : "Edit Book";
    document.getElementById('book-index').value = index;
    if (index !== -1) {
        const b = books[index];
        document.getElementById('book-title').value = b.title;
        document.getElementById('book-category').value = b.category;
        document.getElementById('book-meta').value = b.meta;
        document.getElementById('book-synopsis').value = b.synopsis;
        document.getElementById('book-amazon').value = b.amazonUrl || '';
        document.getElementById('book-goodreads').value = b.goodreadsUrl || '';
        document.getElementById('book-pdf').value = b.pdfUrl || '';
        document.getElementById('book-epub').value = b.epubUrl || '';
        document.getElementById('book-preview').innerHTML = `<img src="${b.coverUrl}" onerror="this.style.display='none'">`;
    } else {
        ['book-title', 'book-meta', 'book-synopsis', 'book-amazon', 'book-goodreads', 'book-pdf', 'book-epub'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('book-category').value = 'An Inspector Griffin Mystery';
        document.getElementById('book-preview').innerHTML = '<span style="color:#666">No image selected</span>';
    }
    document.getElementById('book-modal').style.display = 'flex';
}

function saveBook(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById('book-index').value);
    const title = document.getElementById('book-title').value;
    const category = document.getElementById('book-category').value;
    const meta = document.getElementById('book-meta').value;
    const synopsis = document.getElementById('book-synopsis').value;
    const amazonUrl = document.getElementById('book-amazon').value.trim();
    const goodreadsUrl = document.getElementById('book-goodreads').value.trim();
    const pdfUrl = document.getElementById('book-pdf').value.trim();
    const epubUrl = document.getElementById('book-epub').value.trim();
    const fileInput = document.getElementById('book-image');
    let coverUrl = index !== -1 ? books[index].coverUrl : '';
    if (fileInput.files && fileInput.files[0]) coverUrl = fileInput.files[0].name;

    const newBook = { title, category, meta, synopsis, amazonUrl, goodreadsUrl, pdfUrl, epubUrl, coverUrl, isVisible: true };
    if (index !== -1) books[index] = newBook;
    else books.push(newBook);
    saveData();
    closeModal('book-modal');
}

function deleteBook(i) { if (confirm('Delete this book?')) { books.splice(i, 1); saveData(); } }

function openCharacterModal(index = -1) {
    document.getElementById('character-modal-title').innerText = index === -1 ? "Add Character" : "Edit Character";
    document.getElementById('char-index').value = index;
    if (index !== -1) {
        const c = characters[index];
        document.getElementById('char-name').value = c.name;
        document.getElementById('char-role').value = c.role;
        document.getElementById('char-bio').value = c.bio;
        if(c.coverUrl) document.getElementById('char-preview').innerHTML = `<img src="${c.coverUrl}" onerror="this.style.display='none'">`;
    } else {
        ['char-name', 'char-role', 'char-bio'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('char-preview').innerHTML = '<span style="color:#666">No image selected</span>';
    }
    document.getElementById('character-modal').style.display = 'flex';
}

function saveCharacter(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById('char-index').value);
    const name = document.getElementById('char-name').value;
    const role = document.getElementById('char-role').value;
    const bio = document.getElementById('char-bio').value;
    const fileInput = document.getElementById('char-image');
    let coverUrl = index !== -1 ? (characters[index].coverUrl || '') : '';
    if (fileInput.files && fileInput.files[0]) coverUrl = fileInput.files[0].name;

    const newChar = { name, role, bio, coverUrl, isVisible: true };
    if (index !== -1) characters[index] = newChar;
    else characters.push(newChar);
    saveData();
    closeModal('character-modal');
}

function deleteCharacter(i) { if (confirm('Delete this character?')) { characters.splice(i, 1); saveData(); } }

function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById(previewId).innerHTML = `<img src="${e.target.result}">`; };
        reader.readAsDataURL(input.files[0]);
    }
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// --- Socials ---
function loadSocialsForm() {
    document.getElementById('social-facebook').value = socials.facebook || '';
    document.getElementById('social-x').value = socials.x || '';
    document.getElementById('social-instagram').value = socials.instagram || '';
}

function saveSocials(e) {
    e.preventDefault();
    socials.facebook = document.getElementById('social-facebook').value.trim();
    socials.x = document.getElementById('social-x').value.trim();
    socials.instagram = document.getElementById('social-instagram').value.trim();
    saveData();
    alert('Social links saved!');
}

// --- Sync (Export/Import) ---
function generateExportCode() {
    const area = document.getElementById('export-code-area');
    const code = `// ============================================
// DATA SECTION - PASTE EXPORTED DATA HERE
// ============================================
const defaultBooks = ${JSON.stringify(books, null, 4)};

const defaultCharacters = ${JSON.stringify(characters, null, 4)};

const defaultSocials = ${JSON.stringify(socials, null, 4)};
// ============================================
// END OF DATA SECTION
// ============================================`;
    area.value = code;
    area.style.display = 'block';
    document.getElementById('copy-btn').style.display = 'inline-block';
}

function copyExportCode() {
    const area = document.getElementById('export-code-area');
    area.select();
    document.execCommand('copy');
    alert('Export code copied! Paste it into your public script.js file.');
}

function importData() {
    const text = document.getElementById('import-code-area').value;
    if (!text.trim()) { 
        alert("Please paste the data section first."); 
        return; 
    }

    try {
        // Remove comment lines that might cause parsing errors
        const cleanText = text
            .split('\n')
            .filter(line => !line.trim().startsWith('//'))
            .join('\n')
            .trim();
        
        // Use Function constructor to safely evaluate the JavaScript code block
        const parser = new Function(cleanText + '; return { defaultBooks, defaultCharacters, defaultSocials };');
        const parsedData = parser();

        if (parsedData.defaultBooks) {
            books = parsedData.defaultBooks;
            // Migrate old imported data to include all new fields
            books = books.map(b => ({ 
                category: "An Inspector Griffin Mystery", 
                isVisible: true, 
                amazonUrl: "", 
                goodreadsUrl: "", 
                pdfUrl: "", 
                epubUrl: "", 
                ...b 
            }));
        }
        if (parsedData.defaultCharacters) {
            characters = parsedData.defaultCharacters;
            characters = characters.map(c => ({ isVisible: true, ...c }));
        }
        if (parsedData.defaultSocials) {
            socials = parsedData.defaultSocials;
        }

        saveData();
        alert('Data imported and upgraded successfully!');
        document.getElementById('import-code-area').value = '';
    } catch (e) {
        console.error('Import error:', e);
        alert('Error parsing data. Please ensure you pasted the complete JavaScript code with the const defaultBooks, const defaultCharacters, and const defaultSocials declarations.');
    }
}

window.onclick = function(e) { 
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
};

async function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('login-password').value;
    
    // Verify the password against the hash
    if (await verifyKey(password)) {
        localStorage.setItem('admin', 'true');
        document.getElementById('login-modal').style.display = 'none';
        enableAdminMode();
    } else {
        alert('Invalid password. Please try again.');
        document.getElementById('login-password').value = '';
    }
}
