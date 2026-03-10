/**
 * MAIN.JS — Vantage Logic
 * Interactions matching deptagency.com
 */

/* Page Loader */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const fill = loader.querySelector('.loader-fill');
  if (fill) {
    setTimeout(() => { fill.style.width = '60%'; }, 100);
    setTimeout(() => { fill.style.width = '85%'; }, 400);
  }
  window.addEventListener('load', () => {
    if (fill) fill.style.width = '100%';
    setTimeout(() => loader.classList.add('loaded'), 350);
    setTimeout(() => loader.remove(), 1000);
  });
  // Fallback
  setTimeout(() => { if (loader.parentNode) loader.classList.add('loaded'); }, 3000);
}

/* Nav scroll state */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('menuToggle');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Hamburger toggle
  function toggleMenu() {
    const open = hamburger.classList.toggle('open');
    if (mobileMenu) mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (menuBtn) menuBtn.textContent = open ? 'Close' : 'Menu';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        if (menuBtn) menuBtn.textContent = 'Menu';
      });
    });
  }
}

/* Scroll Reveal */
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
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* Scroll progress bar */
function initProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0%';
  }, { passive: true });
}

/* Marquee — duplicate for loop */
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
      const dur = 1800;
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

/* Hero text scramble on load */
function initScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const orig = el.innerHTML;
    const textOnly = el.textContent;
    let iter = 0, interval;
    function run() {
      clearInterval(interval);
      iter = 0;
      const chars = textOnly.split('');
      interval = setInterval(() => {
        el.textContent = chars.map((c, i) => {
          if (c === ' ' || c === '\n') return c;
          if (i < iter) return textOnly[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        if (iter >= chars.length) {
          clearInterval(interval);
          el.innerHTML = orig; // restore <br> tags
        }
        iter += 0.5;
      }, 25);
    }
    setTimeout(run, 500);
  });
}

/* Filter buttons */
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
        });
      });
    });
  });
}

/* Horizontal scroll drag — DEPT work section */
function initHorizontalDrag() {
  document.querySelectorAll('.work-scroll-wrap').forEach(wrap => {
    let isDown = false, startX, scrollLeft;
    wrap.addEventListener('mousedown', e => {
      isDown = true; wrap.style.cursor = 'grabbing';
      startX = e.pageX - wrap.offsetLeft;
      scrollLeft = wrap.scrollLeft;
    });
    wrap.addEventListener('mouseleave', () => { isDown = false; wrap.style.cursor = ''; });
    wrap.addEventListener('mouseup', () => { isDown = false; wrap.style.cursor = ''; });
    wrap.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrap.offsetLeft;
      wrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  });
}

/* Smooth parallax for culture strip */
function initCultureScroll() {
  const strip = document.querySelector('.culture-strip');
  if (!strip) return;
  // Auto-scroll hint
  let scrollPos = 0;
  let autoScroll;
  function startAutoScroll() {
    autoScroll = setInterval(() => {
      scrollPos += 0.5;
      strip.scrollLeft = scrollPos;
      if (scrollPos >= strip.scrollWidth - strip.clientWidth) scrollPos = 0;
    }, 20);
  }
  function stopAutoScroll() { clearInterval(autoScroll); }

  // Only auto-scroll on desktop
  if (window.innerWidth > 768) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) startAutoScroll();
        else stopAutoScroll();
      });
    }, { threshold: 0.2 });
    io.observe(strip);
    strip.addEventListener('mouseenter', stopAutoScroll);
    strip.addEventListener('mouseleave', () => { scrollPos = strip.scrollLeft; startAutoScroll(); });
  }
}

/* Hero platform icons — mouse parallax */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const icons = document.querySelectorAll('.platform-icon');
  if (!hero || !icons.length) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5;

    icons.forEach((icon, i) => {
      const depth = 0.6 + (i % 3) * 0.25; // vary parallax depth
      const moveX = cx * 30 * depth;
      const moveY = cy * 20 * depth;
      icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    icons.forEach(icon => {
      icon.style.transition = 'transform 0.6s var(--ease)';
      icon.style.transform = 'translate(0, 0)';
      setTimeout(() => { icon.style.transition = ''; }, 600);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');

  initLoader();
  initNav();
  initReveal();
  initProgress();
  initMarquee();
  initAccordion();
  initCounters();
  initForms();
  initScramble();
  initFilters();
  initHorizontalDrag();
  initCultureScroll();
  initHeroParallax();
});
