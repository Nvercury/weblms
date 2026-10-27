'use strict';
/* =====================================================================
   EduSmart LMS - SMA Nusantara Cerdas
   HTML + Bootstrap 5 + JavaScript (semua data adalah data dummy)
   ===================================================================== */

/* ---------------------------- Utilities ---------------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const isoOffset = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmtDate = iso => new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
const diffDays = iso => Math.round((new Date(iso + 'T00:00:00') - new Date(new Date().toDateString())) / 864e5);
const dueInfo = iso => {
  const n = diffDays(iso);
  if (n < 0) return { t: 'Terlambat ' + (-n) + ' hari', c: 'danger' };
  if (n === 0) return { t: 'Hari ini', c: 'danger' };
  if (n === 1) return { t: 'Besok', c: 'warning' };
  if (n <= 3) return { t: n + ' hari lagi', c: 'warning' };
  return { t: n + ' hari lagi', c: 'success' };
};
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const rng = seed => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
const palette = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444', '#14b8a6'];
const initials = n => n.replace(/,.*$/, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('');
const avatar = (name, size = 40) => `<span class="avatar" style="width:${size}px;height:${size}px;background:${palette[hash(name) % palette.length]};font-size:${size * .38}px">${initials(name)}</span>`;
const predikat = n => n >= 90 ? 'A' : n >= 80 ? 'B' : n >= 70 ? 'C' : n >= 60 ? 'D' : 'E';
const gradeTone = n => n >= 85 ? 'success' : n >= 75 ? 'primary' : n >= 65 ? 'warning' : 'danger';
const avgOf = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length * 10) / 10 : 0;
const greet = () => { const h = new Date().getHours(); return h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam'; };
const longDate = () => new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
const todayName = () => { const i = new Date().getDay(); return i >= 1 && i <= 5 ? DAYS[i - 1] : null; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const store = {
  get(k, d) { try { const v = localStorage.getItem('lms_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('lms_' + k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
  del(k) { try { localStorage.removeItem('lms_' + k); } catch (e) { /* abaikan */ } }
};

/* ---------------------------- Data dummy --------------------------- */
const SUBJECTS = [
  { id: 'mtk', name: 'Matematika', teacher: 'Ratna Wulandari, S.Pd.', icon: 'bi-calculator', color: '#6366f1', room: 'R. 204' },
  { id: 'fis', name: 'Fisika', teacher: 'Budi Santoso, M.Pd.', icon: 'bi-lightning-charge', color: '#f59e0b', room: 'Lab Fisika' },
  { id: 'kim', name: 'Kimia', teacher: 'Dewi Lestari, S.Si.', icon: 'bi-droplet-half', color: '#10b981', room: 'Lab Kimia' },
  { id: 'bio', name: 'Biologi', teacher: 'Hendra Gunawan, S.Pd.', icon: 'bi-flower1', color: '#14b8a6', room: 'Lab Biologi' },
  { id: 'ind', name: 'Bahasa Indonesia', teacher: 'Siti Aminah, S.Pd.', icon: 'bi-book', color: '#ec4899', room: 'R. 204' },
  { id: 'ing', name: 'Bahasa Inggris', teacher: 'Andre Wijaya, S.S.', icon: 'bi-translate', color: '#06b6d4', room: 'R. 204' },
  { id: 'sej', name: 'Sejarah', teacher: 'Agus Setiawan, S.Pd.', icon: 'bi-hourglass-split', color: '#8b5cf6', room: 'R. 204' },
  { id: 'pjok', name: 'PJOK', teacher: 'Rudi Hartono, S.Pd.', icon: 'bi-dribbble', color: '#ef4444', room: 'Lapangan' }
];
const subj = id => SUBJECTS.find(s => s.id === id);

const CLASSES = [
  { id: 'c1', name: 'XI IPA 1', room: 'R. 204' },
  { id: 'c2', name: 'XI IPA 2', room: 'R. 205' },
  { id: 'c3', name: 'XII IPA 1', room: 'R. 301' }
];
const clsName = id => CLASSES.find(c => c.id === id).name;

const NAMES = ['Aditya Pratama', 'Bunga Citra Lestari', 'Dimas Ardiansyah', 'Eka Putri Wulandari', 'Farhan Maulana', 'Gita Safitri', 'Hafiz Ramadhan', 'Intan Permata Sari', 'Joni Kurniawan', 'Kirana Anindya', 'Lukman Hakim', 'Maya Anggraini', 'Naufal Rizky', 'Olivia Handayani', 'Putra Wijaya', 'Qori Nur Azizah', 'Rizky Firmansyah', 'Salsabila Putri', 'Tegar Prakoso', 'Vina Melinda'];
const STUDENTS = NAMES.map((n, i) => ({ id: 's' + (i + 1), name: n, nis: String(2024001 + i), classId: i < 8 ? 'c1' : i < 14 ? 'c2' : 'c3', attend: Math.round(88 + rng(i + 3)() * 12) }));
const studentsOf = cid => STUDENTS.filter(s => s.classId === cid);

const USERS = {
  teacher: { role: 'teacher', id: '198504122010012005', name: 'Ratna Wulandari, S.Pd.', call: 'Bu Ratna', email: 'ratna.wulandari@nusantaracerdas.sch.id', phone: '0812-3456-7890', addr: 'Jl. Pendidikan No. 12, Jakarta Selatan' },
  student: { role: 'student', id: '2024001', sid: 's1', name: 'Aditya Pratama', call: 'Aditya', className: 'XI IPA 1', classId: 'c1', email: 'aditya.pratama@siswa.nusantaracerdas.sch.id', phone: '0857-1122-3344', addr: 'Jl. Melati No. 5, Jakarta Timur' }
};
const CREDS = { student: { u: 'aditya.pratama', p: 'siswa123' }, teacher: { u: 'ratna.wulandari', p: 'guru123' } };

let mid = 0;
const M = (subject, classId, title, type, ago, size) => ({ id: ++mid, subject, classId, title, type, date: isoOffset(-ago), size });
const MATERIALS = [
  M('mtk', 'c1', 'Trigonometri: Perbandingan & Identitas', 'PDF', 2, '2,4 MB'),
  M('mtk', 'c1', 'Video Pembahasan Persamaan Trigonometri', 'Video', 5, '48 mnt'),
  M('mtk', 'c2', 'Limit Fungsi Aljabar', 'PPT', 3, '5,1 MB'),
  M('mtk', 'c3', 'Turunan & Aplikasinya', 'PDF', 1, '3,2 MB'),
  M('mtk', 'c3', 'Latihan Soal Integral Tak Tentu', 'PDF', 6, '1,1 MB'),
  M('fis', 'c1', 'Hukum Newton & Penerapannya', 'PPT', 4, '6,0 MB'),
  M('fis', 'c1', 'Simulasi Gerak Parabola', 'Video', 7, '22 mnt'),
  M('kim', 'c1', 'Stoikiometri Larutan', 'PDF', 3, '2,9 MB'),
  M('kim', 'c1', 'Panduan Praktikum Titrasi', 'PDF', 8, '1,8 MB'),
  M('bio', 'c1', 'Sistem Peredaran Darah', 'PPT', 2, '7,3 MB'),
  M('ind', 'c1', 'Teks Eksposisi & Argumentasi', 'PDF', 5, '1,4 MB'),
  M('ing', 'c1', 'Conditional Sentences Type 1-3', 'PPT', 1, '4,0 MB'),
  M('ing', 'c1', 'Listening Practice: Daily Conversation', 'Audio', 6, '15 mnt'),
  M('sej', 'c1', 'Perang Dunia II & Dampaknya', 'Video', 9, '35 mnt'),
  M('pjok', 'c1', 'Teknik Dasar Bola Voli', 'Video', 10, '12 mnt')
];
const TYPE = { PDF: ['bi-file-earmark-pdf-fill', '#ef4444'], PPT: ['bi-file-earmark-slides-fill', '#f59e0b'], Video: ['bi-play-circle-fill', '#6366f1'], Audio: ['bi-headphones', '#10b981'] };

let tid = 0;
const T = (kind, subject, classId, title, dueIn, total, submitted, extra = {}) => ({ id: ++tid, kind, subject, classId, title, due: isoOffset(dueIn), total, submitted, ...extra });
const TASKS = [
  T('Tugas', 'mtk', 'c1', 'Latihan Soal Identitas Trigonometri', 2, 8, 5),
  T('Tugas', 'mtk', 'c2', 'Soal Cerita Limit Fungsi', 4, 6, 2),
  T('Tugas', 'mtk', 'c3', 'Aplikasi Turunan: Maksimum-Minimum', 1, 6, 6),
  T('Ujian', 'mtk', 'c1', 'UTS Trigonometri', 6, 8, 0, { duration: 60 }),
  T('Ujian', 'mtk', 'c3', 'Ulangan Harian Integral', 9, 6, 0, { duration: 45 }),
  T('Tugas', 'fis', 'c1', 'Laporan Gerak Parabola', 3, 8, 0),
  T('Ujian', 'fis', 'c1', 'Kuis Hukum Newton', 2, 8, 0, { duration: 30 }),
  T('Tugas', 'kim', 'c1', 'Rangkuman Stoikiometri', 5, 8, 0),
  T('Ujian', 'kim', 'c1', 'Ulangan Harian Larutan', 8, 8, 0, { duration: 45 }),
  T('Tugas', 'ind', 'c1', 'Menulis Teks Eksposisi', -1, 8, 0),
  T('Tugas', 'ing', 'c1', 'Essay: My Dream School', 7, 8, 0),
  T('Ujian', 'ing', 'c1', 'English Quiz: Conditionals', 4, 8, 0, { duration: 30 }),
  T('Tugas', 'bio', 'c1', 'Poster Sistem Peredaran Darah', 10, 8, 0),
  T('Tugas', 'mtk', 'c1', 'Latihan Soal Dasar Trigonometri', -5, 8, 8, { seedScore: 88 }),
  T('Tugas', 'kim', 'c1', 'Kuis Sifat Koligatif', -7, 8, 8, { seedScore: 92 }),
  T('Tugas', 'fis', 'c1', 'Soal Dinamika Partikel', -4, 8, 8, { seedScore: 85 })
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'Upacara Hari Sumpah Pemuda', cat: 'Kegiatan', ago: 0, author: 'Wakil Kepala Sekolah', pinned: true, body: 'Upacara peringatan Hari Sumpah Pemuda akan dilaksanakan Rabu, 28 Oktober 2026 pukul 07:00 di lapangan utama. Seluruh siswa dan guru wajib hadir mengenakan seragam putih abu-abu lengkap.' },
  { id: 2, title: 'Jadwal Ujian Tengah Semester', cat: 'Akademik', ago: 1, author: 'Waka Kurikulum', pinned: true, body: 'UTS semester ganjil dimulai dalam dua minggu ke depan. Silakan cek menu Ujian untuk jadwal tiap mata pelajaran dan pastikan seluruh materi sudah dipelajari.' },
  { id: 3, title: 'Pemeliharaan Sistem LMS', cat: 'Sistem', ago: 2, author: 'Tim IT Sekolah', pinned: false, body: 'LMS akan menjalani pemeliharaan pada Sabtu pukul 22:00 - 24:00. Selama waktu tersebut layanan tidak dapat diakses. Mohon simpan pekerjaan Anda sebelumnya.' },
  { id: 4, title: 'Olimpiade Sains Tingkat Kota', cat: 'Kegiatan', ago: 4, author: 'Pembina OSIS', pinned: false, body: 'Pendaftaran Olimpiade Sains Tingkat Kota dibuka untuk bidang Matematika, Fisika, Kimia, dan Biologi. Pendaftaran melalui wali kelas masing-masing hingga akhir bulan.' },
  { id: 5, title: 'Pembagian Rapor Tengah Semester', cat: 'Akademik', ago: 6, author: 'Tata Usaha', pinned: false, body: 'Rapor tengah semester dapat diambil oleh orang tua/wali pada hari Sabtu pukul 08:00 - 12:00 di ruang kelas masing-masing.' }
];

