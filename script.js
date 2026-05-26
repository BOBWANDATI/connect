// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('PeaceConnect Ke - Platform Loaded');
    loadStoredData();
    initializeCounters();
    setupEventListeners();
});

// ==================== TOAST NOTIFICATION ====================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast-notification' + (isError ? ' error' : '');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ==================== STORAGE MANAGEMENT ====================
function saveToStorage(key, data) {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
}

function loadStoredData() {
    // Load forum comments
    const comments = JSON.parse(localStorage.getItem('forumComments') || '[]');
    comments.forEach(comment => createComment(comment.name, comment.comment, comment.date));
    
    // Load testimonials
    const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
    testimonials.forEach(testimonial => displayTestimonial(testimonial));
    
    // Load reports
    const reports = JSON.parse(localStorage.getItem('conflictReports') || '[]');
    console.log(`Loaded ${reports.length} reports`);
}

// ==================== STATISTICS COUNTER ====================
function initializeCounters() {
    let users = 0, reports = 0, peace = 0;
    const usersCounter = document.getElementById('users');
    const reportsCounter = document.getElementById('reports');
    const peaceCounter = document.getElementById('peace');
    
    if (usersCounter && reportsCounter && peaceCounter) {
        const counter = setInterval(() => {
            users += 10;
            reports += 2;
            peace += 1;
            
            usersCounter.textContent = users + '+';
            reportsCounter.textContent = reports + '+';
            peaceCounter.textContent = peace + '+';
            
            if (users >= 1000) clearInterval(counter);
        }, 30);
    }
}

// ==================== DARK MODE ====================
const darkModeBtn = document.getElementById('darkModeBtn');
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = darkModeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light';
        } else {
            icon.className = 'fas fa-moon';
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark';
        }
    });
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

// ==================== BACK TO TOP ====================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.getElementById('navLinks')?.classList.remove('show');
        }
    });
});

// ==================== REPORT FORM ====================
const reportForm = document.getElementById('reportForm');
if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isAnonymous = document.getElementById('anonymousCheck').checked;
        const name = isAnonymous ? 'Anonymous' : document.getElementById('name').value;
        const category = document.getElementById('category').value;
        const location = document.getElementById('location').value;
        const emergencyContact = document.getElementById('emergencyContact').value;
        const message = document.getElementById('message').value;
        
        if (!category || !location || !emergencyContact || !message) {
            showToast('Please fill all required fields!', true);
            return;
        }
        
        const report = { name, category, location, emergencyContact, message, isAnonymous };
        saveToStorage('conflictReports', report);
        
        showToast(`✓ Report submitted successfully! A peace officer will review it.`);
        reportForm.reset();
        
        // Update report counter
        const reportsCounter = document.getElementById('reports');
        if (reportsCounter) {
            let current = parseInt(reportsCounter.textContent);
            reportsCounter.textContent = (current + 1) + '+';
        }
    });
}

// ==================== SEARCH & FILTER ====================
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keyup', filterArticles);
}

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterArticles();
    });
});

function filterArticles() {
    const searchValue = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const cards = document.querySelectorAll('.article-card');
    
    cards.forEach(card => {
        const category = card.dataset.category;
        const text = card.textContent.toLowerCase();
        const matchesSearch = text.includes(searchValue);
        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        
        card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
    });
}

// ==================== LIKE BUTTONS ====================
document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('liked');
        if (this.classList.contains('liked')) {
            this.innerHTML = '❤️ Liked';
        } else {
            this.innerHTML = '👍 Like';
        }
        
        // Save like to storage
        const id = this.dataset.id;
        const likes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
        likes[id] = this.classList.contains('liked');
        localStorage.setItem('articleLikes', JSON.stringify(likes));
    });
    
    // Load saved like state
    const id = button.dataset.id;
    const likes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    if (likes[id]) {
        button.classList.add('liked');
        button.innerHTML = '❤️ Liked';
    }
});

// ==================== SHARE FUNCTIONALITY ====================
document.querySelectorAll('.copy-link').forEach(btn => {
    btn.addEventListener('click', function() {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!');
    });
});

