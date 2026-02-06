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
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
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

    const animatedSections = document.querySelectorAll('.features, .comparison, .benefits, .package, .services, .pricing, .faq');
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

    // =========================
    // Reviews from Google Sheets
    // =========================
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTo8UrgdPc-eDniL2GQLj8SXcYKbICoYn1xLqL51hRSnIcTuNzkliy309rLlZTOe_yFtZsgAZAwMAKX/pub?output=csv';

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (inQuotes) {
                if (char === '"' && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    current += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ',') {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
        }
        result.push(current.trim());
        return result;
    }

    function parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];
        const headers = parseCSVLine(lines[0]);
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            data.push(obj);
        }
        return data;
    }

    function showReviews(data) {
        const container = document.getElementById('reviews-container');
        if (!container) return;
        container.innerHTML = '';

        data.forEach(review => {
            const nom = escapeHTML(review['Nom'] || review['nom'] || '');
            const avis = escapeHTML(review['Avis'] || review['avis'] || '');
            const noteRaw = review['Note'] || review['note'] || '0';
            const note = Math.min(5, Math.max(0, parseInt(noteRaw, 10) || 0));
            const stars = '★'.repeat(note) + '☆'.repeat(5 - note);

            if (!nom && !avis) return;

            const reviewHTML = `
                <div class="review-card">
                    <div class="review-author">${nom}</div>
                    <div class="review-stars">${stars}</div>
                    <div class="review-text">${avis}</div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', reviewHTML);
        });
    }

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const data = parseCSV(csvText);
            showReviews(data);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des avis:', error);
        });
});