const NOTIFS = {
  teacher: [
    { id: 't1', icon: 'bi-inbox-fill', c: '#6366f1', text: '5 siswa mengumpulkan <b>Latihan Soal Identitas Trigonometri</b>', time: '10 menit lalu', page: 'penilaian' },
    { id: 't2', icon: 'bi-megaphone-fill', c: '#f59e0b', text: 'Pengumuman baru: <b>Upacara Hari Sumpah Pemuda</b>', time: '1 jam lalu', page: 'pengumuman' },
    { id: 't3', icon: 'bi-calendar-event-fill', c: '#10b981', text: 'Jadwal mengajar besok: <b>XI IPA 1</b> pukul 10:15', time: '3 jam lalu', page: 'jadwal' },
    { id: 't4', icon: 'bi-clipboard-check-fill', c: '#ec4899', text: 'Tenggat <b>Aplikasi Turunan</b> (XII IPA 1) sudah terlewati', time: 'Kemarin', page: 'tugas' }
  ],
  student: [
    { id: 's1', icon: 'bi-exclamation-triangle-fill', c: '#ef4444', text: 'Tugas <b>Menulis Teks Eksposisi</b> sudah melewati tenggat', time: '30 menit lalu', page: 'tugas' },
    { id: 's2', icon: 'bi-patch-question-fill', c: '#f59e0b', text: '<b>Kuis Hukum Newton</b> dimulai 2 hari lagi', time: '2 jam lalu', page: 'ujian' },
    { id: 's3', icon: 'bi-award-fill', c: '#10b981', text: 'Nilai <b>Kuis Sifat Koligatif</b> telah terbit: 92', time: 'Kemarin', page: 'nilai' },
    { id: 's4', icon: 'bi-journal-richtext', c: '#6366f1', text: 'Materi baru: <b>Conditional Sentences Type 1-3</b>', time: 'Kemarin', page: 'materi' },
    { id: 's5', icon: 'bi-megaphone-fill', c: '#ec4899', text: 'Pengumuman: <b>Upacara Hari Sumpah Pemuda</b>', time: '2 hari lalu', page: 'pengumuman' }
  ]
};

const TIMES = ['07:00 - 08:30', '08:30 - 10:00', '10:15 - 11:45', '12:30 - 14:00'];
const STUDENT_SCHEDULE = {
  Senin: ['mtk', 'fis', 'ind', 'sej'], Selasa: ['kim', 'bio', 'ing', 'mtk'], Rabu: ['fis', 'mtk', 'pjok', 'ind'],
  Kamis: ['ing', 'kim', 'bio', 'sej'], Jumat: ['mtk', 'ind', 'ing', null]
};
const TEACHER_SCHEDULE = {
  Senin: { 0: 'c1', 2: 'c2' }, Selasa: { 1: 'c3', 3: 'c1' }, Rabu: { 0: 'c2', 1: 'c1', 3: 'c3' },
  Kamis: { 2: 'c3' }, Jumat: { 0: 'c1', 1: 'c2' }
};

const QUIZ = {
  mtk: [
    { q: 'Nilai dari sin 30° adalah ...', o: ['1/2', '√3/2', '1', '0'], a: 0 },
    { q: 'Identitas trigonometri yang benar adalah ...', o: ['sin²x + cos²x = 1', 'sin x + cos x = 1', 'tan x = cos x / sin x', 'sin²x − cos²x = 1'], a: 0 },
    { q: 'Nilai cos 60° sama dengan ...', o: ['√3/2', '1/2', '√2/2', '1'], a: 1 }
  ],
  fis: [
    { q: 'Hukum I Newton disebut juga hukum ...', o: ['Aksi-reaksi', 'Inersia', 'Gravitasi', 'Percepatan'], a: 1 },
    { q: 'Rumus Hukum II Newton adalah ...', o: ['F = m × a', 'F = m / a', 'F = a / m', 'F = m + a'], a: 0 },
    { q: 'Satuan gaya dalam SI adalah ...', o: ['Joule', 'Watt', 'Newton', 'Pascal'], a: 2 }
  ],
  kim: [
    { q: 'Massa molar H₂O (Ar H = 1, O = 16) adalah ...', o: ['16', '18', '20', '32'], a: 1 },
    { q: 'Jumlah partikel dalam 1 mol zat adalah ...', o: ['6,02 × 10²³', '3,01 × 10²³', '6,02 × 10²²', '1,66 × 10⁻²⁴'], a: 0 },
    { q: 'Rumus mol adalah ...', o: ['massa × Mr', 'massa / Mr', 'Mr / massa', 'massa + Mr'], a: 1 }
  ],
  ing: [
    { q: 'If it rains, I ___ at home. (Type 1)', o: ['will stay', 'would stay', 'stayed', 'had stayed'], a: 0 },
    { q: 'If I were a bird, I ___ fly. (Type 2)', o: ['will', 'would', 'did', 'had'], a: 1 },
    { q: 'If she had studied, she ___ the exam. (Type 3)', o: ['would pass', 'will pass', 'would have passed', 'passed'], a: 2 }
  ]
};

/* ---------------------------- State -------------------------------- */
const ACCENTS = { indigo: ['#6366f1', '#8b5cf6'], emerald: ['#10b981', '#06b6d4'], rose: ['#f43f5e', '#f97316'], ocean: ['#0ea5e9', '#6366f1'], amber: ['#f59e0b', '#ef4444'] };
const settings = Object.assign({ theme: 'light', accent: 'indigo', anim: true, font: 'md', emailNotif: true }, store.get('settings', {}));
const state = { role: null, page: 'dashboard', user: null };
const ui = {};
let READ = new Set(store.get('read', [1, 6, 8, 11]));
let SUBS = store.get('subs', null) || Object.fromEntries(TASKS.filter(t => t.seedScore).map(t => [t.id, { date: isoOffset(-3), file: 'jawaban.pdf', score: t.seedScore }]));
let EXAMS = store.get('exams', {});
let NREAD = new Set(store.get('nread', []));
const SC = {};
function getScores(sid, sj) {
  const k = sid + sj;
  if (!SC[k]) { const r = rng(hash(k)); const v = () => Math.round(68 + r() * 28); SC[k] = { tugas: v(), uts: v(), uas: v() }; }
  return SC[k];
}
const finalOf = (sid, sj) => { const s = getScores(sid, sj); return Math.round(s.tugas * .3 + s.uts * .3 + s.uas * .4); };

function applySettings() {
  const r = document.documentElement;
  r.setAttribute('data-bs-theme', settings.theme);
  const a = ACCENTS[settings.accent] || ACCENTS.indigo;
  r.style.setProperty('--accent', a[0]); r.style.setProperty('--accent2', a[1]);
  r.style.fontSize = { sm: '14px', md: '16px', lg: '17.5px' }[settings.font];
  document.body.classList.toggle('no-anim', !settings.anim);
  store.set('settings', settings);
}

