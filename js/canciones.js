/* === IGLESIA JOVEN · CANCIONES.JS === */

/* ── Nav (always solid on inner pages) ── */
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

let allSongs = [];

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderSongs(songs) {
  const grid = document.getElementById('songsGrid');
  const count = document.getElementById('songsCount');
  count.textContent = songs.length === 1 ? '1 canción' : `${songs.length} canciones`;

  if (songs.length === 0) {
    grid.innerHTML = `
      <div class="songs-empty">
        <h3>Sin canciones aún</h3>
        <p>Las canciones de adoración aparecerán aquí cuando el equipo las agregue.</p>
      </div>`;
    return;
  }

  grid.innerHTML = songs.map(s => `
    <div class="song-card" data-id="${s.id}" role="button" tabindex="0" aria-label="Ver letra de ${esc(s.title)}">
      <div class="song-card-title">${esc(s.title)}</div>
      <div class="song-card-artist">${esc(s.artist)}</div>
      <div class="song-card-preview">${esc(s.lyrics)}</div>
      <div class="song-card-footer">
        <span class="song-card-arrow">Ver letra →</span>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.song-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(card.dataset.id); });
  });
}

/* ── Modal ── */
function openModal(id) {
  const song = allSongs.find(s => s.id === id);
  if (!song) return;
  document.getElementById('modalTitle').textContent  = song.title;
  document.getElementById('modalArtist').textContent = song.artist;
  document.getElementById('modalBody').textContent   = song.lyrics;
  document.getElementById('songModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('songModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('songModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Search ── */
function doSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) { renderSongs(allSongs); return; }
  renderSongs(allSongs.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.lyrics.toLowerCase().includes(q)
  ));
}

document.getElementById('searchInput').addEventListener('input', doSearch);
document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

/* ── Init ── */
(async () => {
  allSongs = (await DB.getSongs()).sort((a, b) => a.title.localeCompare(b.title, 'es'));
  renderSongs(allSongs);
})();
