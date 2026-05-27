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

    if (!openBtn || !modal) return;

    const openModal = () => {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    fileInput.addEventListener('change', () => {
        const n = fileInput.files.length;
        fileHint.textContent = n === 0 ? 'Aucun fichier sélectionné'
            : n === 1 ? fileInput.files[0].name
            : `${n} fichiers sélectionnés`;
    });

    // Envoi natif (pas de fetch AJAX) — nécessaire pour que FormSubmit accepte les pièces jointes.
    // On désactive le bouton pour éviter les doubles clics.
    form.addEventListener('submit', () => {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';
    });
}

// Reviews are now rendered by the Trustpilot TrustBox widget (see index.html).