document.querySelectorAll('.whatsapp-share').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        window.open(`https://wa.me/?text=${url}`, '_blank');
    });
});

document.querySelectorAll('.facebook-share').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    });
});

document.querySelectorAll('.twitter-share').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
    });
});

// ==================== TOPIC BUTTONS ====================
const topicsData = {
    peacebuilding: `<h3><i class="fas fa-dove"></i> Peacebuilding</h3><p>Peacebuilding promotes unity, reconciliation and peaceful coexistence in communities. It involves dialogue, mediation, and community engagement to prevent conflicts before they escalate.</p>`,
    youth: `<h3><i class="fas fa-users"></i> Youth Empowerment</h3><p>Empowering youth with skills, leadership and education helps build stronger communities. Young people are key agents of peace and change in society.</p>`,
    conflict: `<h3><i class="fas fa-handshake"></i> Conflict Resolution</h3><p>Conflict resolution encourages peaceful communication, mediation, and problem-solving. It helps communities find common ground and resolve disputes without violence.</p>`,
    digital: `<h3><i class="fas fa-shield-alt"></i> Digital Safety</h3><p>Digital safety protects people from cyberbullying, misinformation, and online threats. It promotes responsible use of technology for peacebuilding.</p>`
};

document.querySelectorAll('.topic-btn').forEach(button => {
    button.addEventListener('click', () => {
        const topic = button.dataset.topic;
        const topicDetails = document.getElementById('topicDetails');
        if (topicDetails && topicsData[topic]) {
            topicDetails.innerHTML = topicsData[topic];
            topicDetails.style.animation = 'fadeIn 0.5s ease';
        }
    });
});

// ==================== FORUM SYSTEM ====================
const bannedWords = ['hate', 'stupid', 'violence', 'kill', 'tribal', 'idiot', 'war', 'fight'];

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createComment(name, comment, date) {
    const commentsSection = document.getElementById('commentsSection');
    if (!commentsSection) return;
    
    const commentCard = document.createElement('div');
    commentCard.classList.add('comment-card');
    commentCard.innerHTML = `
        <h4><i class="fas fa-user"></i> ${escapeHTML(name)}</h4>
        <p>${escapeHTML(comment)}</p>
        <small><i class="fas fa-clock"></i> Posted: ${date}</small>
        <div class="comment-actions">
            <button class="reply-btn"><i class="fas fa-reply"></i> Reply</button>
            <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
        </div>
        <div class="reply-container"></div>
    `;
    
    commentsSection.prepend(commentCard);
    
    // Delete functionality
    commentCard.querySelector('.delete-btn').addEventListener('click', () => {
        commentCard.remove();
        saveCommentsToStorage();
    });
    
    // Reply functionality
    const replyBtn = commentCard.querySelector('.reply-btn');
    const replyContainer = commentCard.querySelector('.reply-container');
    
    replyBtn.addEventListener('click', () => {
        if (replyContainer.innerHTML !== '') return;
        
        replyContainer.innerHTML = `
            <div class="reply-box">
                <textarea rows="3" placeholder="Write your reply..."></textarea>
                <button class="reply-submit-btn">Submit Reply</button>
            </div>
        `;
        
        const submitReplyBtn = replyContainer.querySelector('.reply-submit-btn');
        const replyTextarea = replyContainer.querySelector('textarea');
        
        submitReplyBtn.addEventListener('click', () => {
            const replyText = replyTextarea.value.trim();
            if (!replyText) return;
            
            const reply = document.createElement('div');
            reply.classList.add('reply');
            reply.innerHTML = `<strong><i class="fas fa-reply-all"></i> Reply:</strong><p>${escapeHTML(replyText)}</p>`;
            replyContainer.innerHTML = '';
            replyContainer.appendChild(reply);
            saveCommentsToStorage();
        });
    });
}

function saveCommentsToStorage() {
    const comments = [];
    document.querySelectorAll('.comment-card').forEach(card => {
        const name = card.querySelector('h4')?.innerText.replace('<i class="fas fa-user"></i> ', '') || '';
        const comment = card.querySelector('p')?.innerText || '';
        const date = card.querySelector('small')?.innerText.replace('<i class="fas fa-clock"></i> Posted: ', '') || '';
        comments.push({ name, comment, date });
    });
    localStorage.setItem('forumComments', JSON.stringify(comments));
}

