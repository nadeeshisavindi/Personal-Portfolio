/* home.js — index.html only: typewriter, 3D tilt, cursor sparkle trail, tech dialog, contact form */
(function () {
    'use strict';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* --- Typewriter --- */
    var tw = document.querySelector('[data-typewriter]');
    if (tw && !reduceMotion) {
        var phrases = (tw.dataset.typewriter || '').split('|').filter(Boolean);
        var p = 0, i = 0, del = false;
        tw.classList.add('typewriter');
        (function tick() {
            var word = phrases[p];
            i += del ? -1 : 1;
            tw.textContent = word.slice(0, i);
            var delay = del ? 35 : 80;
            if (!del && i === word.length) { del = true; delay = 1600; }
            else if (del && i === 0) { del = false; p = (p + 1) % phrases.length; delay = 350; }
            setTimeout(tick, delay);
        })();
    }

    /* --- 3D tilt of the project ring (only while visible, only with a mouse) --- */
    var tilt = document.querySelector('.tilt');
    var scene = document.querySelector('.scene');
    if (tilt && scene && finePointer && !reduceMotion && window.matchMedia('(min-width: 861px)').matches) {
        var tx = 0, ty = 0, cx = 0, cy = 0, visible = false, raf = 0;
        var step = function () {
            cx += (tx - cx) * 0.08;
            cy += (ty - cy) * 0.08;
            tilt.style.transform = 'rotateX(' + cx.toFixed(2) + 'deg) rotateY(' + cy.toFixed(2) + 'deg)';
            raf = visible ? requestAnimationFrame(step) : 0;
        };
        new IntersectionObserver(function (e) {
            visible = e[0].isIntersecting;
            if (visible && !raf) raf = requestAnimationFrame(step);
        }).observe(scene);
        document.addEventListener('mousemove', function (e) {
            ty = (e.clientX / window.innerWidth - 0.5) * 30;
            tx = -(e.clientY / window.innerHeight - 0.5) * 16;
        }, { passive: true });
    }

    /* --- Cursor sparkle trail --- */
    if (finePointer && !reduceMotion) (function () {
        var c = document.createElement('canvas');
        c.className = 'trail-canvas';
        c.setAttribute('aria-hidden', 'true');
        document.body.appendChild(c);
        document.body.classList.add('has-trail');
        var ctx = c.getContext('2d');
        var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
        function resize() {
            W = window.innerWidth; H = window.innerHeight;
            c.width = W * dpr; c.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        var COLORS = ['#f472b6', '#ec4899', '#be185d', '#fce7f3', '#ffffff', '#ff9de2'];
        var pts = [], mx = -100, my = -100, px = 0, py = 0, pulse = 0, running = false, lastMove = 0, inside = false;

        function Particle(x, y) {
            this.x = x + (Math.random() - .5) * 8; this.y = y + (Math.random() - .5) * 8;
            this.vx = (Math.random() - .5) * 3; this.vy = (Math.random() - .5) * 3 - 1;
            this.size = Math.random() * 7 + 3;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = 1; this.decay = Math.random() * .02 + .015;
            this.shrink = Math.random() * .04 + .02;
            this.rot = Math.random() * Math.PI * 2; this.rotV = (Math.random() - .5) * .18;
            this.type = Math.floor(Math.random() * 3);
        }
        Particle.prototype.update = function () {
            this.x += this.vx; this.y += this.vy; this.vy += .07; this.vx *= .97;
            this.alpha -= this.decay; this.size -= this.shrink; this.rot += this.rotV;
        };
        Particle.prototype.draw = function () {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color; ctx.strokeStyle = this.color;
            ctx.translate(this.x, this.y); ctx.rotate(this.rot);
            if (this.type === 0) {
                ctx.beginPath(); ctx.arc(0, 0, this.size * .55, 0, 6.2832); ctx.fill();
            } else if (this.type === 1) {
                var r = this.size * .6, ir = r * .4;
                ctx.beginPath();
                for (var k = 0; k < 8; k++) {
                    var a = k * Math.PI / 4, rad = k % 2 ? ir : r;
                    k ? ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad) : ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                }
                ctx.closePath(); ctx.fill();
            } else {
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(0, 0, this.size * .5, 0, 6.2832); ctx.stroke();
                ctx.beginPath(); ctx.arc(0, 0, this.size * .15, 0, 6.2832); ctx.fill();
            }
            ctx.restore();
        };

        function loop(now) {
            ctx.clearRect(0, 0, W, H);
            if (inside) {
                pulse += .1;
                var ps = 8 + Math.sin(pulse) * 3;
                ctx.globalAlpha = .55; ctx.fillStyle = 'rgba(244,114,182,.35)';
                ctx.beginPath(); ctx.arc(mx, my, ps, 0, 6.2832); ctx.fill();
                ctx.globalAlpha = .95; ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(mx, my, ps * .4, 0, 6.2832); ctx.fill();
                ctx.globalAlpha = 1;
            }
            for (var i = pts.length - 1; i >= 0; i--) {
                pts[i].update();
                if (pts[i].alpha <= 0 || pts[i].size <= 0) pts.splice(i, 1); else pts[i].draw();
            }
            if (document.hidden || (!inside && !pts.length)) { running = false; ctx.clearRect(0, 0, W, H); return; }
            requestAnimationFrame(loop);
        }
        function start() { if (!running) { running = true; requestAnimationFrame(loop); } }

        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY; inside = true;
            var d = Math.hypot(mx - px, my - py);
            if (d > 2) {
                var n = Math.min(Math.floor(d / 3), 10);
                for (var i = 0; i < n; i++) pts.push(new Particle(mx, my));
                px = mx; py = my;
            }
            start();
        }, { passive: true });
        document.addEventListener('mouseleave', function () { inside = false; });
        document.addEventListener('mouseenter', function () { inside = true; start(); });
    })();

    /* --- Technologies dialog --- */
    var dlg = document.getElementById('tech-dialog');
    var openBtn = document.getElementById('open-tech');
    if (dlg && openBtn && typeof dlg.showModal === 'function') {
        openBtn.addEventListener('click', function () { dlg.showModal(); });
        dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.dialog-close')) dlg.close(); });
    } else if (openBtn) {
        openBtn.hidden = true;
    }

    /* --- Contact form (no backend: opens the visitor's mail app with a pre-filled message) --- */
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.reportValidity()) return;
            var d = new FormData(form);
            var body = d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')';
            var href = 'mailto:' + form.dataset.to +
                '?subject=' + encodeURIComponent(d.get('subject')) +
                '&body=' + encodeURIComponent(body);
            status.textContent = 'Opening your email app… if nothing happens, use the email address on the left.';
            window.location.href = href;
        });
    }
    var copy = document.getElementById('copy-mail');
    if (copy) {
        copy.addEventListener('click', function () {
            var addr = copy.dataset.mail;
            var done = function (ok) {
                var old = copy.textContent;
                copy.textContent = ok ? 'Copied ✓' : 'Press Ctrl+C to copy';
                setTimeout(function () { copy.textContent = old; }, 2000);
            };
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(addr).then(function () { done(true); }, function () { done(false); });
            } else { done(false); }
        });
    }
})();
