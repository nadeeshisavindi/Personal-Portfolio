/* main.js — runs on every page: navbar, scroll progress, reveal, scrollspy, footer year */
(function () {
    'use strict';
    document.documentElement.classList.add('js');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- Mobile navigation --- */
    var toggle = document.querySelector('.nav-toggle');
    var list = document.getElementById('nav-list');
    function setNav(open) {
        if (!toggle || !list) return;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        list.classList.toggle('open', open);
    }
    if (toggle && list) {
        toggle.addEventListener('click', function () {
            setNav(toggle.getAttribute('aria-expanded') !== 'true');
        });
        list.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.site-nav')) setNav(false);
        });
        window.matchMedia('(min-width: 861px)').addEventListener('change', function () { setNav(false); });
    }

    /* --- Scroll progress bar (single rAF-throttled listener) --- */
    var bar = document.querySelector('.scroll-progress');
    if (bar) {
        var ticking = false;
        var update = function () {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
            ticking = false;
        };
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    /* --- Reveal on scroll --- */
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach(function (el) { io.observe(el); });
    } else {
        items.forEach(function (el) { el.classList.add('in'); });
    }

    /* --- Scroll-spy for in-page nav links (home page) --- */
    var spyLinks = document.querySelectorAll('.nav-list a[data-spy]');
    if (spyLinks.length && 'IntersectionObserver' in window) {
        var map = {};
        spyLinks.forEach(function (a) { map[a.dataset.spy] = a; });
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                spyLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
                var link = map[en.target.id];
                if (link) link.setAttribute('aria-current', 'true');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(map).forEach(function (id) {
            var s = document.getElementById(id);
            if (s) spy.observe(s);
        });
    }

    /* --- Footer year --- */
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();
