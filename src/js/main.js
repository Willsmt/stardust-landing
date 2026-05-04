// =============================================
// STARDUST — Main JavaScript
// =============================================

(function () {
  'use strict';

  // ── Custom Cursor ──────────────────────────
  const cursor = document.querySelector('.cursor');

  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .characters__card, .highlights__item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
    });
  }

  // ── Starfield Canvas ───────────────────────
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let W, H;

    function resizeCanvas() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x:       Math.random() * W,
          y:       Math.random() * H,
          r:       Math.random() * 1.4 + 0.2,
          opacity: Math.random() * 0.7 + 0.1,
          speed:   Math.random() * 0.3 + 0.05,
          twinkle: Math.random() * Math.PI * 2,
          color:   Math.random() > 0.85
            ? `rgba(246,216,96,`   // gold
            : Math.random() > 0.7
            ? `rgba(167,139,250,`  // lavender
            : `rgba(255,255,255,`  // white
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, W, H);

      stars.forEach(s => {
        s.twinkle += 0.015;
        const op = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + op + ')';
        ctx.fill();

        // Tiny cross sparkle for brighter stars
        if (s.r > 1.2) {
          ctx.save();
          ctx.strokeStyle = s.color + (op * 0.5) + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 2.5, s.y);
          ctx.lineTo(s.x + s.r * 2.5, s.y);
          ctx.moveTo(s.x, s.y - s.r * 2.5);
          ctx.lineTo(s.x, s.y + s.r * 2.5);
          ctx.stroke();
          ctx.restore();
        }
      });

      requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    createStars(280);
    drawStars();
    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars(280);
    });
  }

  // ── Scroll Reveal ──────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  function checkReveal() {
    const trigger = window.innerHeight * 0.88;
    revealEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add('visible');
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();

  // ── Navbar Scroll Effect ───────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Stagger delay for grid items ───────────
  document.querySelectorAll('.characters__grid .characters__card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });

  // ── Smooth anchor scroll ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
