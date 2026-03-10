/**
 * MAIN.JS — Vantage Logic
 * Interactions modelled after deptagency.com
 */

/* Page Loader */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const fill = loader.querySelector('.loader-fill');
  if (fill) {
    setTimeout(() => { fill.style.width = '65%'; }, 80);
    setTimeout(() => { fill.style.width = '90%'; }, 500);
  }
  window.addEventListener('load', () => {
    if (fill) fill.style.width = '100%';
    setTimeout(() => loader.classList.add('loaded'), 300);
    setTimeout(() => loader.remove(), 900);
  });
  setTimeout(() => loader.classList.add('loaded'), 3500);
}

/* Nav scroll state */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.closest('li')?.classList.add('active');
  });
}

/* Scroll Reveal — using class "on" */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal], [data-stagger]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
}

/* Scroll progress bar */
function initProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });
}

/* Marquee — duplicate content for seamless loop */
function initMarquee() {
  document.querySelectorAll('.marquee-track').forEach(t => { t.innerHTML += t.innerHTML; });
}

/* Accordion */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const inner = item.querySelector('.accordion-body-inner');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(o => {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.accordion-body').style.maxHeight = '0';
        }
      });

      item.classList.toggle('open', !isOpen);
      body.style.maxHeight = isOpen ? '0' : inner.scrollHeight + 'px';
    });
  });
}

/* Counter animation */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const dur = 1600;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* Form handling */
function initForms() {
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1500));
      btn.textContent = '✓ Message sent!';
      form.reset();
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 4000);
    });
  });
}

/* Parallax — hero elements */
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  window.addEventListener('scroll', () => {
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.25;
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

/* Hero text scramble on load */
function initScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const orig = el.textContent;
    let iter = 0, interval;
    function run() {
      clearInterval(interval);
      iter = 0;
      interval = setInterval(() => {
        el.textContent = orig.split('').map((c, i) => {
          if (c === ' ') return ' ';
          if (i < iter) return orig[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        if (iter >= orig.length) clearInterval(interval);
        iter += 0.4;
      }, 28);
    }
    setTimeout(run, 400);
  });
}

/* Filter buttons (work, jobs) */
function initFilters() {
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const key = group.dataset.filterGroup;
    const items = document.querySelectorAll(`[data-filter-target="${key}"]`);
    group.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.filter;
        items.forEach(item => {
          const match = val === 'all' || item.dataset.cat === val;
          item.style.display = match ? '' : 'none';
          if (match) item.style.animation = 'fadeUp 0.4s var(--ease) forwards';
        });
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Mark JS as active — reveals only hide content when JS is running
  document.body.classList.add('js-ready');

  initLoader();
  initNav();
  initReveal();
  initProgress();
  initMarquee();
  initAccordion();
  initCounters();
  initForms();
  initParallax();
  initScramble();
  initFilters();
});
