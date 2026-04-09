/* === IGLESIA JOVEN · ORACIONES.JS === */

/* ── Nav (always solid) ── */
const nav = document.getElementById('nav');
nav.classList.add('scrolled');

/* ── Mobile menu ── */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

/* ── Scroll reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

let allPrayers = [];
let activeFilter = 'all';

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getSituations(prayers) {
  return [...new Set(prayers.map(p => p.situation).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
}

function renderFilters(prayers) {
  const bar = document.getElementById('filtersBar');
  const situations = getSituations(prayers);

  bar.innerHTML = [
    `<button class="filter-btn${activeFilter === 'all' ? ' active' : ''}" data-filter="all">Todas</button>`,
    ...situations.map(s => `<button class="filter-btn${activeFilter === s ? ' active' : ''}" data-filter="${esc(s)}">${esc(s)}</button>`)
  ].join('');

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      activeFilter = this.dataset.filter;
      renderFilters(allPrayers);
      const filtered = activeFilter === 'all'
        ? allPrayers
        : allPrayers.filter(p => p.situation === activeFilter);
      renderPrayers(filtered);
    });
  });
}

function renderPrayers(prayers) {
  const list = document.getElementById('prayersList');
  const count = document.getElementById('prayersCount');
  count.textContent = prayers.length === 1 ? '1 oración' : `${prayers.length} oraciones`;

  if (prayers.length === 0) {
    list.innerHTML = `
      <div class="songs-empty">
        <h3>Sin oraciones aún</h3>
        <p>Las oraciones y reflexiones aparecerán aquí cuando el equipo las agregue.</p>
      </div>`;
    return;
  }

  list.innerHTML = prayers.map(p => `
    <div class="prayer-card" data-id="${p.id}" role="button" tabindex="0" aria-label="${esc(p.title)}">
      ${p.situation ? `<div class="prayer-situation-tag">${esc(p.situation)}</div>` : ''}
      <div class="prayer-title">${esc(p.title)}</div>
      <div class="prayer-preview">${esc(p.content)}</div>
    </div>`).join('');

  list.querySelectorAll('.prayer-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(card.dataset.id); });
  });
}

/* ── Modal ── */
function openModal(id) {
  const prayer = allPrayers.find(p => p.id === id);
  if (!prayer) return;
  document.getElementById('modalTitle').textContent     = prayer.title;
  document.getElementById('modalSituation').textContent = prayer.situation || '';
  document.getElementById('modalBody').textContent      = prayer.content;
  document.getElementById('prayerModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('prayerModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('prayerModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Init ── */
(async () => {
  allPrayers = (await DB.getPrayers()).sort((a, b) => a.title.localeCompare(b.title, 'es'));
  renderFilters(allPrayers);
  renderPrayers(allPrayers);
})();
