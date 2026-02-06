document.addEventListener('DOMContentLoaded', () => {

    /* ================= FAQ ================= */
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            q.parentElement.classList.toggle('active');
        });
    });

    /* ================= REVIEWS ================= */
    const sheetURL =
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTo8UrgdPc-eDniL2GQLj8SXcYKbICoYn1xLqL51hRSnIcTuNzkliy309rLlZTOe_yFtZsgAZAwMAKX/pubhtml';

    Tabletop.init({
        key: sheetURL,
        simpleSheet: true,
        callback: showReviews
    });

    function showReviews(data) {
        const container = document.getElementById('reviews-container');
        if (!container) return;

        container.innerHTML = '';

        data.forEach(r => {
            const stars = '★'.repeat(r.Note) + '☆'.repeat(5 - r.Note);

            container.innerHTML += `
                <div class="review-card">
                    <div class="review-author">${r.Nom}</div>
                    <div class="review-stars">${stars}</div>
                    <div class="review-text">${r.Avis}</div>
                </div>
            `;
        });
    }
});