/* ---------------------------- UI helpers --------------------------- */
let modalInst = null;
function openModal({ title, body, footer = '', size = '' }) {
  $('#modalTitle').innerHTML = title;
  $('#modalBody').innerHTML = body;
  $('#modalFooter').innerHTML = footer;
  $('#modalFooter').classList.toggle('d-none', !footer);
  $('#appModal .modal-dialog').className = 'modal-dialog modal-dialog-centered modal-dialog-scrollable ' + size;
  modalInst = bootstrap.Modal.getOrCreateInstance($('#appModal'));
  modalInst.show();
}
const closeModal = () => modalInst && modalInst.hide();

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0`;
  el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2"></i>${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  $('#toasts').appendChild(el);
  new bootstrap.Toast(el, { delay: 2600 }).show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

function confetti() {
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('i');
    p.className = 'confetti';
    p.style.cssText = `left:${Math.random() * 100}vw;background:${palette[i % palette.length]};animation-delay:${Math.random() * .4}s;--dx:${(Math.random() - .5) * 260}px;--rot:${Math.random() * 720}deg`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2800);
  }
}

function animateCounters(root) {
  $$('[data-count]', root).forEach(el => {
    const target = parseFloat(el.dataset.count), dec = target % 1 ? 1 : 0, dur = settings.anim ? 1100 : 0, t0 = performance.now();
    const tick = now => {
      const k = dur ? Math.min((now - t0) / dur, 1) : 1, e = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * e).toFixed(dec).replace('.', ',');
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
function post(root) {
  $$('.reveal', root).forEach((el, i) => el.style.animationDelay = (i * 55) + 'ms');
  animateCounters(root);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$('[data-w]', root).forEach(el => el.style.width = el.dataset.w + '%');
    $$('[data-p]', root).forEach(el => el.style.setProperty('--p', el.dataset.p));
  }));
}

let charts = [];
const killCharts = () => { charts.forEach(c => c.destroy()); charts = []; };
function chart(id, cfg) {
  const el = document.getElementById(id);
  if (!el || typeof Chart === 'undefined') return;
  const dark = settings.theme === 'dark';
  Chart.defaults.color = dark ? '#9aa0c3' : '#6b7394';
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.borderColor = dark ? '#262a49' : '#e7e9f3';
  cfg.options = Object.assign({ responsive: true, maintainAspectRatio: false }, cfg.options || {});
  charts.push(new Chart(el, cfg));
}
const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
const accent2 = () => getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim();

const head = (title, sub, actions = '') => `<div class="page-head reveal"><div><h2>${title}</h2><p>${sub}</p></div><div class="d-flex gap-2 flex-wrap">${actions}</div></div>`;
const stat = (icon, label, value, color, suffix = '') => `<div class="col-6 col-xl-3 reveal"><div class="card-x stat hover-lift"><div class="icon-bubble" style="--c:${color}"><i class="bi ${icon}"></i></div><div><div class="stat-label">${label}</div><div class="stat-value"><span data-count="${value}">0</span>${suffix}</div></div></div></div>`;
const empty = (msg, icon = 'bi-inbox') => `<div class="empty"><i class="bi ${icon}"></i>${msg}</div>`;
const bar = (pct, c = '', c2 = '') => `<div class="bar" ${c ? `style="--c:${c};--c2:${c2 || c}"` : ''}><i data-w="${pct}"></i></div>`;

function matCard(m, role) {
  const [ic, col] = TYPE[m.type], s = subj(m.subject), done = role === 'student' && READ.has(m.id);
  return `<div class="col-md-6 col-xl-4 reveal"><div class="card-x hover-lift h-100">
    <div class="d-flex gap-3"><div class="icon-bubble" style="--c:${col}"><i class="bi ${ic}"></i></div>
    <div class="flex-grow-1"><div class="fw-bold">${esc(m.title)}</div><div class="small text-muted">${s.name}${role === 'teacher' ? ' · ' + clsName(m.classId) : ''}</div></div>
    ${done ? '<i class="bi bi-check-circle-fill text-success fs-5"></i>' : ''}</div>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <span class="small text-muted"><i class="bi bi-calendar3"></i> ${fmtDate(m.date)} · ${m.size}</span>
      ${role === 'teacher'
        ? `<button class="btn btn-sm btn-light-x" data-act="delMateri" data-id="${m.id}" title="Hapus"><i class="bi bi-trash"></i></button>`
        : `<button class="btn btn-sm btn-accent px-3" data-act="openMat" data-id="${m.id}">${done ? 'Buka lagi' : 'Buka'}</button>`}
    </div></div></div>`;
}

/* ---------------------------- Menus -------------------------------- */
const MENUS = {
  teacher: [['dashboard', 'Dashboard', 'bi-speedometer2'], ['kelas', 'Kelas Saya', 'bi-people'], ['materi', 'Materi', 'bi-journal-richtext'], ['tugas', 'Tugas & Ujian', 'bi-clipboard-check'], ['penilaian', 'Penilaian', 'bi-award'], ['jadwal', 'Jadwal Mengajar', 'bi-calendar-week'], ['profil', 'Profil', 'bi-person-circle']],
  student: [['dashboard', 'Dashboard', 'bi-speedometer2'], ['kelas', 'Kelas Saya', 'bi-collection'], ['materi', 'Materi', 'bi-journal-richtext'], ['tugas', 'Tugas', 'bi-clipboard-check'], ['ujian', 'Ujian', 'bi-patch-question'], ['nilai', 'Nilai', 'bi-bar-chart-line'], ['jadwal', 'Jadwal Pelajaran', 'bi-calendar-week'], ['profil', 'Profil', 'bi-person-circle']]
};
const COMMON = [['notifikasi', 'Notifikasi', 'bi-bell'], ['pengumuman', 'Pengumuman', 'bi-megaphone'], ['pengaturan', 'Pengaturan', 'bi-gear']];
const unreadCount = () => NOTIFS[state.role].filter(n => !NREAD.has(n.id)).length;

function renderSidebar() {
  const u = state.user, item = ([k, l, i]) => `<div class="nav-x ${state.page === k ? 'active' : ''}" data-act="go" data-page="${k}"><i class="bi ${i}"></i><span>${l}</span>${k === 'notifikasi' && unreadCount() ? `<span class="dot">${unreadCount()}</span>` : ''}</div>`;
  $('#sidebar').innerHTML = `
    <div class="brand"><i class="bi bi-mortarboard-fill"></i><div>EduSmart<small>SMA NUSANTARA CERDAS</small></div></div>
    <div class="nav-label">Menu ${state.role === 'teacher' ? 'Guru' : 'Siswa'}</div>
    ${MENUS[state.role].map(item).join('')}
    <div class="nav-label">Umum</div>
    ${COMMON.map(item).join('')}
    <div class="side-user mt-4">${avatar(u.name, 40)}<div class="flex-grow-1" style="min-width:0"><div class="nm text-truncate">${esc(u.name)}</div><div class="rl">${state.role === 'teacher' ? 'Guru Matematika' : 'Siswa ' + u.className}</div></div>
    <button class="icon-btn" style="width:36px;height:36px" data-act="logout" title="Keluar"><i class="bi bi-box-arrow-right"></i></button></div>`;
}

function renderTop() {
  const n = unreadCount(), list = NOTIFS[state.role];
  $('#topRight').innerHTML = `
    <button class="icon-btn" data-act="theme" title="Ganti tema"><i class="bi ${settings.theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}"></i></button>
    <div class="dropdown">
      <button class="icon-btn" data-bs-toggle="dropdown" data-bs-auto-close="outside"><i class="bi bi-bell-fill"></i>${n ? `<span class="bell-badge">${n}</span>` : ''}</button>
      <div class="dropdown-menu dropdown-menu-end notif">
        <div class="d-flex justify-content-between align-items-center px-2 py-1"><b>Notifikasi</b><a href="#" class="small text-decoration-none" data-act="readAll">Tandai semua dibaca</a></div>
        ${list.slice(0, 5).map(notifItem).join('')}
        <div class="text-center pt-2"><a href="#" class="small fw-semibold text-decoration-none" data-act="go" data-page="notifikasi">Lihat semua</a></div>
      </div>
    </div>
    <div class="d-none d-md-flex align-items-center gap-2 ps-2">${avatar(state.user.name, 38)}<div class="lh-sm"><div class="fw-bold small">${esc(state.user.call)}</div><div class="text-muted" style="font-size:.7rem">${state.role === 'teacher' ? 'Guru' : 'Siswa'}</div></div></div>`;
}
const notifItem = n => `<div class="notif-item ${NREAD.has(n.id) ? '' : 'unread'}" data-act="notif" data-id="${n.id}" data-page="${n.page}"><div class="icon-bubble" style="--c:${n.c};width:38px;height:38px;font-size:1rem;border-radius:11px"><i class="bi ${n.icon}"></i></div><div><div class="t">${n.text}</div><small>${n.time}</small></div></div>`;

/* ---------------------------- Router ------------------------------- */
function go(page) {
  state.page = page;
  killCharts();
  const root = $('#content');
  root.classList.remove('page-enter'); void root.offsetWidth; root.classList.add('page-enter');
  const fn = (PAGES[state.role] && PAGES[state.role][page]) || PAGES.common[page] || PAGES[state.role].dashboard;
  fn(root);
  post(root);
  renderSidebar();
  $('#sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: settings.anim ? 'smooth' : 'auto' });
}

/* ---------------------------- Pages: GURU -------------------------- */
const PAGES = { teacher: {}, student: {}, common: {} };
const MY = 'mtk';

PAGES.teacher.dashboard = root => {
  const u = state.user, day = todayName();
  const sched = day ? Object.entries(TEACHER_SCHEDULE[day]).sort((a, b) => a[0] - b[0]) : [];
  const mine = TASKS.filter(t => t.subject === MY);
  const toGrade = mine.filter(t => t.kind === 'Tugas').reduce((a, t) => a + t.submitted, 0);
  const avgAll = avgOf(STUDENTS.map(s => finalOf(s.id, MY)));
  const grading = mine.filter(t => t.kind === 'Tugas' && t.submitted > 0).slice(0, 3);
  root.innerHTML = `
    <div class="hero-card reveal"><span class="chip"><i class="bi bi-calendar3"></i> ${longDate()}</span>
      <h2>Selamat ${greet()}, ${esc(u.call)}! 👋</h2>
      <p>${day ? `Hari ini Anda mengajar <b>${sched.length} kelas</b>` : 'Hari ini libur mengajar'} dan ada <b>${toGrade} pengumpulan tugas</b> menunggu penilaian.</p>
      <button class="btn btn-white px-4 py-2" data-act="go" data-page="penilaian">Mulai menilai <i class="bi bi-arrow-right"></i></button>
      <i class="bi bi-mortarboard-fill hero-ico"></i></div>
    <div class="row g-3 mb-3">
      ${stat('bi-people-fill', 'Kelas diampu', CLASSES.length, '#6366f1')}
      ${stat('bi-person-lines-fill', 'Total siswa', STUDENTS.length, '#ec4899')}
      ${stat('bi-inbox-fill', 'Perlu dinilai', toGrade, '#f59e0b')}
      ${stat('bi-graph-up-arrow', 'Rata-rata nilai', avgAll, '#10b981')}
    </div>
    <div class="row g-3 mb-3">
      <div class="col-lg-8 reveal"><div class="card-x h-100"><div class="card-title-x">Rata-rata Nilai per Kelas <span class="badge-soft primary">Matematika</span></div><div style="height:260px"><canvas id="chClass"></canvas></div></div></div>
      <div class="col-lg-4 reveal"><div class="card-x h-100"><div class="card-title-x">Status Pengumpulan</div><div style="height:260px"><canvas id="chSub"></canvas></div></div></div>
    </div>
    <div class="row g-3">
      <div class="col-lg-4 reveal"><div class="card-x h-100"><div class="card-title-x">Jadwal Hari Ini</div>
        ${sched.length ? sched.map(([i, c]) => `<div class="timeline-item" style="--c:${palette[i % palette.length]}"><div class="tm">${TIMES[i]}</div><div><div class="fw-bold">${clsName(c)}</div><small class="text-muted">${CLASSES.find(x => x.id === c).room}</small></div></div>`).join('') : empty('Tidak ada jadwal hari ini', 'bi-cup-hot')}</div></div>
      <div class="col-lg-4 reveal"><div class="card-x h-100"><div class="card-title-x">Perlu Dinilai</div>
        ${grading.map(t => `<div class="mb-3"><div class="d-flex justify-content-between"><span class="fw-semibold small">${esc(t.title)}</span><span class="small text-muted">${t.submitted}/${t.total}</span></div><div class="small text-muted mb-1">${clsName(t.classId)}</div>${bar(Math.round(t.submitted / t.total * 100))}</div>`).join('')}</div></div>
      <div class="col-lg-4 reveal"><div class="card-x h-100"><div class="card-title-x">Pengumuman Terbaru <a href="#" class="small text-decoration-none" data-act="go" data-page="pengumuman">Semua</a></div>
        ${ANNOUNCEMENTS.slice(0, 3).map(a => `<div class="mb-3"><span class="badge-soft ${a.cat === 'Akademik' ? 'primary' : a.cat === 'Sistem' ? 'warning' : 'info'}">${a.cat}</span><div class="fw-semibold mt-1">${esc(a.title)}</div><small class="text-muted">${a.author}</small></div>`).join('')}</div></div>
    </div>`;
  chart('chClass', { type: 'bar', data: { labels: CLASSES.map(c => c.name), datasets: [{ data: CLASSES.map(c => avgOf(studentsOf(c.id).map(s => finalOf(s.id, MY)))), backgroundColor: [accent(), accent2(), '#ec4899'], borderRadius: 12, maxBarThickness: 70 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { min: 50, max: 100 } } } });
  const sub = mine.filter(t => t.kind === 'Tugas').reduce((a, t) => a + t.submitted, 0), tot = mine.filter(t => t.kind === 'Tugas').reduce((a, t) => a + t.total, 0);
  chart('chSub', { type: 'doughnut', data: { labels: ['Terkumpul', 'Belum'], datasets: [{ data: [sub, tot - sub], backgroundColor: ['#10b981', '#e7e9f3'], borderWidth: 0 }] }, options: { cutout: '70%', plugins: { legend: { position: 'bottom' } } } });
};

PAGES.teacher.kelas = root => {
  root.innerHTML = head('Kelas Saya', 'Daftar kelas Matematika yang Anda ampu.') + `<div class="row g-3">${CLASSES.map((c, i) => {
    const st = studentsOf(c.id), avg = avgOf(st.map(s => finalOf(s.id, MY))), mats = MATERIALS.filter(m => m.classId === c.id && m.subject === MY).length;
    const col = palette[i * 2];
    return `<div class="col-md-6 col-xl-4 reveal"><div class="card-x subj-card hover-lift h-100" style="--c:${col}">
      <i class="bi bi-people-fill big-ico"></i>
      <div class="d-flex justify-content-between align-items-start"><div><h4 class="fw-bold mb-0">${c.name}</h4><div class="text-muted small"><i class="bi bi-geo-alt"></i> ${c.room}</div></div><span class="badge-soft ${gradeTone(avg)}">Rata-rata ${avg}</span></div>
      <div class="row text-center my-3 g-2"><div class="col-4"><b class="fs-5">${st.length}</b><div class="small text-muted">Siswa</div></div><div class="col-4"><b class="fs-5">${mats}</b><div class="small text-muted">Materi</div></div><div class="col-4"><b class="fs-5">${TASKS.filter(t => t.classId === c.id && t.subject === MY).length}</b><div class="small text-muted">Tugas</div></div></div>
      <div class="small text-muted mb-1">Kehadiran rata-rata</div>${bar(Math.round(avgOf(st.map(s => s.attend))), col)}
      <div class="d-flex gap-2 mt-3"><button class="btn btn-accent btn-sm flex-grow-1" data-act="viewClass" data-id="${c.id}"><i class="bi bi-people"></i> Lihat Siswa</button><button class="btn btn-light-x btn-sm" data-act="goMateri" data-id="${c.id}"><i class="bi bi-journal-richtext"></i></button></div>
    </div></div>`;
  }).join('')}</div>`;
};

PAGES.teacher.materi = root => {
  let cls = ui.materiClass || 'all', q = '';
  root.innerHTML = head('Materi Pembelajaran', 'Kelola materi Matematika untuk setiap kelas.', `<button class="btn btn-accent px-3" data-act="uploadMateri"><i class="bi bi-cloud-arrow-up"></i> Unggah Materi</button>`) +
    `<div class="d-flex gap-2 mb-3 flex-wrap reveal"><select id="fClass" class="form-select" style="width:190px"><option value="all">Semua kelas</option>${CLASSES.map(c => `<option value="${c.id}" ${cls === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select><input id="fQ" class="form-control" style="width:260px" placeholder="Cari materi…"></div><div class="row g-3" id="matList"></div>`;
  const draw = () => {
    const list = MATERIALS.filter(m => m.subject === MY && (cls === 'all' || m.classId === cls) && m.title.toLowerCase().includes(q));
    $('#matList').innerHTML = list.length ? list.map(m => matCard(m, 'teacher')).join('') : `<div class="col-12">${empty('Belum ada materi yang cocok', 'bi-journal-x')}</div>`;
    post($('#matList'));
  };
  ui.drawMateri = draw;
  $('#fClass').onchange = e => { cls = ui.materiClass = e.target.value; draw(); };
  $('#fQ').oninput = e => { q = e.target.value.toLowerCase(); draw(); };
  draw();
};

PAGES.teacher.tugas = root => {
  let tab = ui.tugasTab || 'Semua';
  root.innerHTML = head('Tugas & Ujian', 'Buat dan pantau pengumpulan tugas serta ujian.', `<button class="btn btn-accent px-3" data-act="newTask"><i class="bi bi-plus-lg"></i> Buat Baru</button>`) +
    `<div class="nav-tabs-x mb-3 reveal" id="tTabs">${['Semua', 'Tugas', 'Ujian'].map(t => `<button class="${t === tab ? 'active' : ''}" data-t="${t}">${t}</button>`).join('')}</div><div id="taskList"></div>`;
  const draw = () => {
    const list = TASKS.filter(t => t.subject === MY && (tab === 'Semua' || t.kind === tab)).sort((a, b) => a.due.localeCompare(b.due));
    $('#taskList').innerHTML = list.length ? list.map(t => {
      const d = dueInfo(t.due), pct = t.total ? Math.round(t.submitted / t.total * 100) : 0;
      return `<div class="list-row reveal"><div class="icon-bubble" style="--c:${t.kind === 'Ujian' ? '#ef4444' : '#6366f1'}"><i class="bi ${t.kind === 'Ujian' ? 'bi-patch-question-fill' : 'bi-clipboard-check-fill'}"></i></div>
        <div class="flex-grow-1"><div class="fw-bold">${esc(t.title)}</div><div class="small text-muted">${t.kind} · ${clsName(t.classId)} · Tenggat ${fmtDate(t.due)}${t.duration ? ' · ' + t.duration + ' menit' : ''}</div>
        <div class="d-flex align-items-center gap-2 mt-2"><div style="width:160px">${bar(pct)}</div><small class="text-muted">${t.submitted}/${t.total} terkumpul</small></div></div>
        <span class="badge-soft ${d.c} d-none d-md-inline-block">${d.t}</span>
        <button class="btn btn-light-x btn-sm" data-act="go" data-page="penilaian" title="Nilai"><i class="bi bi-award"></i></button>
        <button class="btn btn-light-x btn-sm" data-act="delTask" data-id="${t.id}" title="Hapus"><i class="bi bi-trash"></i></button></div>`;
    }).join('') : empty('Belum ada data', 'bi-clipboard-x');
    post($('#taskList'));
  };
  ui.drawTasks = draw;
  $('#tTabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; tab = ui.tugasTab = b.dataset.t; $$('#tTabs button').forEach(x => x.classList.toggle('active', x === b)); draw(); };
  draw();
};

PAGES.teacher.penilaian = root => {
  let cid = ui.nilaiClass || 'c1';
  root.innerHTML = head('Penilaian', 'Input nilai Tugas (30%), UTS (30%), dan UAS (40%). Nilai akhir dihitung otomatis.',
    `<button class="btn btn-light-x" data-act="exportCSV"><i class="bi bi-download"></i> Ekspor CSV</button><button class="btn btn-accent px-3" data-act="saveScores"><i class="bi bi-check2-circle"></i> Simpan</button>`) +
    `<div class="card-x reveal"><div class="d-flex gap-2 mb-3 align-items-center flex-wrap"><label class="fw-semibold">Kelas</label><select id="nClass" class="form-select" style="width:190px">${CLASSES.map(c => `<option value="${c.id}" ${c.id === cid ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
    <div class="table-responsive"><table class="table-x"><thead><tr><th>#</th><th>Siswa</th><th>NIS</th><th>Tugas</th><th>UTS</th><th>UAS</th><th>Akhir</th></tr></thead><tbody id="nBody"></tbody><tfoot><tr><td colspan="6" class="text-end">Rata-rata kelas</td><td id="clsAvg"></td></tr></tfoot></table></div></div>`;
  const rowFinal = sid => finalOf(sid, MY);
  const upd = () => { $('#clsAvg').innerHTML = `<span class="badge-soft ${gradeTone(avgOf(studentsOf(cid).map(s => rowFinal(s.id))))}">${avgOf(studentsOf(cid).map(s => rowFinal(s.id)))}</span>`; };
  const draw = () => {
    $('#nBody').innerHTML = studentsOf(cid).map((s, i) => {
      const sc = getScores(s.id, MY), f = rowFinal(s.id);
      return `<tr data-sid="${s.id}"><td>${i + 1}</td><td><div class="d-flex align-items-center gap-2">${avatar(s.name, 34)}<span class="fw-semibold">${s.name}</span></div></td><td class="text-muted">${s.nis}</td>
        ${['tugas', 'uts', 'uas'].map(k => `<td><input type="number" min="0" max="100" class="form-control score-in" data-k="${k}" value="${sc[k]}"></td>`).join('')}
        <td class="fin"><span class="badge-soft ${gradeTone(f)}">${f} (${predikat(f)})</span></td></tr>`;
    }).join('');
    upd();
  };
  $('#nClass').onchange = e => { cid = ui.nilaiClass = e.target.value; draw(); };
  $('#nBody').oninput = e => {
    const inp = e.target.closest('.score-in'); if (!inp) return;
    let v = Math.max(0, Math.min(100, parseInt(inp.value) || 0)); if (inp.value !== '' && +inp.value !== v) inp.value = v;
    const tr = inp.closest('tr'), sid = tr.dataset.sid;
    getScores(sid, MY)[inp.dataset.k] = v;
    const f = rowFinal(sid);
    tr.querySelector('.fin').innerHTML = `<span class="badge-soft ${gradeTone(f)}">${f} (${predikat(f)})</span>`;
    upd();
  };
  draw();
};

PAGES.teacher.jadwal = root => {
  const today = todayName(), total = DAYS.reduce((a, d) => a + Object.keys(TEACHER_SCHEDULE[d]).length, 0);
  root.innerHTML = head('Jadwal Mengajar', `Total ${total} sesi (${total * 1.5} jam) per minggu.`) +
    `<div class="card-x reveal"><div class="table-responsive"><table class="table-x sch-grid"><thead><tr><th>Jam</th>${DAYS.map(d => `<th class="${d === today ? 'today' : ''}">${d}${d === today ? ' <span class="badge-soft primary">Hari ini</span>' : ''}</th>`).join('')}</tr></thead><tbody>
    ${TIMES.map((t, i) => `<tr><td class="fw-bold text-muted text-nowrap">${t}</td>${DAYS.map(d => { const c = TEACHER_SCHEDULE[d][i]; return `<td class="${d === today ? 'today' : ''}">${c ? `<div class="slot" style="--c:${palette[CLASSES.findIndex(x => x.id === c) * 2]};animation-delay:${i * 80}ms">${clsName(c)}<small>${CLASSES.find(x => x.id === c).room}</small></div>` : '<span class="text-muted">-</span>'}</td>`; }).join('')}</tr>`).join('')}
    </tbody></table></div></div>`;
};

/* ---------------------------- Pages: SISWA ------------------------- */
const myTasks = () => TASKS.filter(t => t.classId === 'c1');
const myRank = () => {
  const arr = studentsOf('c1').map(s => ({ id: s.id, avg: avgOf(SUBJECTS.map(x => finalOf(s.id, x.id))) })).sort((a, b) => b.avg - a.avg);
  return arr.findIndex(x => x.id === 's1') + 1;
};

PAGES.student.dashboard = root => {
  const u = state.user, day = todayName(), mats = MATERIALS.filter(m => m.classId === 'c1');
  const pend = myTasks().filter(t => t.kind === 'Tugas' && !SUBS[t.id]).sort((a, b) => a.due.localeCompare(b.due));
  const upExams = myTasks().filter(t => t.kind === 'Ujian' && !EXAMS[t.id]);
  const avg = avgOf(SUBJECTS.map(s => finalOf('s1', s.id)));
  const prog = Math.round(mats.filter(m => READ.has(m.id)).length / mats.length * 100);
  const sched = day ? STUDENT_SCHEDULE[day].map((s, i) => s ? { i, s: subj(s) } : null).filter(Boolean) : [];
  root.innerHTML = `
    <div class="hero-card reveal"><span class="chip"><i class="bi bi-calendar3"></i> ${longDate()}</span>
      <h2>Halo, ${esc(u.call)}! Semangat belajar ${greet()} ini 🚀</h2>
      <p>Kamu punya <b>${pend.length} tugas</b> yang belum dikumpulkan dan <b>${upExams.length} ujian</b> mendatang. Yuk selesaikan satu per satu!</p>
      <button class="btn btn-white px-4 py-2" data-act="go" data-page="tugas">Lihat tugas <i class="bi bi-arrow-right"></i></button><i class="bi bi-rocket-takeoff-fill hero-ico"></i></div>
    <div class="row g-3 mb-3">
      ${stat('bi-trophy-fill', 'Rata-rata nilai', avg, '#10b981')}
      ${stat('bi-clipboard-check-fill', 'Tugas belum selesai', pend.length, '#f59e0b')}
      ${stat('bi-patch-question-fill', 'Ujian mendatang', upExams.length, '#ef4444')}
      ${stat('bi-calendar-check-fill', 'Kehadiran', studentsOf('c1')[0].attend, '#6366f1', '%')}
    </div>
    <div class="row g-3 mb-3">
      <div class="col-lg-5 reveal"><div class="card-x h-100"><div class="card-title-x">Profil Kemampuan</div><div style="height:290px"><canvas id="chRadar"></canvas></div></div></div>
      <div class="col-lg-3 reveal"><div class="card-x h-100 text-center"><div class="card-title-x">Progres Materi</div><div class="ring my-3" data-p="${prog}"><span>${prog}%</span></div><p class="text-muted small mb-0">${mats.filter(m => READ.has(m.id)).length} dari ${mats.length} materi sudah kamu baca</p><button class="btn btn-accent btn-sm mt-3" data-act="go" data-page="materi">Lanjut belajar</button></div></div>
      <div class="col-lg-4 reveal"><div class="card-x h-100"><div class="card-title-x">Jadwal Hari Ini</div>
        ${sched.length ? sched.map(x => `<div class="timeline-item" style="--c:${x.s.color}"><div class="tm">${TIMES[x.i]}</div><div><div class="fw-bold">${x.s.name}</div><small class="text-muted">${x.s.teacher.split(',')[0]}</small></div></div>`).join('') : empty('Tidak ada pelajaran hari ini', 'bi-cup-hot')}</div></div>
    </div>
    <div class="row g-3">
      <div class="col-lg-7 reveal"><div class="card-x h-100"><div class="card-title-x">Tenggat Terdekat <a href="#" class="small text-decoration-none" data-act="go" data-page="tugas">Semua</a></div>
        ${pend.slice(0, 4).map(t => { const d = dueInfo(t.due), s = subj(t.subject); return `<div class="list-row"><div class="icon-bubble" style="--c:${s.color}"><i class="bi ${s.icon}"></i></div><div class="flex-grow-1"><div class="fw-bold">${esc(t.title)}</div><small class="text-muted">${s.name} · ${fmtDate(t.due)}</small></div><span class="badge-soft ${d.c}">${d.t}</span></div>`; }).join('') || empty('Semua tugas sudah dikumpulkan 🎉', 'bi-emoji-smile')}</div></div>
      <div class="col-lg-5 reveal"><div class="card-x h-100"><div class="card-title-x">Pengumuman <a href="#" class="small text-decoration-none" data-act="go" data-page="pengumuman">Semua</a></div>
        ${ANNOUNCEMENTS.slice(0, 3).map(a => `<div class="mb-3"><span class="badge-soft ${a.cat === 'Akademik' ? 'primary' : a.cat === 'Sistem' ? 'warning' : 'info'}">${a.cat}</span><div class="fw-semibold mt-1">${esc(a.title)}</div><small class="text-muted">${a.author}</small></div>`).join('')}</div></div>
    </div>`;
  chart('chRadar', { type: 'radar', data: { labels: SUBJECTS.map(s => s.name), datasets: [{ label: 'Nilai', data: SUBJECTS.map(s => finalOf('s1', s.id)), backgroundColor: accent() + '33', borderColor: accent(), pointBackgroundColor: accent2(), borderWidth: 2 }] }, options: { plugins: { legend: { display: false } }, scales: { r: { min: 50, max: 100, ticks: { display: false }, pointLabels: { font: { size: 10 } } } } } });
};

PAGES.student.kelas = root => {
  root.innerHTML = head('Kelas Saya', `Mata pelajaran ${state.user.className} semester ini.`) + `<div class="row g-3">${SUBJECTS.map(s => {
    const mats = MATERIALS.filter(m => m.classId === 'c1' && m.subject === s.id), done = mats.filter(m => READ.has(m.id)).length, pct = mats.length ? Math.round(done / mats.length * 100) : 0, f = finalOf('s1', s.id);
    return `<div class="col-md-6 col-xl-3 reveal"><div class="card-x subj-card hover-lift h-100" style="--c:${s.color}"><i class="bi ${s.icon} big-ico"></i>
      <div class="icon-bubble mb-3" style="--c:${s.color}"><i class="bi ${s.icon}"></i></div>
      <h5 class="fw-bold mb-0">${s.name}</h5><div class="small text-muted mb-3">${s.teacher}</div>
      <div class="d-flex justify-content-between small mb-1"><span class="text-muted">Progres materi</span><b>${pct}%</b></div>${bar(pct, s.color)}
      <div class="d-flex justify-content-between align-items-center mt-3"><span class="badge-soft ${gradeTone(f)}">Nilai ${f}</span><button class="btn btn-sm btn-accent" data-act="goSubj" data-id="${s.id}">Buka</button></div></div></div>`;
  }).join('')}</div>`;
};

PAGES.student.materi = root => {
  let sub = ui.materiSubject || 'all', q = '';
  const avail = SUBJECTS.filter(s => MATERIALS.some(m => m.classId === 'c1' && m.subject === s.id));
  root.innerHTML = head('Materi', 'Baca, tonton, dan pelajari materi dari guru-gurumu.') +
    `<div class="d-flex flex-wrap gap-2 mb-3 reveal" id="chips"><button class="chip-filter ${sub === 'all' ? 'active' : ''}" data-s="all">Semua</button>${avail.map(s => `<button class="chip-filter ${sub === s.id ? 'active' : ''}" data-s="${s.id}">${s.name}</button>`).join('')}</div>
    <input id="fQ" class="form-control mb-3 reveal" style="max-width:320px" placeholder="Cari materi…"><div class="row g-3" id="matList"></div>`;
  const draw = () => {
    const list = MATERIALS.filter(m => m.classId === 'c1' && (sub === 'all' || m.subject === sub) && m.title.toLowerCase().includes(q));
    $('#matList').innerHTML = list.length ? list.map(m => matCard(m, 'student')).join('') : `<div class="col-12">${empty('Materi tidak ditemukan', 'bi-journal-x')}</div>`;
    post($('#matList'));
  };
  ui.drawMateri = draw;
  $('#chips').onclick = e => { const b = e.target.closest('button'); if (!b) return; sub = ui.materiSubject = b.dataset.s; $$('#chips button').forEach(x => x.classList.toggle('active', x === b)); draw(); };
  $('#fQ').oninput = e => { q = e.target.value.toLowerCase(); draw(); };
  draw();
};

PAGES.student.tugas = root => {
  let tab = ui.sTab || 'Belum';
  root.innerHTML = head('Tugas', 'Kumpulkan tugas sebelum tenggat ya!') +
    `<div class="nav-tabs-x mb-3 reveal" id="sTabs">${['Belum', 'Selesai', 'Semua'].map(t => `<button class="${t === tab ? 'active' : ''}" data-t="${t}">${t === 'Belum' ? 'Belum dikerjakan' : t === 'Selesai' ? 'Sudah dikumpulkan' : 'Semua'}</button>`).join('')}</div><div id="taskList"></div>`;
  const draw = () => {
    const list = myTasks().filter(t => t.kind === 'Tugas' && (tab === 'Semua' || (tab === 'Selesai') === !!SUBS[t.id])).sort((a, b) => a.due.localeCompare(b.due));
    $('#taskList').innerHTML = list.length ? list.map(t => {
      const s = subj(t.subject), sb = SUBS[t.id], d = dueInfo(t.due);
      return `<div class="list-row reveal"><div class="icon-bubble" style="--c:${s.color}"><i class="bi ${s.icon}"></i></div>
        <div class="flex-grow-1"><div class="fw-bold">${esc(t.title)}</div><div class="small text-muted">${s.name} · Tenggat ${fmtDate(t.due)}</div></div>
        ${sb ? `<div class="text-end"><span class="badge-soft success"><i class="bi bi-check2"></i> Dikumpulkan</span><div class="small text-muted mt-1">${sb.score != null ? 'Nilai: <b>' + sb.score + '</b>' : 'Menunggu penilaian'}</div></div>`
          : `<span class="badge-soft ${d.c} d-none d-md-inline-block">${d.t}</span><button class="btn btn-accent btn-sm px-3" data-act="submitTask" data-id="${t.id}"><i class="bi bi-upload"></i> Kumpulkan</button>`}</div>`;
    }).join('') : empty('Tidak ada tugas di kategori ini 🎉', 'bi-emoji-smile');
    post($('#taskList'));
  };
  ui.drawTasks = draw;
  $('#sTabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; tab = ui.sTab = b.dataset.t; $$('#sTabs button').forEach(x => x.classList.toggle('active', x === b)); draw(); };
  draw();
};

PAGES.student.ujian = root => {
  const list = myTasks().filter(t => t.kind === 'Ujian').sort((a, b) => a.due.localeCompare(b.due));
  root.innerHTML = head('Ujian', 'Daftar ujian dan kuis. Klik "Mulai Ujian" untuk mencoba simulasi (3 soal).') + `<div class="row g-3">${list.map(t => {
    const s = subj(t.subject), r = EXAMS[t.id], d = dueInfo(t.due);
    return `<div class="col-md-6 col-xl-4 reveal"><div class="card-x subj-card hover-lift h-100" style="--c:${s.color}"><i class="bi ${s.icon} big-ico"></i>
      <div class="d-flex justify-content-between"><span class="badge-soft" style="--c:${s.color}">${s.name}</span>${r ? '<span class="badge-soft success">Selesai</span>' : `<span class="badge-soft ${d.c}">${d.t}</span>`}</div>
      <h5 class="fw-bold mt-3">${esc(t.title)}</h5>
      <div class="small text-muted mb-3"><i class="bi bi-calendar3"></i> ${fmtDate(t.due)} &nbsp; <i class="bi bi-clock"></i> ${t.duration} menit</div>
      ${r ? `<div class="d-flex justify-content-between align-items-center"><span class="text-muted small">Skor kamu</span><span class="fs-3 fw-bold" style="color:${s.color}">${r.score}</span></div>` : `<button class="btn btn-accent w-100" data-act="startExam" data-id="${t.id}"><i class="bi bi-play-fill"></i> Mulai Ujian</button>`}</div></div>`;
  }).join('')}</div>`;
};

PAGES.student.nilai = root => {
  const rows = SUBJECTS.map(s => ({ s, ...getScores('s1', s.id), f: finalOf('s1', s.id) }));
  const avg = avgOf(rows.map(r => r.f)), rank = myRank();
  root.innerHTML = head('Nilai', 'Rekap nilai semester ganjil. Nilai akhir = Tugas 30% + UTS 30% + UAS 40%.') + `
    <div class="row g-3 mb-3">${stat('bi-bar-chart-fill', 'Rata-rata', avg, '#6366f1')}${stat('bi-trophy-fill', 'Peringkat kelas', rank, '#f59e0b')}${stat('bi-star-fill', 'Nilai tertinggi', Math.max(...rows.map(r => r.f)), '#10b981')}${stat('bi-people-fill', 'Jumlah siswa', studentsOf('c1').length, '#ec4899')}</div>
    <div class="row g-3"><div class="col-lg-7 reveal"><div class="card-x"><div class="table-responsive"><table class="table-x"><thead><tr><th>Mata pelajaran</th><th>Tugas</th><th>UTS</th><th>UAS</th><th>Akhir</th><th>Pred.</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td><div class="d-flex align-items-center gap-2"><div class="icon-bubble" style="--c:${r.s.color};width:34px;height:34px;font-size:1rem;border-radius:10px"><i class="bi ${r.s.icon}"></i></div><b>${r.s.name}</b></div></td><td>${r.tugas}</td><td>${r.uts}</td><td>${r.uas}</td><td><b>${r.f}</b></td><td><span class="badge-soft ${gradeTone(r.f)}">${predikat(r.f)}</span></td></tr>`).join('')}</tbody></table></div></div></div>
      <div class="col-lg-5 reveal"><div class="card-x h-100"><div class="card-title-x">Grafik Nilai Akhir</div><div style="height:340px"><canvas id="chNilai"></canvas></div></div></div></div>`;
  chart('chNilai', { type: 'bar', data: { labels: rows.map(r => r.s.name), datasets: [{ data: rows.map(r => r.f), backgroundColor: rows.map(r => r.s.color), borderRadius: 8 }] }, options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { min: 50, max: 100 } } } });
};

PAGES.student.jadwal = root => {
  let day = ui.sDay || todayName() || 'Senin';
  root.innerHTML = head('Jadwal Pelajaran', `Jadwal ${state.user.className} semester ganjil.`) +
    `<div class="nav-tabs-x mb-3 reveal" id="dTabs">${DAYS.map(d => `<button class="${d === day ? 'active' : ''}" data-d="${d}">${d}${d === todayName() ? ' •' : ''}</button>`).join('')}</div><div id="schList"></div>`;
  const draw = () => {
    $('#schList').innerHTML = STUDENT_SCHEDULE[day].map((id, i) => id ? (s => `<div class="timeline-item reveal" style="--c:${s.color}"><div class="tm">${TIMES[i]}</div><div class="icon-bubble" style="--c:${s.color};width:42px;height:42px"><i class="bi ${s.icon}"></i></div><div class="flex-grow-1"><div class="fw-bold">${s.name}</div><small class="text-muted">${s.teacher} · ${s.room}</small></div></div>`)(subj(id)) : '').join('');
    post($('#schList'));
  };
  $('#dTabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; day = ui.sDay = b.dataset.d; $$('#dTabs button').forEach(x => x.classList.toggle('active', x === b)); draw(); };
  draw();
};

/* ---------------------------- Pages: UMUM -------------------------- */
function profilePage(root) {
  const u = state.user, isT = state.role === 'teacher';
  const stats = isT ? [[CLASSES.length, 'Kelas'], [STUDENTS.length, 'Siswa'], [14, 'Thn mengajar']] : [[avgOf(SUBJECTS.map(s => finalOf('s1', s.id))), 'Rata-rata'], [myRank(), 'Peringkat'], [studentsOf('c1')[0].attend + '%', 'Kehadiran']];
  root.innerHTML = `<div class="profile-banner reveal"></div><div class="row g-3">
    <div class="col-lg-4 reveal"><div class="card-x text-center profile-card">${avatar(u.name, 110)}<h4 class="fw-bold mt-3 mb-1">${esc(u.name)}</h4><p class="text-muted mb-2">${isT ? 'Guru Matematika' : 'Siswa ' + u.className}</p><span class="badge-soft primary">${isT ? 'NIP ' + u.id : 'NIS ' + u.id}</span>
      <div class="mini-stats">${stats.map(s => `<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div></div></div>
    <div class="col-lg-8 reveal"><div class="card-x"><h5 class="fw-bold mb-3">Informasi Pribadi</h5><form id="profForm" class="row g-3">
      <div class="col-md-6"><label class="form-label small fw-semibold">Nama lengkap</label><input class="form-control" name="name" value="${esc(u.name)}" required></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">${isT ? 'NIP' : 'NIS'}</label><input class="form-control" value="${u.id}" disabled></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">Email</label><input type="email" class="form-control" name="email" value="${esc(u.email)}"></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">No. HP</label><input class="form-control" name="phone" value="${esc(u.phone)}"></div>
      <div class="col-12"><label class="form-label small fw-semibold">Alamat</label><textarea class="form-control" name="addr" rows="2">${esc(u.addr)}</textarea></div>
      <div class="col-12 text-end"><button class="btn btn-accent px-4" type="submit"><i class="bi bi-check2"></i> Simpan perubahan</button></div></form></div></div></div>`;
  $('#profForm').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (!f.get('name').trim()) { toast('Nama tidak boleh kosong', 'danger'); return; }
    Object.assign(u, { name: f.get('name').trim(), email: f.get('email'), phone: f.get('phone'), addr: f.get('addr') });
    u.call = isT ? u.call : u.name.split(' ')[0];
    renderSidebar(); renderTop(); toast('Profil berhasil diperbarui');
  };
}
PAGES.teacher.profil = profilePage;
PAGES.student.profil = profilePage;

PAGES.common.notifikasi = root => {
  const list = NOTIFS[state.role];
  root.innerHTML = head('Notifikasi', `${unreadCount()} belum dibaca`, `<button class="btn btn-light-x" data-act="readAll"><i class="bi bi-check2-all"></i> Tandai semua dibaca</button>`) + `<div style="max-width:760px">${list.map(n => `<div class="reveal">${notifItem(n).replace('notif-item', 'notif-item big')}</div>`).join('')}</div>`;
};

PAGES.common.pengumuman = root => {
  let cat = 'Semua';
  const isT = state.role === 'teacher';
  root.innerHTML = head('Pengumuman', 'Informasi terbaru dari sekolah.', isT ? `<button class="btn btn-accent px-3" data-act="newAnn"><i class="bi bi-plus-lg"></i> Buat Pengumuman</button>` : '') +
    `<div class="d-flex gap-2 mb-3 flex-wrap reveal" id="aChips">${['Semua', 'Akademik', 'Kegiatan', 'Sistem'].map(c => `<button class="chip-filter ${c === cat ? 'active' : ''}" data-c="${c}">${c}</button>`).join('')}</div><div id="annList" style="max-width:860px"></div>`;
  const draw = () => {
    const list = ANNOUNCEMENTS.filter(a => cat === 'Semua' || a.cat === cat).sort((a, b) => (b.pinned - a.pinned) || (a.ago - b.ago));
    $('#annList').innerHTML = list.map(a => `<div class="card-x mb-3 reveal"><div class="d-flex justify-content-between flex-wrap gap-2"><div class="d-flex gap-2 align-items-center"><span class="badge-soft ${a.cat === 'Akademik' ? 'primary' : a.cat === 'Sistem' ? 'warning' : 'info'}">${a.cat}</span>${a.pinned ? '<span class="badge-soft danger"><i class="bi bi-pin-angle-fill"></i> Disematkan</span>' : ''}</div><small class="text-muted">${a.ago === 0 ? 'Hari ini' : a.ago + ' hari lalu'} · ${esc(a.author)}</small></div><h5 class="fw-bold mt-2">${esc(a.title)}</h5><p class="mb-0 text-muted">${esc(a.body)}</p></div>`).join('') || empty('Belum ada pengumuman', 'bi-megaphone');
    post($('#annList'));
  };
  ui.drawAnn = draw;
  $('#aChips').onclick = e => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.c; $$('#aChips button').forEach(x => x.classList.toggle('active', x === b)); draw(); };
  draw();
};

PAGES.common.pengaturan = root => {
  root.innerHTML = head('Pengaturan', 'Sesuaikan tampilan dan preferensi akunmu.') + `<div class="row g-3"><div class="col-lg-7 reveal"><div class="card-x">
    <div class="set-row"><div><div class="fw-bold">Mode gelap</div><small class="text-muted">Nyaman untuk mata saat malam hari</small></div><div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" data-set="theme" ${settings.theme === 'dark' ? 'checked' : ''}></div></div>
    <div class="set-row"><div><div class="fw-bold">Warna aksen</div><small class="text-muted">Pilih warna utama aplikasi</small></div><div class="d-flex gap-2">${Object.entries(ACCENTS).map(([k, v]) => `<span class="swatch ${settings.accent === k ? 'active' : ''}" data-act="accent" data-k="${k}" style="background:linear-gradient(135deg,${v[0]},${v[1]})" title="${k}"></span>`).join('')}</div></div>
    <div class="set-row"><div><div class="fw-bold">Animasi</div><small class="text-muted">Matikan jika perangkat terasa berat</small></div><div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" data-set="anim" ${settings.anim ? 'checked' : ''}></div></div>
    <div class="set-row"><div><div class="fw-bold">Ukuran teks</div><small class="text-muted">Atur kenyamanan membaca</small></div><select class="form-select" style="width:140px" data-set="font"><option value="sm" ${settings.font === 'sm' ? 'selected' : ''}>Kecil</option><option value="md" ${settings.font === 'md' ? 'selected' : ''}>Sedang</option><option value="lg" ${settings.font === 'lg' ? 'selected' : ''}>Besar</option></select></div>
    <div class="set-row"><div><div class="fw-bold">Notifikasi email</div><small class="text-muted">Kirim ringkasan aktivitas ke email</small></div><div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" data-set="emailNotif" ${settings.emailNotif ? 'checked' : ''}></div></div></div></div>
    <div class="col-lg-5 reveal"><div class="card-x"><h5 class="fw-bold">Akun</h5><p class="text-muted small">Masuk sebagai <b>${esc(state.user.name)}</b> (${state.role === 'teacher' ? 'Guru' : 'Siswa'}).</p>
      <div class="d-grid gap-2"><button class="btn btn-light-x py-2" data-act="resetDemo"><i class="bi bi-arrow-counterclockwise"></i> Reset data demo</button><button class="btn btn-danger py-2" data-act="logout"><i class="bi bi-box-arrow-right"></i> Keluar</button></div></div></div></div>`;
};

/* ---------------------------- Quiz --------------------------------- */
const quiz = { task: null, qs: [], i: 0, ans: [], t: 0, timer: null, done: false };
function drawQuiz() {
  const q = quiz.qs[quiz.i], last = quiz.i === quiz.qs.length - 1;
  $('#modalBody').innerHTML = `<div class="d-flex justify-content-between align-items-center mb-3"><span class="badge-soft primary">Soal ${quiz.i + 1} dari ${quiz.qs.length}</span><span class="timer-pill" id="qTimer"><i class="bi bi-stopwatch"></i> ${timeStr(quiz.t)}</span></div>
    <div class="bar mb-4"><i style="width:${(quiz.i + 1) / quiz.qs.length * 100}%"></i></div>
    <h5 class="fw-bold mb-3">${q.q}</h5>${q.o.map((o, i) => `<button class="opt ${quiz.ans[quiz.i] === i ? 'sel' : ''}" data-act="pick" data-i="${i}"><b>${'ABCD'[i]}</b>${o}</button>`).join('')}`;
  $('#modalFooter').classList.remove('d-none');
  $('#modalFooter').innerHTML = `<button class="btn btn-accent px-4" data-act="quizNext" ${quiz.ans[quiz.i] === undefined ? 'disabled' : ''}>${last ? 'Selesai' : 'Lanjut'} <i class="bi bi-arrow-right"></i></button>`;
}
const timeStr = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
function finishQuiz() {
  clearInterval(quiz.timer);
  quiz.done = true;
  const ok = quiz.qs.filter((q, i) => quiz.ans[i] === q.a).length, score = Math.round(ok / quiz.qs.length * 100);
  EXAMS[quiz.task.id] = { score, date: isoOffset(0) }; store.set('exams', EXAMS);
  const s = subj(quiz.task.subject);
  $('#modalTitle').innerHTML = 'Hasil Ujian';
  $('#modalBody').innerHTML = `<div class="text-center py-3"><div class="ring" data-p="${score}"><span>${score}</span></div><h4 class="fw-bold mt-4">${score >= 80 ? 'Luar biasa! 🎉' : score >= 60 ? 'Bagus, terus berlatih! 💪' : 'Jangan menyerah, coba lagi! 📚'}</h4><p class="text-muted">${ok} dari ${quiz.qs.length} jawaban benar · ${s.name}</p></div>`;
  $('#modalFooter').innerHTML = `<button class="btn btn-accent px-4" data-bs-dismiss="modal">Tutup</button>`;
  post($('#modalBody'));
  if (score >= 80) confetti();
}

/* ---------------------------- Actions ------------------------------ */
const ACTIONS = {
  go: d => go(d.page),
  toggleSidebar: () => { $('#sidebar').classList.toggle('open'); },
  theme: () => { settings.theme = settings.theme === 'dark' ? 'light' : 'dark'; applySettings(); renderTop(); go(state.page); },
  accent: d => { settings.accent = d.k; applySettings(); go('pengaturan'); },
  logout: () => {
    store.del('session');
    $('#appView').classList.add('d-none');
    const lv = $('#loginView'); lv.classList.remove('d-none', 'leaving');
    setRole(state.role || 'student'); resetLoginBtn();
    state.role = null; killCharts();
  },
  resetDemo: () => { ['read', 'subs', 'exams', 'nread'].forEach(store.del); READ = new Set([1, 6, 8, 11]); EXAMS = {}; NREAD = new Set(); SUBS = Object.fromEntries(TASKS.filter(t => t.seedScore).map(t => [t.id, { date: isoOffset(-3), file: 'jawaban.pdf', score: t.seedScore }])); renderTop(); renderSidebar(); toast('Data demo dikembalikan seperti semula'); },
  notif: d => { NREAD.add(d.id); store.set('nread', [...NREAD]); renderTop(); go(d.page); },
  readAll: () => { NOTIFS[state.role].forEach(n => NREAD.add(n.id)); store.set('nread', [...NREAD]); renderTop(); renderSidebar(); if (state.page === 'notifikasi') go('notifikasi'); toast('Semua notifikasi ditandai dibaca'); },

  /* guru */
  viewClass: d => {
    const st = studentsOf(d.id);
    openModal({ title: `Siswa ${clsName(d.id)} <span class="badge-soft primary ms-2">${st.length}</span>`, size: 'modal-lg', body: `<input id="stQ" class="form-control mb-3" placeholder="Cari nama siswa…"><div id="stList"></div>` });
    const draw = q => { $('#stList').innerHTML = st.filter(s => s.name.toLowerCase().includes(q)).map(s => { const f = finalOf(s.id, MY); return `<div class="list-row">${avatar(s.name, 42)}<div class="flex-grow-1"><div class="fw-bold">${s.name}</div><small class="text-muted">NIS ${s.nis} · Kehadiran ${s.attend}%</small></div><span class="badge-soft ${gradeTone(f)}">Nilai ${f}</span></div>`; }).join('') || empty('Tidak ditemukan', 'bi-person-x'); };
    draw(''); $('#stQ').oninput = e => draw(e.target.value.toLowerCase());
  },
  goMateri: d => { ui.materiClass = d.id; go('materi'); },
  uploadMateri: () => openModal({
    title: 'Unggah Materi Baru',
    body: `<form id="matForm" class="row g-3"><div class="col-12"><label class="form-label small fw-semibold">Judul materi</label><input class="form-control" name="title" placeholder="mis. Limit Trigonometri" required></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">Kelas</label><select class="form-select" name="classId">${CLASSES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">Jenis</label><select class="form-select" name="type">${Object.keys(TYPE).map(t => `<option>${t}</option>`).join('')}</select></div>
      <div class="col-12"><label class="form-label small fw-semibold">File (opsional, demo)</label><input type="file" class="form-control" name="file"></div></form>`,
    footer: `<button class="btn btn-light-x" data-bs-dismiss="modal">Batal</button><button class="btn btn-accent px-4" data-act="saveMateri">Unggah</button>`
  }),
  saveMateri: () => {
    const f = new FormData($('#matForm')), title = (f.get('title') || '').trim();
    if (!title) { toast('Judul materi wajib diisi', 'danger'); return; }
    const file = f.get('file');
    MATERIALS.unshift({ id: ++mid, subject: MY, classId: f.get('classId'), title, type: f.get('type'), date: isoOffset(0), size: file && file.size ? (file.size / 1048576).toFixed(1).replace('.', ',') + ' MB' : '1,0 MB' });
    closeModal(); toast('Materi berhasil diunggah'); ui.drawMateri && ui.drawMateri();
  },
  delMateri: d => { const i = MATERIALS.findIndex(m => m.id == d.id); if (i > -1) { MATERIALS.splice(i, 1); toast('Materi dihapus'); ui.drawMateri(); } },
  newTask: () => openModal({
    title: 'Buat Tugas / Ujian',
    body: `<form id="taskForm" class="row g-3"><div class="col-md-6"><label class="form-label small fw-semibold">Jenis</label><select class="form-select" name="kind" id="tkKind"><option>Tugas</option><option>Ujian</option></select></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">Kelas</label><select class="form-select" name="classId">${CLASSES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
      <div class="col-12"><label class="form-label small fw-semibold">Judul</label><input class="form-control" name="title" required></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">Tenggat</label><input type="date" class="form-control" name="due" value="${isoOffset(7)}"></div>
      <div class="col-md-6"><label class="form-label small fw-semibold">Durasi (menit, untuk ujian)</label><input type="number" class="form-control" name="duration" value="45" min="10"></div></form>`,
    footer: `<button class="btn btn-light-x" data-bs-dismiss="modal">Batal</button><button class="btn btn-accent px-4" data-act="saveTask">Simpan</button>`
  }),
  saveTask: () => {
    const f = new FormData($('#taskForm')), title = (f.get('title') || '').trim();
    if (!title) { toast('Judul wajib diisi', 'danger'); return; }
    const cid = f.get('classId'), kind = f.get('kind');
    TASKS.push({ id: ++tid, kind, subject: MY, classId: cid, title, due: f.get('due') || isoOffset(7), total: studentsOf(cid).length, submitted: 0, ...(kind === 'Ujian' ? { duration: +f.get('duration') || 45 } : {}) });
    closeModal(); toast(kind + ' berhasil dibuat'); ui.drawTasks && ui.drawTasks();
  },
  delTask: d => { const i = TASKS.findIndex(t => t.id == d.id); if (i > -1) { TASKS.splice(i, 1); toast('Data dihapus'); ui.drawTasks(); } },
  saveScores: () => { confetti(); toast('Nilai berhasil disimpan'); },
  exportCSV: () => {
    const cid = ui.nilaiClass || 'c1', rows = [['NIS', 'Nama', 'Tugas', 'UTS', 'UAS', 'Akhir', 'Predikat']];
    studentsOf(cid).forEach(s => { const sc = getScores(s.id, MY), f = finalOf(s.id, MY); rows.push([s.nis, s.name, sc.tugas, sc.uts, sc.uas, f, predikat(f)]); });
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `nilai-${clsName(cid).replace(/ /g, '-')}.csv`; a.click(); URL.revokeObjectURL(a.href);
    toast('File CSV diunduh');
  },
  newAnn: () => openModal({
    title: 'Buat Pengumuman',
    body: `<form id="annForm" class="row g-3"><div class="col-12"><label class="form-label small fw-semibold">Judul</label><input class="form-control" name="title" required></div>
      <div class="col-12"><label class="form-label small fw-semibold">Kategori</label><select class="form-select" name="cat"><option>Akademik</option><option>Kegiatan</option><option>Sistem</option></select></div>
      <div class="col-12"><label class="form-label small fw-semibold">Isi pengumuman</label><textarea class="form-control" name="body" rows="4" required></textarea></div></form>`,
    footer: `<button class="btn btn-light-x" data-bs-dismiss="modal">Batal</button><button class="btn btn-accent px-4" data-act="saveAnn">Terbitkan</button>`
  }),
  saveAnn: () => {
    const f = new FormData($('#annForm')), title = (f.get('title') || '').trim(), body = (f.get('body') || '').trim();
    if (!title || !body) { toast('Judul dan isi wajib diisi', 'danger'); return; }
    ANNOUNCEMENTS.unshift({ id: Date.now(), title, cat: f.get('cat'), ago: 0, author: state.user.name, pinned: false, body });
    closeModal(); toast('Pengumuman diterbitkan'); ui.drawAnn();
  },

  /* siswa */
  goSubj: d => { ui.materiSubject = d.id; go('materi'); },
  openMat: d => {
    const m = MATERIALS.find(x => x.id == d.id), [ic, col] = TYPE[m.type], s = subj(m.subject), done = READ.has(m.id);
    openModal({
      title: esc(m.title),
      body: `<div class="text-center p-4 mb-3" style="background:color-mix(in srgb,${col} 10%,transparent);border-radius:18px"><i class="bi ${ic}" style="font-size:4.5rem;color:${col}"></i><div class="fw-bold mt-2">${m.type} · ${m.size}</div></div>
        <div class="d-flex justify-content-between small"><span class="text-muted">Mata pelajaran</span><b>${s.name}</b></div><div class="d-flex justify-content-between small mt-1"><span class="text-muted">Pengajar</span><b>${s.teacher}</b></div><div class="d-flex justify-content-between small mt-1"><span class="text-muted">Diunggah</span><b>${fmtDate(m.date)}</b></div>`,
      footer: `<button class="btn btn-light-x" data-bs-dismiss="modal">Tutup</button><button class="btn btn-accent px-4" data-act="readMat" data-id="${m.id}" ${done ? 'disabled' : ''}>${done ? '<i class="bi bi-check2"></i> Sudah dibaca' : 'Tandai selesai dibaca'}</button>`
    });
  },
  readMat: d => { READ.add(+d.id); store.set('read', [...READ]); closeModal(); toast('Materi ditandai selesai dibaca'); ui.drawMateri && ui.drawMateri(); },
  submitTask: d => {
    const t = TASKS.find(x => x.id == d.id), s = subj(t.subject);
    openModal({
      title: 'Kumpulkan Tugas',
      body: `<div class="list-row mb-3"><div class="icon-bubble" style="--c:${s.color}"><i class="bi ${s.icon}"></i></div><div><div class="fw-bold">${esc(t.title)}</div><small class="text-muted">${s.name} · Tenggat ${fmtDate(t.due)}</small></div></div>
        <label class="form-label small fw-semibold">Unggah jawaban</label><input type="file" class="form-control mb-3" id="subFile"><label class="form-label small fw-semibold">Catatan untuk guru (opsional)</label><textarea class="form-control" id="subNote" rows="3"></textarea>`,
      footer: `<button class="btn btn-light-x" data-bs-dismiss="modal">Batal</button><button class="btn btn-accent px-4" data-act="doSubmit" data-id="${t.id}"><i class="bi bi-send"></i> Kirim</button>`
    });
  },
  doSubmit: d => {
    const f = $('#subFile').files[0], note = $('#subNote').value.trim();
    if (!f && !note) { toast('Unggah file atau tulis catatan dulu ya', 'danger'); return; }
    SUBS[d.id] = { date: isoOffset(0), file: f ? f.name : 'catatan.txt', score: null }; store.set('subs', SUBS);
    closeModal(); confetti(); toast('Tugas berhasil dikumpulkan!'); ui.drawTasks && ui.drawTasks();
  },
  startExam: d => {
    const t = TASKS.find(x => x.id == d.id);
    Object.assign(quiz, { task: t, qs: QUIZ[t.subject] || QUIZ.mtk, i: 0, ans: [], t: 300, done: false });
    openModal({ title: esc(t.title), body: '', footer: '', size: 'modal-lg' });
    drawQuiz();
    clearInterval(quiz.timer);
    quiz.timer = setInterval(() => { quiz.t--; const el = $('#qTimer'); if (el) el.innerHTML = `<i class="bi bi-stopwatch"></i> ${timeStr(quiz.t)}`; if (quiz.t <= 0) finishQuiz(); }, 1000);
  },
  pick: d => { quiz.ans[quiz.i] = +d.i; drawQuiz(); },
  quizNext: () => { if (quiz.i < quiz.qs.length - 1) { quiz.i++; drawQuiz(); } else finishQuiz(); }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const a = ACTIONS[el.dataset.act];
  if (a) { if (el.tagName === 'A') e.preventDefault(); a(el.dataset, el, e); }
});
document.addEventListener('change', e => {
  const k = e.target.dataset && e.target.dataset.set;
  if (!k) return;
  settings[k] = e.target.type === 'checkbox' ? (k === 'theme' ? (e.target.checked ? 'dark' : 'light') : e.target.checked) : e.target.value;
  applySettings();
  if (k === 'theme') { renderTop(); go('pengaturan'); }
});
$('#appModal').addEventListener('hidden.bs.modal', () => {
  clearInterval(quiz.timer);
  if (quiz.done) { quiz.done = false; if (state.page === 'ujian') go('ujian'); else if (state.page === 'dashboard') go('dashboard'); }
});

/* ---------------------------- Search ------------------------------- */
function searchIndex() {
  const out = [], push = (l, s, i, p) => out.push({ l, s, i, p });
  if (state.role === 'teacher') {
    CLASSES.forEach(c => push('Kelas ' + c.name, 'Matematika · ' + c.room, 'bi-people', 'kelas'));
    STUDENTS.forEach(s => push(s.name, 'NIS ' + s.nis + ' · ' + clsName(s.classId), 'bi-person', 'penilaian'));
    MATERIALS.filter(m => m.subject === MY).forEach(m => push(m.title, 'Materi · ' + clsName(m.classId), 'bi-journal-richtext', 'materi'));
    TASKS.filter(t => t.subject === MY).forEach(t => push(t.title, t.kind + ' · ' + clsName(t.classId), 'bi-clipboard-check', 'tugas'));
  } else {
    SUBJECTS.forEach(s => push(s.name, s.teacher, s.icon, 'kelas'));
    MATERIALS.filter(m => m.classId === 'c1').forEach(m => push(m.title, 'Materi · ' + subj(m.subject).name, 'bi-journal-richtext', 'materi'));
    myTasks().forEach(t => push(t.title, t.kind + ' · ' + subj(t.subject).name, 'bi-clipboard-check', t.kind === 'Ujian' ? 'ujian' : 'tugas'));
  }
  ANNOUNCEMENTS.forEach(a => push(a.title, 'Pengumuman · ' + a.cat, 'bi-megaphone', 'pengumuman'));
  return out;
}
const hl = (t, q) => { const i = t.toLowerCase().indexOf(q); return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length)); };
$('#globalSearch').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase(), box = $('#searchResults');
  if (!q) { box.classList.add('d-none'); return; }
  const res = searchIndex().filter(x => x.l.toLowerCase().includes(q) || x.s.toLowerCase().includes(q)).slice(0, 8);
  box.innerHTML = res.length ? res.map(x => `<div class="sr-item" data-page="${x.p}"><div class="icon-bubble" style="width:36px;height:36px;font-size:1rem;border-radius:10px"><i class="bi ${x.i}"></i></div><div><div class="fw-semibold">${hl(x.l, q)}</div><small>${esc(x.s)}</small></div></div>`).join('') : '<div class="empty py-4"><i class="bi bi-search"></i>Tidak ada hasil</div>';
  box.classList.remove('d-none');
});
$('#searchResults').addEventListener('click', e => {
  const it = e.target.closest('.sr-item'); if (!it) return;
  $('#searchResults').classList.add('d-none'); $('#globalSearch').value = ''; go(it.dataset.page);
});
document.addEventListener('click', e => { if (!e.target.closest('.search-box')) $('#searchResults').classList.add('d-none'); });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && state.role) { e.preventDefault(); $('#globalSearch').focus(); }
  if (e.key === 'Escape') $('#searchResults').classList.add('d-none');
});

