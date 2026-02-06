// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate sections on scroll
    const animatedSections = document.querySelectorAll('.features, .comparison, .benefits, .package, .services, .pricing, .faq');
    
    animatedSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Animate cards on scroll
    const cards = document.querySelectorAll('.benefit-card, .package-item, .service-card, .faq-item');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(card);
    });

    // PayPal Modal functionality
    const paypalModal = document.getElementById('paypal-modal');
    const paypalModalClose = document.querySelector('.paypal-modal-close');
    const navCta = document.querySelector('.nav-cta');

    // Open PayPal modal when clicking "Commencer"
    if (navCta && paypalModal) {
        navCta.addEventListener('click', () => {
            paypalModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal when clicking X
    if (paypalModalClose && paypalModal) {
        paypalModalClose.addEventListener('click', () => {
            paypalModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside
    if (paypalModal) {
        paypalModal.addEventListener('click', (e) => {
            if (e.target === paypalModal) {
                paypalModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && paypalModal && paypalModal.classList.contains('active')) {
            paypalModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // =========================
    // Reviews from Google Sheets (Étape 2b)
    // =========================
    const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTo8UrgdPc-eDniL2GQLj8SXcYKbICoYn1xLqL51hRSnIcTuNzkliy309rLlZTOe_yFtZsgAZAwMAKX/pubhtml';

    function initReviews() {
        Tabletop.init({
            key: publicSpreadsheetUrl,
            simpleSheet: true,
            callback: showReviews
        });
    }

    function showReviews(data) {
        const container = document.getElementById('reviews-container');
        if (!container) return;
        container.innerHTML = ''; // nettoyer

        data.forEach(review => {
            // review.Author, review.Text, review.Rating
            const stars = '★'.repeat(review.Note) + '☆'.repeat(5 - review.Note);
            const reviewHTML = `
              <div class="review-card">
                <div class="review-author">${review.Nom}</div>
                <div class="review-stars">${stars}</div>
                <div class="review-text">${review.Avis}</div>
            </div>
        `;
            container.insertAdjacentHTML('beforeend', reviewHTML);
        });
    }

    // Lancer la récupération après DOM prêt
    initReviews();
});

