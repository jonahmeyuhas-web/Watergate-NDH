/* ============================================================
   WATERGATE: REVOLUTION, REACTION, REFORM
   National History Day 2026 — Main JavaScript
   ============================================================ */

/* ── MOBILE NAV TOGGLE ── */
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

/* ── ACTIVE NAV LINK ── */
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current) link.classList.add('active');
  });
})();

/* ── SCROLL-TRIGGERED FADE-IN ── */
(function () {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ── INTERACTIVE TIMELINE ── */
(function () {
  /* Expand/collapse detail on title click */
  document.querySelectorAll('.timeline-title').forEach(title => {
    title.addEventListener('click', () => {
      const item   = title.closest('.timeline-item');
      const detail = item.querySelector('.timeline-detail');
      if (!detail) return;

      const isOpen = detail.classList.contains('open');
      // Close all others
      document.querySelectorAll('.timeline-detail.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) detail.classList.add('open');
    });
  });

  /* Filter buttons */
  const filterBtns = document.querySelectorAll('.timeline-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.timeline-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── SMOOTH SCROLL FOR IN-PAGE ANCHORS ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── TRUST POLL CHART (significance page) ── */
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

  const xStep = chartW / (data.length - 1);
  const maxVal = 100;

  // Grid lines
  ctx.strokeStyle = '#e8e3d8';
  ctx.lineWidth = 1;
  [0, 25, 50, 75, 100].forEach(v => {
    const y = PAD.top + chartH - (v / maxVal) * chartH;
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(PAD.left + chartW, y);
    ctx.stroke();

    ctx.fillStyle = '#8a8078';
    ctx.font = '11px Lato, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(v + '%', PAD.left - 6, y + 4);
  });

  // Shaded area
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

  // Line
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

  // Watergate marker
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
    ctx.font = 'bold 11px Lato, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nixon Resigns', x, PAD.top - 8);
  }

  // Dots + labels
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
    ctx.font = '11px Lato, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.year, x, PAD.top + chartH + 20);

    ctx.fillStyle = d.year === '1974' ? '#7a1515' : '#1a2744';
    ctx.font = 'bold 11px Lato, sans-serif';
    ctx.fillText(d.trust + '%', x, y - 10);
  });

  // Axis labels
  ctx.fillStyle = '#3a3530';
  ctx.font = 'bold 12px Lato, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Year', PAD.left + chartW / 2, H - 4);

  ctx.save();
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Trust in Government (%)', -(PAD.top + chartH / 2), 14);
  ctx.restore();
  }

  // Wait for full layout so offsetWidth is never 0
  if (document.readyState === 'complete') {
    drawChart();
  } else {
    window.addEventListener('load', drawChart);
  }
})();
