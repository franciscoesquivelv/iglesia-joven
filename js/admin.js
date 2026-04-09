/* === IGLESIA JOVEN · ADMIN.JS === */

/* ── Nav ── */
document.getElementById('nav').classList.add('scrolled');

/* ── Tabs ── */
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.dataset.panel).classList.add('active');
  });
});

/* ── Toast ── */
function toast(msg, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (isError ? ' error' : '');
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3200);
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ════════════════════════════════
   SONGS
════════════════════════════════ */
let editingSongId = null;

function renderSongsList() {
  const songs = DB.getSongs().sort((a, b) => a.title.localeCompare(b.title, 'es'));
  const el = document.getElementById('songsList');
  el.innerHTML = songs.length === 0
    ? '<div class="admin-empty">No hay canciones todavía. Agrega la primera.</div>'
    : songs.map(s => `
      <div class="admin-item">
        <div class="admin-item-info">
          <div class="admin-item-title">${esc(s.title)}</div>
          <div class="admin-item-sub">${esc(s.artist)}</div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-sm btn-sm-edit" onclick="editSong('${s.id}')">Editar</button>
          <button class="btn-sm btn-sm-del"  onclick="deleteSong('${s.id}')">Eliminar</button>
        </div>
      </div>`).join('');
}

function editSong(id) {
  const song = DB.getSongs().find(s => s.id === id);
  if (!song) return;
  editingSongId = id;
  document.getElementById('songTitle').value  = song.title;
  document.getElementById('songArtist').value = song.artist;
  document.getElementById('songLyrics').value = song.lyrics;
  document.getElementById('songFormTitle').textContent = 'Editar Canción';
  document.getElementById('songCancelBtn').style.display = 'flex';
  document.getElementById('songTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('songTitle').focus();
}

function deleteSong(id) {
  if (!confirm('¿Eliminar esta canción? Esta acción no se puede deshacer.')) return;
  DB.deleteSong(id);
  renderSongsList();
  toast('Canción eliminada');
}

function resetSongForm() {
  editingSongId = null;
  document.getElementById('songForm').reset();
  document.getElementById('songFormTitle').textContent = 'Agregar Canción';
  document.getElementById('songCancelBtn').style.display = 'none';
}

document.getElementById('songForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    title:  document.getElementById('songTitle').value.trim(),
    artist: document.getElementById('songArtist').value.trim(),
    lyrics: document.getElementById('songLyrics').value.trim(),
  };
  if (!data.title || !data.lyrics) { toast('El título y la letra son requeridos.', true); return; }

  if (editingSongId) {
    DB.updateSong(editingSongId, data);
    toast('Canción actualizada');
  } else {
    DB.addSong(data);
    toast('Canción agregada');
  }
  resetSongForm();
  renderSongsList();
});

document.getElementById('songCancelBtn').addEventListener('click', resetSongForm);

/* ════════════════════════════════
   PRAYERS
════════════════════════════════ */
let editingPrayerId = null;

function renderPrayersList() {
  const prayers = DB.getPrayers().sort((a, b) => a.title.localeCompare(b.title, 'es'));
  const el = document.getElementById('prayersList');
  el.innerHTML = prayers.length === 0
    ? '<div class="admin-empty">No hay oraciones todavía. Agrega la primera.</div>'
    : prayers.map(p => `
      <div class="admin-item">
        <div class="admin-item-info">
          <div class="admin-item-title">${esc(p.title)}</div>
          <div class="admin-item-sub">${esc(p.situation || 'Sin categoría')}</div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-sm btn-sm-edit" onclick="editPrayer('${p.id}')">Editar</button>
          <button class="btn-sm btn-sm-del"  onclick="deletePrayer('${p.id}')">Eliminar</button>
        </div>
      </div>`).join('');
}

