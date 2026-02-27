/* ============================================================
   VIRAJ DAS — Portfolio  |  script.js
   ============================================================ */

'use strict';

/* ── Typing / typewriter animation ──────────────────────── */
const PHRASES = [
  'VR Engineer',
  'AI / ML Builder',
  'Hackathon Champion',
  'Game Developer',
  'YouTube Educator',
];

(function initTyper() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  // Insert cursor sibling
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  el.insertAdjacentElement('afterend', cursor);

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  function tick() {
    const phrase = PHRASES[phraseIdx];

    if (deleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    el.textContent = phrase.slice(0, charIdx);

    let delay = deleting ? 55 : 95;

    if (!deleting && charIdx === phrase.length) {
      delay    = 2000;   // pause at end
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % PHRASES.length;
      delay     = 350;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
})();


/* ── Footer year ─────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── Navigation: scroll state + active link ─────────────── */
(function initNav() {
  const nav      = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  if (!nav) return;

  function onScroll() {
    // scrolled class for visual treatment
    nav.classList.toggle('scrolled', window.scrollY > 20);

    // active link: find the section whose top is closest above viewport centre
    const mid = window.scrollY + window.innerHeight * 0.4;
    let activeId = sections[0]?.id ?? '';

    for (const sec of sections) {
      if (sec.offsetTop <= mid) activeId = sec.id;
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${activeId}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initialise immediately
})();


/* ── Scroll-reveal via IntersectionObserver ──────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();


/* ── Project tag filtering ───────────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button states
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      cards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          // Micro-animation: fade back in
          card.style.opacity   = '0';
          card.style.transform = 'translateY(12px)';
          // Force reflow
          void card.offsetWidth;
          card.style.transition = 'opacity 280ms ease, transform 280ms ease';
          card.style.opacity    = '';
          card.style.transform  = '';
        } else {
          card.classList.add('hidden');
          card.style.transition = '';
        }
      });
    });
  });
})();


/* ── Smooth scroll for all anchor links ──────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();


/* ── Micro-interaction: card glow on mouse position ─────── */
(function initCardGlow() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
      card.style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(56,189,248,0.06) 0%, rgba(255,255,255,0.04) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ── YouTube thumbnail fallback (maxres → hq → hide) ─────── */
(function initThumbFallback() {
  document.querySelectorAll('.video-thumb img').forEach(img => {
    function tryFallback() {
      if (img.src.includes('maxresdefault')) {
        // Try lower-res thumbnail first
        img.src = img.src.replace('maxresdefault', 'hqdefault');
        img.addEventListener('error', () => {
          img.style.display = 'none'; // no thumbnail available — show bg + play btn
        }, { once: true });
      } else {
        img.style.display = 'none';
      }
    }
    img.addEventListener('error', tryFallback, { once: true });
  });
})();
