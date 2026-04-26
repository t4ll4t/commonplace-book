'use strict';

// ─── Theme ───────────────────────────────────────────────

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'cb-theme';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
    return;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
})();

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ─── Nav Shadow on Scroll ────────────────────────────────

const filterNav = document.getElementById('filterNav');
const masthead  = document.querySelector('.masthead');

window.addEventListener('scroll', () => {
  const threshold = masthead ? masthead.offsetHeight - 10 : 60;
  filterNav.classList.toggle('is-shadowed', window.scrollY > threshold);
}, { passive: true });

// ─── Category Filter ─────────────────────────────────────

const filterBtns    = document.querySelectorAll('.filter-btn');
const fragmentsGrid = document.getElementById('fragmentsGrid');
const allFragments  = document.querySelectorAll('.fragment');

let activeFilter = 'all';
let filterTimer  = null;

function runFilter(category) {
  if (category === activeFilter) return;
  activeFilter = category;

  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  // Brief opacity dip while we swap visibility
  fragmentsGrid.style.opacity = '0.45';

  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => {
    let visibleCount = 0;

    allFragments.forEach(fragment => {
      const matches = category === 'all' || fragment.dataset.category === category;
      fragment.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount++;
    });

    // Empty state message
    const existing = fragmentsGrid.querySelector('.fragments-empty');
    if (visibleCount === 0 && !existing) {
      const msg = document.createElement('p');
      msg.className = 'fragments-empty';
      msg.textContent = 'No entries in this category yet.';
      fragmentsGrid.appendChild(msg);
    } else if (visibleCount > 0 && existing) {
      existing.remove();
    }

    fragmentsGrid.style.opacity = '1';
  }, 160);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => runFilter(btn.dataset.filter));
});

// ─── Random Fragment ("Open to a page") ──────────────────

const randomBtn = document.getElementById('randomBtn');

randomBtn.addEventListener('click', () => {
  const visible = [...allFragments].filter(f => !f.classList.contains('is-hidden'));
  if (!visible.length) return;

  const target = visible[Math.floor(Math.random() * visible.length)];

  // Remove any prior highlight immediately
  allFragments.forEach(f => {
    f.classList.remove('is-highlighted');
    void f.offsetWidth; // force reflow so animation can restart
  });

  // Scroll to fragment, then shimmer it
  const navH = filterNav.offsetHeight;
  const targetY = window.scrollY + target.getBoundingClientRect().top - navH - 24;

  window.scrollTo({ top: targetY, behavior: 'smooth' });

  // Delay shimmer until scroll settles
  setTimeout(() => {
    target.classList.add('is-highlighted');
    setTimeout(() => target.classList.remove('is-highlighted'), 2100);
  }, 500);
});

// ─── Footer Year ─────────────────────────────────────────

const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
