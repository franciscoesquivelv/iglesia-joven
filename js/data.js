/* === IGLESIA JOVEN · DATA LAYER (localStorage) === */

const DB = (() => {
  const KEYS = { songs: 'ij_songs', prayers: 'ij_prayers', events: 'ij_events' };

  const get = (key) => {
    try { return JSON.parse(localStorage.getItem(KEYS[key]) || '[]'); }
    catch { return []; }
  };
  const save = (key, data) => localStorage.setItem(KEYS[key], JSON.stringify(data));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  return {
    /* ── SONGS ── */
    getSongs: () => get('songs'),
    addSong(data) {
      const items = get('songs');
      const item = { id: uid(), ...data, createdAt: Date.now() };
      items.push(item);
      save('songs', items);
      return item;
    },
    updateSong(id, data) {
      const items = get('songs');
      const idx = items.findIndex(x => x.id === id);
      if (idx !== -1) { items[idx] = { ...items[idx], ...data }; save('songs', items); }
    },
    deleteSong(id) { save('songs', get('songs').filter(x => x.id !== id)); },

    /* ── PRAYERS ── */
    getPrayers: () => get('prayers'),
    addPrayer(data) {
      const items = get('prayers');
      const item = { id: uid(), ...data, createdAt: Date.now() };
      items.push(item);
      save('prayers', items);
      return item;
    },
    updatePrayer(id, data) {
      const items = get('prayers');
      const idx = items.findIndex(x => x.id === id);
      if (idx !== -1) { items[idx] = { ...items[idx], ...data }; save('prayers', items); }
    },
    deletePrayer(id) { save('prayers', get('prayers').filter(x => x.id !== id)); },

    /* ── SPECIAL EVENTS ── */
    getEvents: () => get('events'),
    addEvent(data) {
      const items = get('events');
      const item = { id: uid(), ...data, createdAt: Date.now() };
      items.push(item);
      save('events', items);
      return item;
    },
    updateEvent(id, data) {
      const items = get('events');
      const idx = items.findIndex(x => x.id === id);
      if (idx !== -1) { items[idx] = { ...items[idx], ...data }; save('events', items); }
    },
    deleteEvent(id) { save('events', get('events').filter(x => x.id !== id)); },

    /* ── EXPORT / IMPORT ── */
    export() {
      return JSON.stringify(
        { songs: get('songs'), prayers: get('prayers'), events: get('events') },
        null, 2
      );
    },
    import(json) {
      try {
        const data = JSON.parse(json);
        if (Array.isArray(data.songs))   save('songs',   data.songs);
        if (Array.isArray(data.prayers)) save('prayers', data.prayers);
        if (Array.isArray(data.events))  save('events',  data.events);
        return true;
      } catch { return false; }
    }
  };
})();
