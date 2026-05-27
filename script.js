/* ===== NAV ===== */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navMobile.classList.remove('open')));

/* ===== ANIMATED LEAVES ===== */
const leafContainer = document.getElementById('leavesContainer');
const leafEmojis = ['🍃','🌿','🍀','🌱','🌾'];

function spawnLeaf() {
  const el = document.createElement('div');
  el.className = 'leaf';
  el.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
  const size = 14 + Math.random() * 22;
  const dur  = 10 + Math.random() * 18;
  const drift = (Math.random() - 0.5) * 160;
  const spin  = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
  el.style.cssText = `
    left: ${Math.random() * 100}%;
    font-size: ${size}px;
    animation-duration: ${dur}s;
    animation-delay: ${Math.random() * dur * 0.5}s;
    --drift: ${drift}px;
    --spin: ${spin}deg;
  `;
  leafContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 5) * 1000);
}
// Initial burst
for (let i = 0; i < 14; i++) spawnLeaf();
setInterval(spawnLeaf, 1800);

/* ===== HERO STAT COUNTUP ===== */
function countUp(el, target, duration = 2200) {
  const start    = performance.now();
  const decimals = parseInt(el.dataset.decimal || '0');
  const fmt = n => decimals > 0
    ? n.toFixed(decimals)
    : Math.floor(n).toLocaleString('en-IN');
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(e * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = fmt(target);
  };
  requestAnimationFrame(tick);
}

// Hero stats fire immediately on page load
document.querySelectorAll('[data-count]').forEach(el => {
  countUp(el, parseFloat(el.dataset.count));
});

/* ===== QUOTE ROTATOR ===== */
const quotes = document.querySelectorAll('.pull-quote');
const dots   = document.querySelectorAll('.qdot');
let current  = 0;
let quoteTimer;

function showQuote(idx) {
  quotes[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = idx;
  quotes[current].classList.add('active');
  dots[current].classList.add('active');
}

function nextQuote() { showQuote((current + 1) % quotes.length); }

function startRotator() {
  quoteTimer = setInterval(nextQuote, 5000);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(quoteTimer);
    showQuote(i);
    startRotator();
  });
});

startRotator();

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== IMPACT COUNTERS ===== */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      countUp(e.target, parseFloat(e.target.dataset.target));
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ===== BAR CHARTS ===== */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.impact-bars').forEach(el => barObs.observe(el));

/* ===== CERT PREVIEW ===== */
const previewInput = document.getElementById('previewName');
const certName     = document.getElementById('certName');

previewInput?.addEventListener('input', () => {
  certName.textContent = previewInput.value.trim() || 'Your Name Here';
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
  });
});

/* ===== PACKAGE CARD TILT ===== */
document.querySelectorAll('.pkg').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    const base = card.classList.contains('pkg-hero') ? -24 : -8;
    card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(${base}px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ===== FOUNDER PORTRAIT PARALLAX ===== */
const founderFrame = document.querySelector('.founder-frame');
if (founderFrame) {
  window.addEventListener('scroll', () => {
    const rect = founderFrame.getBoundingClientRect();
    const vy = (rect.top - window.innerHeight / 2) * 0.04;
    founderFrame.style.transform = `translateY(${vy}px)`;
  }, { passive: true });
}