function editPrayer(id) {
  const p = DB.getPrayers().find(x => x.id === id);
  if (!p) return;
  editingPrayerId = id;
  document.getElementById('prayerTitle').value     = p.title;
  document.getElementById('prayerSituation').value = p.situation || '';
  document.getElementById('prayerContent').value   = p.content;
  document.getElementById('prayerFormTitle').textContent = 'Editar Oración';
  document.getElementById('prayerCancelBtn').style.display = 'flex';
  document.getElementById('prayerTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('prayerTitle').focus();
}

function deletePrayer(id) {
  if (!confirm('¿Eliminar esta oración? Esta acción no se puede deshacer.')) return;
  DB.deletePrayer(id);
  renderPrayersList();
  toast('Oración eliminada');
}

function resetPrayerForm() {
  editingPrayerId = null;
  document.getElementById('prayerForm').reset();
  document.getElementById('prayerFormTitle').textContent = 'Agregar Oración';
  document.getElementById('prayerCancelBtn').style.display = 'none';
}

document.getElementById('prayerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    title:     document.getElementById('prayerTitle').value.trim(),
    situation: document.getElementById('prayerSituation').value.trim(),
    content:   document.getElementById('prayerContent').value.trim(),
  };
  if (!data.title || !data.content) { toast('El título y el contenido son requeridos.', true); return; }

  if (editingPrayerId) {
    DB.updatePrayer(editingPrayerId, data);
    toast('Oración actualizada');
  } else {
    DB.addPrayer(data);
    toast('Oración agregada');
  }
  resetPrayerForm();
  renderPrayersList();
});

document.getElementById('prayerCancelBtn').addEventListener('click', resetPrayerForm);

/* ════════════════════════════════
   EVENTS
════════════════════════════════ */
let editingEventId = null;

function renderEventsList() {
  const events = DB.getEvents().sort((a, b) => a.date.localeCompare(b.date));
  const el = document.getElementById('eventsList');
  el.innerHTML = events.length === 0
    ? '<div class="admin-empty">No hay actividades especiales todavía.</div>'
    : events.map(ev => `
      <div class="admin-item">
        <div class="admin-item-info">
          <div class="admin-item-title">${esc(ev.title)}</div>
          <div class="admin-item-sub">${esc(ev.date)}${ev.time ? ' · ' + esc(ev.time) : ''}</div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-sm btn-sm-edit" onclick="editEvent('${ev.id}')">Editar</button>
          <button class="btn-sm btn-sm-del"  onclick="deleteEvent('${ev.id}')">Eliminar</button>
        </div>
      </div>`).join('');
}

function editEvent(id) {
  const ev = DB.getEvents().find(x => x.id === id);
  if (!ev) return;
  editingEventId = id;
  document.getElementById('eventTitle').value       = ev.title;
  document.getElementById('eventDate').value        = ev.date;
  document.getElementById('eventTime').value        = ev.time || '';
  document.getElementById('eventDescription').value = ev.description || '';
  document.getElementById('eventFormTitle').textContent = 'Editar Actividad';
  document.getElementById('eventCancelBtn').style.display = 'flex';
  document.getElementById('eventTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('eventTitle').focus();
}

function deleteEvent(id) {
  if (!confirm('¿Eliminar esta actividad? Esta acción no se puede deshacer.')) return;
  DB.deleteEvent(id);
  renderEventsList();
  toast('Actividad eliminada');
}

function resetEventForm() {
  editingEventId = null;
  document.getElementById('eventForm').reset();
  document.getElementById('eventFormTitle').textContent = 'Agregar Actividad';
  document.getElementById('eventCancelBtn').style.display = 'none';
}

document.getElementById('eventForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    title:       document.getElementById('eventTitle').value.trim(),
    date:        document.getElementById('eventDate').value,
    time:        document.getElementById('eventTime').value.trim(),
    description: document.getElementById('eventDescription').value.trim(),
  };
  if (!data.title || !data.date) { toast('El nombre y la fecha son requeridos.', true); return; }

  if (editingEventId) {
    DB.updateEvent(editingEventId, data);
    toast('Actividad actualizada');
  } else {
    DB.addEvent(data);
    toast('Actividad agregada');
  }
  resetEventForm();
  renderEventsList();
});

document.getElementById('eventCancelBtn').addEventListener('click', resetEventForm);

/* ════════════════════════════════
   EXPORT / IMPORT
════════════════════════════════ */
document.getElementById('exportBtn').addEventListener('click', () => {
  const json = DB.export();
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'iglesia-joven-data.json' });
  a.click();
  URL.revokeObjectURL(url);
  toast('Datos exportados correctamente');
});

document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importInput').click();
});

document.getElementById('importInput').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const ok = DB.import(e.target.result);
    if (ok) {
      renderSongsList();
      renderPrayersList();
      renderEventsList();
      toast('Datos importados correctamente');
    } else {
      toast('Error: el archivo no es válido.', true);
    }
    this.value = '';
  };
  reader.readAsText(file);
});

/* ── Init ── */
renderSongsList();
renderPrayersList();
renderEventsList();
