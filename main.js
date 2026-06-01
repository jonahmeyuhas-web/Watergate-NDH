/* WATERGATE: REVOLUTION, REACTION, REFORM — NHD 2026 */
'use strict';

/* ── MOBILE NAV TOGGLE ──────────────────────────────────── */
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

/* ── ACTIVE NAV LINK ────────────────────────────────────── */
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current) link.classList.add('active');
  });
})();

/* ── NAV SCROLL EFFECT ──────────────────────────────────── */
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  let ticking = false;
  function update() {
    nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
})();

/* ── STAGGER CONVERSION (runs before observer) ──────────── */
(function () {
  // Convert grid containers with .fade-in into per-child staggered reveals
  const grids = document.querySelectorAll('.reform-grid.fade-in, .three-col.fade-in, .stat-row.fade-in');
  grids.forEach(grid => {
    const children = Array.from(grid.children);
    if (children.length < 2) return;
    grid.classList.remove('fade-in');
    children.forEach((child, i) => {
      child.classList.add('fade-in');
      child.style.transitionDelay = (i * 110) + 'ms';
    });
  });
})();

/* ── REDACTED SECTION HEADERS (runs before observer) ────── */
(function () {
  document.querySelectorAll('.section-header.fade-in h2').forEach(el => {
    const wrap = document.createElement('span');
    wrap.className = 'redact-wrap';
    while (el.firstChild) wrap.appendChild(el.firstChild);
    const bar = document.createElement('span');
    bar.className = 'redact-bar';
    wrap.appendChild(bar);
    el.appendChild(wrap);
  });
})();

/* ── SCROLL OBSERVER ────────────────────────────────────── */
(function () {
  const targets = [
    ...document.querySelectorAll('.fade-in'),
    ...document.querySelectorAll('.divider'),
  ];
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);

      if (entry.target.classList.contains('section-header')) {
        const bar = entry.target.querySelector('.redact-bar');
        if (bar) setTimeout(() => bar.classList.add('revealing'), 320);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ── SMOOTH SCROLL ──────────────────────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── TIMELINE TRAIL (scandal page only) ─────────────────── */
(function () {
  const trail = document.querySelector('.tl-trail');
  if (!trail) return;

  // Inject the animated fill line
  const fillLine = document.createElement('div');
  fillLine.className = 'tl-line-fill';
  trail.appendChild(fillLine);

  function updateFill() {
    const trailRect = trail.getBoundingClientRect();
    const trailTop  = trail.offsetTop + 24;
    const trailH    = trail.offsetHeight - 48;
    const scrolled  = window.scrollY + window.innerHeight * 0.72;
    const progress  = Math.max(0, Math.min(1, (scrolled - trailTop) / trailH));
    fillLine.style.height = (progress * trailH) + 'px';
  }

  window.addEventListener('scroll', updateFill, { passive: true });
  updateFill();
})();

/* ── TRUST CHART (significance page) ────────────────────── */
(function () {
  const canvas = document.getElementById('trust-chart');
  if (!canvas) return;

  function drawChart() {
    const ctx = canvas.getContext('2d');
    const data = [
      { year: '1958', trust: 73 },
      { year: '1964', trust: 76 },
      { year: '1966', trust: 65 },
      { year: '1970', trust: 54 },
      { year: '1972', trust: 53 },
      { year: '1974', trust: 36 },
      { year: '1976', trust: 33 },
      { year: '1980', trust: 27 },
    ];

    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight || 260;
    const PAD = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top  - PAD.bottom;
    const xStep  = chartW / (data.length - 1);
    const maxVal = 100;

    ctx.strokeStyle = '#e8e3d8';
    ctx.lineWidth = 1;
    [0, 25, 50, 75, 100].forEach(v => {
      const y = PAD.top + chartH - (v / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + chartW, y);
      ctx.stroke();
      ctx.fillStyle = '#8a8078';
      ctx.font = '11px "Times New Roman", serif';
      ctx.textAlign = 'right';
      ctx.fillText(v + '%', PAD.left - 6, y + 4);
    });

    ctx.beginPath();
    data.forEach((d, i) => {
      const x = PAD.left + i * xStep;
      const y = PAD.top + chartH - (d.trust / maxVal) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(PAD.left + (data.length - 1) * xStep, PAD.top + chartH);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(26, 39, 68, 0.12)';
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#1a2744';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    data.forEach((d, i) => {
      const x = PAD.left + i * xStep;
      const y = PAD.top + chartH - (d.trust / maxVal) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    const wgIdx = data.findIndex(d => d.year === '1974');
    if (wgIdx >= 0) {
      const x = PAD.left + wgIdx * xStep;
      ctx.strokeStyle = '#7a1515';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#7a1515';
      ctx.font = 'bold 11px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('Nixon Resigns', x, PAD.top - 8);
    }

    data.forEach((d, i) => {
      const x = PAD.left + i * xStep;
      const y = PAD.top + chartH - (d.trust / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = d.year === '1974' ? '#7a1515' : '#1a2744';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#3a3530';
      ctx.font = '11px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.year, x, PAD.top + chartH + 20);
      ctx.fillStyle = d.year === '1974' ? '#7a1515' : '#1a2744';
      ctx.font = 'bold 11px "Times New Roman", serif';
      ctx.fillText(d.trust + '%', x, y - 10);
    });

    ctx.fillStyle = '#3a3530';
    ctx.font = 'bold 12px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('Year', PAD.left + chartW / 2, H - 4);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Trust in Government (%)', -(PAD.top + chartH / 2), 14);
    ctx.restore();
  }

  if (document.readyState === 'complete') {
    drawChart();
  } else {
    window.addEventListener('load', drawChart);
  }
})();