/* ---------------------------- Login -------------------------------- */
function setRole(r) {
  $('#roleSwitch').dataset.role = r;
  $$('#roleSwitch button').forEach(b => b.classList.toggle('active', b.dataset.role === r));
  $('#loginUser').value = CREDS[r].u; $('#loginPass').value = CREDS[r].p;
  $('#loginError').classList.add('d-none');
  state.pendingRole = r;
}
function resetLoginBtn() { const b = $('#loginBtn'); b.disabled = false; b.innerHTML = '<span class="btn-label">Masuk</span>'; }

$('#roleSwitch').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setRole(b.dataset.role); });
$('#togglePass').addEventListener('click', () => {
  const p = $('#loginPass'), show = p.type === 'password'; p.type = show ? 'text' : 'password';
  $('#togglePass i').className = 'bi ' + (show ? 'bi-eye-slash' : 'bi-eye');
});
$('#forgot').addEventListener('click', e => { e.preventDefault(); toast('Fitur reset password hanya contoh pada demo ini', 'danger'); });
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const r = state.pendingRole || 'student', u = $('#loginUser').value.trim(), p = $('#loginPass').value, err = $('#loginError'), card = $('#loginForm');
  if (!u || !p) { err.textContent = 'Username dan password wajib diisi.'; }
  else if (u !== CREDS[r].u || p !== CREDS[r].p) { err.textContent = 'Username atau password salah untuk peran ini.'; }
  else {
    err.classList.add('d-none');
    const b = $('#loginBtn'); b.disabled = true; b.innerHTML = '<span class="spinner-x"></span>Memverifikasi…';
    setTimeout(() => { if ($('#remember').checked) store.set('session', r); startApp(r, true); }, 900);
    return;
  }
  err.classList.remove('d-none'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
});

function startApp(role, animated) {
  state.role = role; state.user = USERS[role]; state.page = 'dashboard';
  const lv = $('#loginView');
  const show = () => { lv.classList.add('d-none'); $('#appView').classList.remove('d-none'); renderSidebar(); renderTop(); go('dashboard'); };
  if (animated && settings.anim) { lv.classList.add('leaving'); setTimeout(show, 450); } else show();
}

function typeEffect() {
  const words = ['menyenangkan', 'terarah', 'interaktif', 'modern'], el = $('#typed'); let w = 0, c = 0, del = false;
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 45 : 90);
  })();
}

/* ---------------------------- Init --------------------------------- */
applySettings();
setRole('student');
typeEffect();
animateCounters($('#loginView'));
const sess = store.get('session', null);
if (sess && USERS[sess]) startApp(sess, false);
