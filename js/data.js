/* === IGLESIA JOVEN · DATA LAYER (Firebase Firestore) === */

const firebaseConfig = {
  apiKey: "AIzaSyAf3aW5fmUyC6XAuvlcJiipiQCjLfehqO4",
  authDomain: "iglesiajoven-23672.firebaseapp.com",
  projectId: "iglesiajoven-23672",
  storageBucket: "iglesiajoven-23672.firebasestorage.app",
  messagingSenderId: "144881135379",
  appId: "1:144881135379:web:a96c1cb8a7a8d2111134e6"
};

firebase.initializeApp(firebaseConfig);
const _db = firebase.firestore();

const DB = {

  /* ── SONGS ── */
  async getSongs() {
    const snap = await _db.collection('songs').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async addSong(data) {
    const ref = await _db.collection('songs').add({ ...data, createdAt: Date.now() });
    return { id: ref.id, ...data };
  },
  async updateSong(id, data) {
    await _db.collection('songs').doc(id).update(data);
  },
  async deleteSong(id) {
    await _db.collection('songs').doc(id).delete();
  },

  /* ── PRAYERS ── */
  async getPrayers() {
    const snap = await _db.collection('prayers').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async addPrayer(data) {
    const ref = await _db.collection('prayers').add({ ...data, createdAt: Date.now() });
    return { id: ref.id, ...data };
  },
  async updatePrayer(id, data) {
    await _db.collection('prayers').doc(id).update(data);
  },
  async deletePrayer(id) {
    await _db.collection('prayers').doc(id).delete();
  },

  /* ── EVENTS ── */
  async getEvents() {
    const snap = await _db.collection('events').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async addEvent(data) {
    const ref = await _db.collection('events').add({ ...data, createdAt: Date.now() });
    return { id: ref.id, ...data };
  },
  async updateEvent(id, data) {
    await _db.collection('events').doc(id).update(data);
  },
  async deleteEvent(id) {
    await _db.collection('events').doc(id).delete();
  },

  /* ── EXPORT / IMPORT ── */
  async export() {
    const [songs, prayers, events] = await Promise.all([
      this.getSongs(), this.getPrayers(), this.getEvents()
    ]);
    return JSON.stringify({ songs, prayers, events }, null, 2);
  },
  async import(json) {
    try {
      const data = JSON.parse(json);
      const batch = _db.batch();
      if (Array.isArray(data.songs)) {
        data.songs.forEach(s => {
          const { id, ...rest } = s;
          const ref = id ? _db.collection('songs').doc(id) : _db.collection('songs').doc();
          batch.set(ref, rest);
        });
      }
      if (Array.isArray(data.prayers)) {
        data.prayers.forEach(p => {
          const { id, ...rest } = p;
          const ref = id ? _db.collection('prayers').doc(id) : _db.collection('prayers').doc();
          batch.set(ref, rest);
        });
      }
      if (Array.isArray(data.events)) {
        data.events.forEach(e => {
          const { id, ...rest } = e;
          const ref = id ? _db.collection('events').doc(id) : _db.collection('events').doc();
          batch.set(ref, rest);
        });
      }
      await batch.commit();
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  }
};