const forumForm = document.getElementById('forumForm');
if (forumForm) {
    forumForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const forumName = document.getElementById('forumName').value.trim();
        const forumComment = document.getElementById('forumComment').value.trim();
        const commentLower = forumComment.toLowerCase();
        
        const containsBadWord = bannedWords.some(word => commentLower.includes(word));
        
        if (containsBadWord) {
            document.getElementById('forumMessage').innerHTML = '<div class="error-message">❌ Comment blocked due to inappropriate language.</div>';
            setTimeout(() => document.getElementById('forumMessage').innerHTML = '', 3000);
            return;
        }
        
        const currentDate = new Date().toLocaleString();
        createComment(forumName, forumComment, currentDate);
        saveCommentsToStorage();
        
        document.getElementById('forumMessage').innerHTML = '<div class="success-message">✅ Comment posted successfully!</div>';
        setTimeout(() => document.getElementById('forumMessage').innerHTML = '', 3000);
        forumForm.reset();
    });
}

// ==================== TESTIMONIALS ====================
const testimonialForm = document.getElementById('testimonialForm');
if (testimonialForm) {
    testimonialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('testimonialName').value;
        const title = document.getElementById('testimonialTitle').value;
        const message = document.getElementById('testimonialMessage').value;
        const image = document.getElementById('testimonialImage').value || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200';
        
        const testimonial = { name, title, message, image };
        saveToStorage('testimonials', testimonial);
        displayTestimonial(testimonial);
        
        showToast(`✓ Thank you ${name} for sharing your story!`);
        testimonialForm.reset();
    });
}

function displayTestimonial(testimonial) {
    const container = document.getElementById('testimonialContainer');
    if (!container) return;
    
    const card = document.createElement('div');
    card.classList.add('testimonial-card');
    card.innerHTML = `
        <img src="${testimonial.image}" alt="${testimonial.title}">
        <div class="testimonial-content">
            <h3>${escapeHTML(testimonial.title)}</h3>
            <p>${escapeHTML(testimonial.message)}</p>
            <h4><i class="fas fa-user"></i> - ${escapeHTML(testimonial.name)}</h4>
        </div>
    `;
    container.prepend(card);
}

// ==================== WHATSAPP CHAT ====================
function toggleWhatsApp() {
    const popup = document.getElementById('whatsappPopup');
    popup.classList.toggle('active');
}

function sendWhatsAppMessage() {
    const message = encodeURIComponent("Hello! I need assistance with peacebuilding or conflict resolution.");
    window.open(`https://wa.me/254700000000?text=${message}`, '_blank');
}

// ==================== NEWSLETTER ====================
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    saveToStorage('newsletterSubscribers', { email });
    showToast(`✓ ${email} subscribed successfully! Stay tuned for peace updates.`);
    event.target.reset();
}

// ==================== LIVE LOCATION & TIME ====================
let currentLocation = 'Detecting location...';

function updateTime() {
    const liveInfo = document.getElementById('liveInfo');
    if (!liveInfo) return;
    
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    
    liveInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentLocation}<br><i class="fas fa-clock"></i> ${time}<br><i class="fas fa-calendar"></i> ${date}`;
}

setInterval(updateTime, 1000);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(2);
            const lon = position.coords.longitude.toFixed(2);
            currentLocation = `${lat}°N, ${lon}°E`;
            updateTime();
        },
        () => {
            currentLocation = 'Location access denied';
            updateTime();
        }
    );
}

updateTime();

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const whatsappPopup = document.getElementById('whatsappPopup');
            if (whatsappPopup) whatsappPopup.classList.remove('active');
        }
    });
    
    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        const whatsapp = document.querySelector('.whatsapp-chat');
        const popup = document.getElementById('whatsappPopup');
        if (whatsapp && popup && !whatsapp.contains(e.target)) {
            popup.classList.remove('active');
        }
    });
}

console.log('PeaceConnect Ke - All features loaded successfully!');
