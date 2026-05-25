// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 100 ? '0 2px 20px rgba(0, 0, 0, 0.08)' : 'none';
    });

    // Intersection Observer for fade-in animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedSections = document.querySelectorAll('.features, .comparison, .benefits, .package, .services, .pricing, .reviews, .faq');
    animatedSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    const cards = document.querySelectorAll('.benefit-card, .package-item, .service-card, .faq-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(card);
    });

    initReviews();
    initContactModal();
});

// =========================
// Contact Modal + Form
// =========================
function initContactModal() {
    const openBtn = document.getElementById('openContactBtn');
    const closeBtn = document.getElementById('closeContactBtn');
    const modal = document.getElementById('contactModal');
    const form = document.getElementById('contactForm');
    const fileInput = document.getElementById('attachments');
    const fileHint = document.getElementById('fileHint');
    const submitBtn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');

    if (!openBtn || !modal) return;

    const openModal = () => { modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const closeModal = () => { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

    fileInput.addEventListener('change', () => {
        const n = fileInput.files.length;
        fileHint.textContent = n === 0 ? 'Aucun fichier sélectionné'
            : n === 1 ? fileInput.files[0].name
            : `${n} fichiers sélectionnés`;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';
        status.textContent = '';
        status.className = 'form-status';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                status.textContent = '✓ Message envoyé avec succès. Nous vous répondons sous 24h.';
                status.classList.add('success');
                form.reset();
                fileHint.textContent = 'Aucun fichier sélectionné';
                setTimeout(closeModal, 2500);
            } else {
                throw new Error('Échec de l\'envoi');
            }
        } catch (err) {
            status.textContent = '✗ Erreur lors de l\'envoi. Réessayez ou contactez-nous directement.';
            status.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer';
        }
    });
}

// =========================
// Reviews from Google Sheets (CSV)
// =========================
function initReviews() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTo8UrgdPc-eDniL2GQLj8SXcYKbICoYn1xLqL51hRSnIcTuNzkliy309rLlZTOe_yFtZsgAZAwMAKX/pub?output=csv';

    fetch(csvUrl)
        .then(response => { if (!response.ok) throw new Error('Erreur réseau'); return response.text(); })
        .then(csvText => showReviews(parseCSV(csvText)))
        .catch(err => {
            console.error('Erreur chargement avis:', err);
            const container = document.getElementById('reviews-container');
            if (container) container.innerHTML = '<p style="text-align:center;color:#737373;">Aucun avis pour le moment.</p>';
        });
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    if (lines.length < 2) return [];
    const headers = parseCSVLine(lines[0]);
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim().replace(/^"|"$/g, '')] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
        });
        results.push(obj);
    }
    return results;
}

function parseCSVLine(line) {
    const result = [];
    let current = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
            else inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
        else current += char;
    }
    result.push(current);
    return result;
}

function showReviews(data) {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    container.innerHTML = '';
    if (data.length === 0) { container.innerHTML = '<p style="text-align:center;color:#737373;">Aucun avis pour le moment.</p>'; return; }
    data.forEach(review => {
        const nom = review['Nom'] || 'Anonyme';
        const avis = review['Avis'] || '';
        const note = parseInt(review['Note']) || 0;
        const clampedNote = Math.max(0, Math.min(5, note));
        if (!avis) return;
        const stars = '★'.repeat(clampedNote) + '☆'.repeat(5 - clampedNote);
        container.insertAdjacentHTML('beforeend', `
            <div class="review-card">
                <div class="review-author">${escapeHTML(nom)}</div>
                <div class="review-stars">${stars}</div>
                <div class="review-text">${escapeHTML(avis)}</div>
            </div>
        `);
    });
    if (container.innerHTML === '') container.innerHTML = '<p style="text-align:center;color:#737373;">Aucun avis pour le moment.</p>';
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
