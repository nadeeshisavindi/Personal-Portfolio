/* gallery.js — filter + accessible lightbox with prev/next and keyboard support */
(function () {
    'use strict';
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.gallery-card'));
    var empty = document.getElementById('gallery-empty');

    /* Filter: fade out, then remove from layout so no blank gaps remain */
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
            var cat = btn.dataset.cat, shown = 0;
            cards.forEach(function (card) {
                var match = cat === 'all' || card.dataset.cat === cat;
                if (match) {
                    shown++;
                    card.hidden = false;
                    requestAnimationFrame(function () { card.classList.remove('fading'); });
                } else {
                    card.classList.add('fading');
                    setTimeout(function () { if (card.classList.contains('fading')) card.hidden = true; }, 300);
                }
            });
            if (empty) empty.hidden = shown > 0;
        });
    });

    /* Lightbox */
    var dlg = document.getElementById('lightbox');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var img = document.getElementById('lb-img');
    var label = document.getElementById('lb-label');
    var cat = document.getElementById('lb-cat');
    var current = 0, opener = null;

    function visibleCards() { return cards.filter(function (c) { return !c.hidden; }); }
    function show(i) {
        var list = visibleCards();
        if (!list.length) return;
        current = (i + list.length) % list.length;
        var card = list[current], thumb = card.querySelector('img');
        img.src = thumb.currentSrc || thumb.src;
        img.alt = thumb.alt;
        label.textContent = card.querySelector('.card-label').textContent;
        cat.textContent = card.querySelector('.card-cat').textContent;
    }
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            opener = card;
            show(visibleCards().indexOf(card));
            dlg.showModal();
            document.body.style.overflow = 'hidden';
        });
    });
    dlg.addEventListener('close', function () {
        document.body.style.overflow = '';
        if (opener) opener.focus();
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.lb-close')) dlg.close(); });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    dlg.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });
    /* swipe on touch screens */
    var sx = null;
    dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
        if (sx === null) return;
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
        sx = null;
    });
})();
