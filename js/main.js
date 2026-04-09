/* === IGLESIA JOVEN · MAIN.JS (Landing Page) === */

/* ── Nav scroll ── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile menu ── */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

/* ── Scroll reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Second Thursday calculation ── */
function getSecondThursday(year, month) {
  let count = 0;
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) break;
    if (d.getDay() === 4) { // Thursday
      count++;
      if (count === 2) return d;
    }
  }
}

function getUpcomingThursdays(count = 7) {
  const result = [];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  while (result.length < count) {
    const d = getSecondThursday(year, month);
    if (d) result.push(d);
    month++;
    if (month > 11) { month = 0; year++; }
  }
  return result;
}

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS_ES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

function fmt(date) {
  return {
    month:   MONTHS_ES[date.getMonth()].toUpperCase(),
    day:     date.getDate(),
    dayName: DAYS_ES[date.getDay()],
    year:    date.getFullYear(),
    iso:     `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
  };
}

function today0() {
  const d = new Date(); d.setHours(0,0,0,0); return d;
}

/* ── Render dates grid ── */
async function renderFechas() {
  const grid = document.getElementById('fechasGrid');
  const specialEl = document.getElementById('specialEvents');
  if (!grid) return;

  const now = today0();
  const thursdays = getUpcomingThursdays(7);
  let firstFuture = true;

  grid.innerHTML = thursdays.map(d => {
    const f = fmt(d);
    const isPast = d < now;
    const isNext = !isPast && firstFuture;
    if (isNext) firstFuture = false;

    return `
      <div class="fecha-card${isPast ? ' past' : ''}">
        ${isNext ? '<span class="fecha-badge">Próxima</span>' : ''}
        <div class="fecha-month">${f.month} ${f.year}</div>
        <div class="fecha-day">${f.day}</div>
        <div class="fecha-detail">${f.dayName} · 7:00 PM<br>Pquia. San Rafael · Escazú</div>
      </div>`;
  }).join('');

  /* Special events from admin */
  const events = (await DB.getEvents())
    .filter(e => new Date(e.date + 'T00:00:00') >= now)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (events.length > 0) {
    specialEl.innerHTML = `<p class="special-events-title">Actividades Especiales</p>
      <div class="fechas-grid">
        ${events.map(ev => {
          const d = new Date(ev.date + 'T00:00:00');
          const f = fmt(d);
          return `
            <div class="fecha-card special">
              <span class="fecha-badge orange">${ev.title}</span>
              <div class="fecha-month">${f.month} ${f.year}</div>
              <div class="fecha-day">${f.day}</div>
              <div class="fecha-detail">${ev.time ? ev.time + ' · ' : ''}${ev.description || ''}</div>
            </div>`;
        }).join('')}
      </div>`;
  } else {
    specialEl.innerHTML = '';
  }
}

renderFechas();
