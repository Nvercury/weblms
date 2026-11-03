'use strict';
/* =====================================================================
   Historia LMS - SMA Nusantara
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
const palette = ['#8b5a2b', '#5c3a21', '#a1662c', '#d35400', '#c0392b', '#795548', '#8e44ad', '#27ae60'];
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
  { id: 'sej', name: 'Sejarah Indonesia', teacher: 'Kamal Aminullah, S.Pd.', icon: 'bi-bank', color: '#8b5a2b', room: 'R. 204' },
  { id: 'fis', name: 'Fisika', teacher: 'Budi Santoso, M.Pd.', icon: 'bi-lightning-charge', color: '#f59e0b', room: 'Lab Fisika' },
  { id: 'kim', name: 'Kimia', teacher: 'Dewi Lestari, S.Si.', icon: 'bi-droplet-half', color: '#10b981', room: 'Lab Kimia' },
  { id: 'bio', name: 'Biologi', teacher: 'Hendra Gunawan, S.Pd.', icon: 'bi-flower1', color: '#14b8a6', room: 'Lab Biologi' },
  { id: 'ind', name: 'Bahasa Indonesia', teacher: 'Siti Aminah, S.Pd.', icon: 'bi-book', color: '#ec4899', room: 'R. 204' },
  { id: 'ing', name: 'Bahasa Inggris', teacher: 'Andre Wijaya, S.S.', icon: 'bi-translate', color: '#06b6d4', room: 'R. 204' },
  { id: 'mtk', name: 'Matematika', teacher: 'Ratna Wulandari, S.Pd.', icon: 'bi-calculator', color: '#6366f1', room: 'R. 204' },
  { id: 'pjok', name: 'PJOK', teacher: 'Rudi Hartono, S.Pd.', icon: 'bi-dribbble', color: '#ef4444', room: 'Lapangan' }
];
const subj = id => SUBJECTS.find(s => s.id === id);

const CLASSES = [
  { id: 'c1', name: 'XI IPS 1', room: 'R. 204' },
  { id: 'c2', name: 'XI IPS 2', room: 'R. 205' },
  { id: 'c3', name: 'XII IPS 1', room: 'R. 301' }
];
const clsName = id => CLASSES.find(c => c.id === id).name;

const NAMES = ['Zidane Rizaliano', 'Bunga Citra Lestari', 'Dimas Ardiansyah', 'Eka Putri Wulandari', 'Farhan Maulana', 'Gita Safitri', 'Hafiz Ramadhan', 'Intan Permata Sari', 'Joni Kurniawan', 'Kirana Anindya', 'Lukman Hakim', 'Maya Anggraini', 'Naufal Rizky', 'Olivia Handayani', 'Putra Wijaya', 'Qori Nur Azizah', 'Rizky Firmansyah', 'Salsabila Putri', 'Tegar Prakoso', 'Vina Melinda'];
const STUDENTS = NAMES.map((n, i) => ({ id: 's' + (i + 1), name: n, nis: String(2024001 + i), classId: i < 8 ? 'c1' : i < 14 ? 'c2' : 'c3', attend: Math.round(88 + rng(i + 3)() * 12) }));
const studentsOf = cid => STUDENTS.filter(s => s.classId === cid);

const USERS = {
  teacher: { role: 'teacher', id: '198005022005011003', name: 'Kamal Aminullah, S.Pd.', call: 'Pak Kamal Aminullah', email: 'kamalaminullah@historia.sch.id', phone: '0812-3456-7890', addr: 'Jl. Pendidikan No. 12, Jakarta Selatan' },
  student: { role: 'student', id: '2024001', sid: 's1', name: 'Zidane Rizaliano', call: 'Zidane Rizaliano', className: 'XI IPS 1', classId: 'c1', email: 'zidanerizaliano@siswa.historia.sch.id', phone: '0857-1122-3344', addr: 'Jl. Melati No. 5, Jakarta Timur' }
};
const CREDS = { student: { u: 'siswa', p: '12345' }, teacher: { u: 'guru', p: '12345' } };

let mid = 0;
// Tambahkan parameter url di akhir
const M = (subject, classId, title, type, ago, size, url = '#') => ({ 
  id: ++mid, 
  subject, 
  classId, 
  title, 
  type, 
  date: isoOffset(-ago), 
  size, 
  url,
});

const MATERIALS = [
  M('sej', 'c1', 'Kehidupan Manusia Praaksara di Indonesia', 'PDF', 2, '2,4 MB', 'https://www.kompas.com/skola/read/2020/07/01/180000069/kehidupan-manusia-praaksara-di-indonesia?page=all'),
  M('sej', 'c1', 'Kehidupan Masa Praaksara', 'PPT', 3, '5,1 MB', 'praaksara.pdf'),
  M('sej', 'c1', 'Kehidupan Masyarakat di Masa Kerajaan Islam', 'PDF', 6, '4,1 MB', 'https://www.ruangguru.com/blog/kehidupan-masyarakat-di-masa-kerajaan-islam'),
  M('sej', 'c1', 'Kerajaan Hindu Buddha di Indonesia: Sejarah, Kerajaan, Raja, dan Peninggalannya', 'PDF', 5, '2 MB', 'https://www.funteacherprivate.com/blog/kerajaan-hindu-buddha-di-indonesia-sejarah-kerajaan-raja-dan-peninggalannya'),
  M('sej', 'c1', 'Perang Padri: Latar Belakang, Kronologi, Tokoh & Dampaknya', 'PDF', 7, '5,1 MB', 'https://www.ruangguru.com/blog/perang-padri'),
  M('sej', 'c2', 'Bab 4: Perang Padri di Sumatera', 'PPT', 3, '5,1 MB', 'materi/padri.ppt'),
  M('sej', 'c3', 'Bab 5: Perang Aceh (1873-1904)', 'PDF', 1, '3,2 MB', 'materi/aceh.pdf'),
  M('mtk', 'c1', 'Limit Fungsi Aljabar', 'PPT', 3, '5,1 MB', 'materi/limit.ppt'),
  M('fis', 'c1', 'Hukum Newton & Penerapannya', 'PPT', 4, '6,0 MB', 'materi/newton.ppt'),
  M('kim', 'c1', 'Stoikiometri Larutan', 'PDF', 3, '2,9 MB', 'materi/stoikiometri.pdf'),
  M('bio', 'c1', 'Sistem Peredaran Darah', 'PPT', 2, '7,3 MB', 'materi/darah.ppt'),
  M('ind', 'c1', 'Teks Eksposisi & Argumentasi', 'PDF', 5, '1,4 MB', 'materi/eksposisi.pdf'),
  M('ing', 'c1', 'Conditional Sentences Type 1-3', 'PPT', 1, '4,0 MB', 'materi/conditional.ppt'),
  M('pjok', 'c1', 'Teknik Dasar Bola Voli', 'Video', 10, '12 mnt', 'materi/volly.mp4')
];

const TYPE = { 
  PDF: ['bi-file-earmark-pdf-fill', '#ef4444'], 
  PPT: ['bi-file-earmark-slides-fill', '#f59e0b'], 
  Video: ['bi-play-circle-fill', '#6366f1'], 
  Audio: ['bi-headphones', '#10b981'] 
};

openMat: d => {
  const m = MATERIALS.find(x => x.id == d.id), [ic, col] = TYPE[m.type], s = subj(m.subject), done = READ.has(m.id);
  
  openModal({
    title: esc(m.title),
    body: `
      <!-- Kotak Icon yang dapat diklik langsung membuka file/URL -->
      <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" class="d-block text-decoration-none p-4 mb-3 text-center" style="background:color-mix(in srgb,${col} 10%,transparent); border-radius:18px; cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
        <i class="bi ${ic}" style="font-size:4.5rem; color:${col}"></i>
        <div class="fw-bold mt-2 text-dark">${m.type} · ${m.size}</div>
        <small class="text-muted d-block mt-1"><i class="bi bi-box-arrow-up-right me-1"></i> Klik untuk membuka / mengunduh materi</small>
      </a>
      
      <div class="d-flex justify-content-between small"><span class="text-muted">Mata pelajaran</span><b>${s ? s.name : '-'}</b></div>
      <div class="d-flex justify-content-between small mt-1"><span class="text-muted">Pengajar</span><b>${s ? s.teacher : '-'}</b></div>
      <div class="d-flex justify-content-between small mt-1"><span class="text-muted">Diunggah</span><b>${fmtDate(m.date)}</b></div>
    `,
    footer: `
      <button class="btn btn-light-x" data-bs-dismiss="modal">Tutup</button>
      <button class="btn btn-accent px-4" data-act="readMat" data-id="${m.id}" ${done ? 'disabled' : ''}>
        ${done ? '<i class="bi bi-check2"></i> Sudah dibaca' : 'Tandai selesai dibaca'}
      </button>
    `
  });
}
let tid = 0;
const T = (kind, subject, classId, title, dueIn, total, submitted, extra = {}) => ({ id: ++tid, kind, subject, classId, title, due: isoOffset(dueIn), total, submitted, ...extra });
const TASKS = [
  T('Tugas', 'sej', 'c1', 'Analisis Taktik Gerilya vs Benteng Stelsel', 2, 8, 5),
  T('Tugas', 'sej', 'c2', 'Esai: Dampak Perang Padri', 4, 6, 2),
  T('Tugas', 'sej', 'c3', 'Laporan: Strategi Snouck Hurgronje di Aceh', 1, 6, 6),
  T('Ujian', 'sej', 'c1', 'UTS: Perlawanan Rakyat Nusantara', 6, 8, 0, { duration: 60 }),
  T('Ujian', 'sej', 'c3', 'Ulangan Harian Kolonialisme', 9, 6, 0, { duration: 45 }),
  T('Tugas', 'fis', 'c1', 'Laporan Gerak Parabola', 3, 8, 0),
  T('Ujian', 'fis', 'c1', 'Kuis Hukum Newton', 2, 8, 0, { duration: 30 }),
  T('Tugas', 'kim', 'c1', 'Rangkuman Stoikiometri', 5, 8, 0),
  T('Tugas', 'ind', 'c1', 'Menulis Teks Eksposisi', -1, 8, 0),
  T('Tugas', 'ing', 'c1', 'Essay: My Dream School', 7, 8, 0),
  T('Tugas', 'sej', 'c1', 'Kuis Awal: Sultan Agung', -5, 8, 8, { seedScore: 88 }),
  T('Tugas', 'kim', 'c1', 'Kuis Sifat Koligatif', -7, 8, 8, { seedScore: 92 }),
  T('Tugas', 'fis', 'c1', 'Soal Dinamika Partikel', -4, 8, 8, { seedScore: 85 })
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'Kunjungan ke Museum Fatahillah', cat: 'Kegiatan', ago: 0, author: 'Wakil Kepala Sekolah', pinned: true, body: 'Kunjungan studi sejarah ke Museum Fatahillah akan dilaksanakan Rabu depan. Seluruh siswa kelas XI diharap membawa alat tulis.' },
  { id: 2, title: 'Jadwal Ujian Tengah Semester', cat: 'Akademik', ago: 1, author: 'Waka Kurikulum', pinned: true, body: 'UTS semester ganjil dimulai dalam dua minggu ke depan. Pastikan seluruh materi Sejarah telah dipelajari dengan baik.' },
  { id: 3, title: 'Pemeliharaan Sistem LMS', cat: 'Sistem', ago: 2, author: 'Tim IT Sekolah', pinned: false, body: 'LMS akan menjalani pemeliharaan pada Sabtu pukul 22:00 - 24:00. Selama waktu tersebut layanan tidak dapat diakses.' },
  { id: 4, title: 'Lomba Esai Sejarah Nasional', cat: 'Kegiatan', ago: 4, author: 'Pembina OSIS', pinned: false, body: 'Pendaftaran Lomba Esai Sejarah tingkat Nasional telah dibuka. Silakan daftar melalui wali kelas masing-masing.' },
  { id: 5, title: 'Pembagian Rapor Tengah Semester', cat: 'Akademik', ago: 6, author: 'Tata Usaha', pinned: false, body: 'Rapor tengah semester dapat diambil oleh orang tua/wali pada hari Sabtu pukul 08:00 - 12:00 di ruang kelas.' }
];

const NOTIFS = {
  teacher: [
    { id: 't1', icon: 'bi-inbox-fill', c: '#6366f1', text: '5 siswa mengumpulkan <b>Analisis Taktik Gerilya vs Benteng Stelsel</b>', time: '10 menit lalu', page: 'penilaian' },
    { id: 't2', icon: 'bi-megaphone-fill', c: '#f59e0b', text: 'Pengumuman baru: <b>Kunjungan ke Museum Fatahillah</b>', time: '1 jam lalu', page: 'pengumuman' },
    { id: 't3', icon: 'bi-calendar-event-fill', c: '#10b981', text: 'Jadwal mengajar besok: <b>XI IPS 1</b> pukul 10:15', time: '3 jam lalu', page: 'jadwal' },
    { id: 't4', icon: 'bi-clipboard-check-fill', c: '#ec4899', text: 'Tenggat <b>Laporan Snouck Hurgronje</b> sudah terlewati', time: 'Kemarin', page: 'tugas' }
  ],
  student: [
    { id: 's1', icon: 'bi-exclamation-triangle-fill', c: '#ef4444', text: 'Tugas <b>Menulis Teks Eksposisi</b> sudah melewati tenggat', time: '30 menit lalu', page: 'tugas' },
    { id: 's2', icon: 'bi-patch-question-fill', c: '#f59e0b', text: '<b>UTS: Perlawanan Rakyat Nusantara</b> dimulai 2 hari lagi', time: '2 jam lalu', page: 'ujian' },
    { id: 's3', icon: 'bi-award-fill', c: '#10b981', text: 'Nilai <b>Kuis Awal: Sultan Agung</b> telah terbit: 88', time: 'Kemarin', page: 'nilai' },
    { id: 's4', icon: 'bi-journal-richtext', c: '#6366f1', text: 'Materi baru: <b>Bab 3: Perang Diponegoro</b>', time: 'Kemarin', page: 'materi' },
    { id: 's5', icon: 'bi-megaphone-fill', c: '#ec4899', text: 'Pengumuman: <b>Kunjungan ke Museum Fatahillah</b>', time: '2 hari lalu', page: 'pengumuman' }
  ]
};

const TIMES = ['07:00 - 08:30', '08:30 - 10:00', '10:15 - 11:45', '12:30 - 14:00'];
const STUDENT_SCHEDULE = {
  Senin: ['sej', 'fis', 'ind', 'mtk'], Selasa: ['kim', 'bio', 'ing', 'sej'], Rabu: ['fis', 'sej', 'pjok', 'ind'],
  Kamis: ['ing', 'kim', 'bio', 'mtk'], Jumat: ['sej', 'ind', 'ing', null]
};
const TEACHER_SCHEDULE = {
  Senin: { 0: 'c1', 2: 'c2' }, Selasa: { 1: 'c3', 3: 'c1' }, Rabu: { 0: 'c2', 1: 'c1', 3: 'c3' },
  Kamis: { 2: 'c3' }, Jumat: { 0: 'c1', 1: 'c2' }
};

const QUIZ_LINKS = [
  { id: 1, title: 'Evaluasi manusia pada masa praaksara', duration: 60, due: isoOffset(2), url: 'https://docs.google.com/forms/d/e/1FAIpQLScwgSo4R1d4aNMZ4mO5OX0cYzCazgzzRQ_Rckv--m58nakvMw/viewform?usp=publish-editor' },
  { id: 2, title: 'LATIHAN SOAL PERKEMBANGAN KERAJAAN HINDU BUDHA', duration: 45, due: isoOffset(4), url: 'https://docs.google.com/forms/d/e/1FAIpQLSeP7lsTIDZ3lCY9Y8F85B55ZA9W6kDP2CB0P16w351IfK2wHw/viewform?usp=publish-editor' },
  { id: 3, title: 'LATIHAN SOAL KERAJAAN ISLAM', duration: 30, due: isoOffset(6), url: 'https://docs.google.com/forms/d/e/1FAIpQLSf50Vh_WcdjlB8g355afVd0-nskHnRM3MpVfftM051E3BxAGw/viewform?usp=publish-editor' },
  { id: 4, title: 'LATIHAN SOAL PERANG PRA KEMERDEKAAN', duration: 45, due: isoOffset(8), url: 'https://docs.google.com/forms/d/e/1FAIpQLScASkBt4xuahqYe_Nhf1kTRXCIKOG0RsYHXEvF4cRxki8thAg/viewform?usp=publish-editor' }
];
/* ---------------------------- State -------------------------------- */
const ACCENTS = { indigo: ['#6366f1', '#8b5cf6'], emerald: ['#10b981', '#06b6d4'], rose: ['#f43f5e', '#f97316'], vintage: ['#8b5a2b', '#5c3a21'], amber: ['#f59e0b', '#ef4444'] };
const settings = Object.assign({ theme: 'light', accent: 'vintage', anim: true, font: 'md', emailNotif: true }, store.get('settings', {}));
const state = { role: null, page: 'dashboard', user: null, history: ['dashboard'] };
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
  const a = ACCENTS[settings.accent] || ACCENTS.vintage;
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
  Chart.defaults.color = dark ? '#a69581' : '#795548';
  Chart.defaults.font.family = "'Lora', serif";
  Chart.defaults.borderColor = dark ? '#5a4b3d' : '#d7ccc8';
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
  teacher: [['dashboard', 'Dashboard', 'bi-speedometer2'], ['kelas', 'Kelas Saya', 'bi-people'], ['materi', 'Materi', 'bi-journal-richtext'], ['tugas', 'Tugas & Ujian', 'bi-clipboard-check'], ['penilaian', 'Penilaian', 'bi-award'], ['jadwal', 'Jadwal Mengajar', 'bi-calendar-week'], ['profil', 'Profil Guru', 'bi-person-circle']],
  student: [['dashboard', 'Dashboard', 'bi-speedometer2'], ['kelas', 'Kelas Saya', 'bi-collection'], ['materi', 'Materi', 'bi-journal-richtext'], ['peta', 'Peta Konsep', 'bi-diagram-3'], ['video', 'Video Edukasi', 'bi-play-btn'], ['diskusi', 'Ruang Diskusi', 'bi-chat-dots'], ['presensi', 'Presensi', 'bi-calendar-check'], ['tugas', 'Tugas', 'bi-clipboard-check'], ['ujian', 'Latihan Soal', 'bi-patch-question'], ['nilai', 'Nilai', 'bi-bar-chart-line'], ['profil', 'Profil Siswa', 'bi-person-circle']]
};
const COMMON = [['notifikasi', 'Notifikasi', 'bi-bell'], ['pengumuman', 'Pengumuman', 'bi-megaphone'], ['pengaturan', 'Pengaturan', 'bi-gear']];
const unreadCount = () => NOTIFS[state.role].filter(n => !NREAD.has(n.id)).length;

function renderSidebar() {
  const u = state.user, item = ([k, l, i]) => `<div class="nav-x ${state.page === k ? 'active' : ''}" data-act="go" data-page="${k}"><i class="bi ${i}"></i><span>${l}</span>${k === 'notifikasi' && unreadCount() ? `<span class="dot">${unreadCount()}</span>` : ''}</div>`;
  $('#sidebar').innerHTML = `
    <div class="brand"><i class="bi bi-bank2"></i><div>Historia<small>LMS SEJARAH</small></div></div>
    <div class="nav-label">Menu ${state.role === 'teacher' ? 'Guru' : 'Siswa'}</div>
    ${MENUS[state.role].map(item).join('')}
    <div class="nav-label">Umum</div>
    ${COMMON.map(item).join('')}
    <div class="side-user mt-4">${avatar(u.name, 40)}<div class="flex-grow-1" style="min-width:0"><div class="nm text-truncate">${esc(u.name)}</div><div class="rl">${state.role === 'teacher' ? 'Guru Sejarah' : 'Siswa ' + u.className}</div></div>
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
  if (state.page !== page) { state.history.push(page); }
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
const MY = 'sej'; // Diubah dari mtk ke sej

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
      <p>${day ? `Hari ini Anda mengajar <b>${sched.length} kelas</b>` : 'Hari ini libur mengajar'} dan ada <b>${toGrade} pengumpulan tugas</b> sejarah menunggu penilaian.</p>
      <button class="btn btn-white px-4 py-2" data-act="go" data-page="penilaian">Mulai menilai <i class="bi bi-arrow-right"></i></button>
      <i class="bi bi-bank2 hero-ico"></i></div>
    <div class="row g-3 mb-3">
      ${stat('bi-people-fill', 'Kelas diampu', CLASSES.length, '#8b5a2b')}
      ${stat('bi-person-lines-fill', 'Total siswa', STUDENTS.length, '#c62828')}
      ${stat('bi-inbox-fill', 'Perlu dinilai', toGrade, '#d35400')}
      ${stat('bi-graph-up-arrow', 'Rata-rata nilai', avgAll, '#27ae60')}
    </div>
    <div class="row g-3 mb-3">
      <div class="col-lg-8 reveal"><div class="card-x h-100"><div class="card-title-x">Rata-rata Nilai per Kelas <span class="badge-soft primary">Sejarah</span></div><div style="height:260px"><canvas id="chClass"></canvas></div></div></div>
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
  chart('chClass', { type: 'bar', data: { labels: CLASSES.map(c => c.name), datasets: [{ data: CLASSES.map(c => avgOf(studentsOf(c.id).map(s => finalOf(s.id, MY)))), backgroundColor: [accent(), accent2(), '#c62828'], borderRadius: 12, maxBarThickness: 70 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { min: 50, max: 100 } } } });
  const sub = mine.filter(t => t.kind === 'Tugas').reduce((a, t) => a + t.submitted, 0), tot = mine.filter(t => t.kind === 'Tugas').reduce((a, t) => a + t.total, 0);
  chart('chSub', { type: 'doughnut', data: { labels: ['Terkumpul', 'Belum'], datasets: [{ data: [sub, tot - sub], backgroundColor: ['#27ae60', '#e7e9f3'], borderWidth: 0 }] }, options: { cutout: '70%', plugins: { legend: { position: 'bottom' } } } });
};

PAGES.teacher.kelas = root => {
  root.innerHTML = head('Kelas Saya', 'Daftar kelas Sejarah yang Anda ampu.') + `<div class="row g-3">${CLASSES.map((c, i) => {
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
  root.innerHTML = head('Materi Pembelajaran', 'Kelola materi Sejarah untuk setiap kelas.', `<button class="btn btn-accent px-3" data-act="uploadMateri"><i class="bi bi-cloud-arrow-up"></i> Unggah Materi</button>`) +
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
      return `<div class="list-row reveal"><div class="icon-bubble" style="--c:${t.kind === 'Ujian' ? '#c62828' : '#8b5a2b'}"><i class="bi ${t.kind === 'Ujian' ? 'bi-patch-question-fill' : 'bi-clipboard-check-fill'}"></i></div>
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
      <h2>Halo, ${esc(u.call)}! Siap menelusuri sejarah ${greet()} ini? 🚀</h2>
      <p>Kamu punya <b>${pend.length} tugas</b> analisis sejarah yang belum dikumpulkan dan <b>${upExams.length} evaluasi</b> mendatang. Mari kuasai sejarah Nusantara!</p>
      <button class="btn btn-white px-4 py-2" data-act="go" data-page="materi">Lihat Materi <i class="bi bi-arrow-right"></i></button><i class="bi bi-compass-fill hero-ico"></i></div>
    <div class="row g-3 mb-3">
      ${stat('bi-trophy-fill', 'Rata-rata nilai', avg, '#27ae60')}
      ${stat('bi-clipboard-check-fill', 'Tugas belum selesai', pend.length, '#d35400')}
      ${stat('bi-patch-question-fill', 'Ujian mendatang', upExams.length, '#c62828')}
      ${stat('bi-calendar-check-fill', 'Kehadiran', studentsOf('c1')[0].attend, '#8b5a2b', '%')}
    </div>
    <div class="row g-3 mb-3">
      <div class="col-lg-5 reveal"><div class="card-x h-100"><div class="card-title-x">Profil Kemampuan</div><div style="height:290px"><canvas id="chRadar"></canvas></div></div></div>
      <div class="col-lg-3 reveal"><div class="card-x h-100 text-center"><div class="card-title-x">Progres Materi</div><div class="ring my-3" data-p="${prog}"><span>${prog}%</span></div><p class="text-muted small mb-0">${mats.filter(m => READ.has(m.id)).length} dari ${mats.length} arsip materi telah dipelajari</p><button class="btn btn-accent btn-sm mt-3" data-act="go" data-page="materi">Lanjut belajar</button></div></div>
      <div class="col-lg-4 reveal"><div class="card-x h-100"><div class="card-title-x">Jadwal Hari Ini</div>
        ${sched.length ? sched.map(x => `<div class="timeline-item" style="--c:${x.s.color}"><div class="tm">${TIMES[x.i]}</div><div><div class="fw-bold">${x.s.name}</div><small class="text-muted">${x.s.teacher.split(',')[0]}</small></div></div>`).join('') : empty('Tidak ada jadwal hari ini', 'bi-cup-hot')}</div></div>
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
  root.innerHTML = head('Kelas Saya', `Mata pelajaran ${state.user.className} semester ini.`) + 
  `<div class="row g-3">
    ${SUBJECTS.map(s => {
      const mats = MATERIALS.filter(m => m.classId === 'c1' && m.subject === s.id);
      const done = mats.filter(m => READ.has(m.id)).length;
      const pct = mats.length ? Math.round((done / mats.length) * 100) : 0;
      const f = finalOf('s1', s.id);

      return `
        <div class="col-md-6 col-xl-3 reveal">
          <!-- Seluruh kartu diberi data-act & data-id agar bisa diklik di mana saja -->
          <div class="card-x subj-card hover-lift h-100" data-act="goSubj" data-id="${s.id}" style="--c:${s.color}; cursor:pointer;">
            <i class="bi ${s.icon} big-ico"></i>
            <div class="icon-bubble mb-3" style="--c:${s.color}"><i class="bi ${s.icon}"></i></div>
            <h5 class="fw-bold mb-0">${s.name}</h5>
            <div class="small text-muted mb-3">${s.teacher}</div>
            <div class="d-flex justify-content-between small mb-1"><span class="text-muted">Progres materi</span><b>${pct}%</b></div>
            ${bar(pct, s.color)}
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge-soft ${gradeTone(f)}">Nilai ${f}</span>
              <button class="btn btn-sm btn-accent" data-act="goSubj" data-id="${s.id}">Buka</button>
            </div>
          </div>
        </div>`;
    }).join('')}
  </div>`;
};

// Hal Spesifik LMS Sejarah Sesuai Permintaan (Materi, Bab 3 Fokus)
PAGES.student.materi = root => {
  let sub = ui.materiSubject || 'sej', q = '';
  const avail = SUBJECTS.filter(s => MATERIALS.some(m => m.classId === 'c1' && m.subject === s.id));
  root.innerHTML = head('Materi', 'Pelajari strategi dan analisis perang pahlawan Nusantara.') +
    `<div class="d-flex flex-wrap gap-2 mb-3 reveal" id="chips"><button class="chip-filter ${sub === 'all' ? 'active' : ''}" data-s="all">Semua</button>${avail.map(s => `<button class="chip-filter ${sub === s.id ? 'active' : ''}" data-s="${s.id}">${s.name}</button>`).join('')}</div>
    <input id="fQ" class="form-control mb-3 reveal" style="max-width:320px" placeholder="Cari materi sejarah…"><div class="row g-3" id="matList"></div>`;
  const draw = () => {
    const list = MATERIALS.filter(m => m.classId === 'c1' && (sub === 'all' || m.subject === sub) && m.title.toLowerCase().includes(q));
    $('#matList').innerHTML = list.length ? list.map(m => matCard(m, 'student')).join('') : `<div class="col-12">${empty('Arsip materi tidak ditemukan', 'bi-journal-x')}</div>`;
    post($('#matList'));
  };
  ui.drawMateri = draw;
  $('#chips').onclick = e => { const b = e.target.closest('button'); if (!b) return; sub = ui.materiSubject = b.dataset.s; $$('#chips button').forEach(x => x.classList.toggle('active', x === b)); draw(); };
  $('#fQ').oninput = e => { q = e.target.value.toLowerCase(); draw(); };
  draw();
};

PAGES.student.peta = root => {
  const mapData = [
    { id: 1, title: 'Perjuangan Melawan Penjajahan', desc: 'Perjuangan Melawan Penjajahan', detail: 'Perlawanan daerah yang dipicu oleh praktik monopoli perdagangan, kerja paksa, dan penindasan kolonial.', img: 'g1.jpeg' },
    { id: 2, title: 'Kehidupan Masa Praaksara', desc: 'Kehidupan Masa Praaksara', detail: 'Pembagian tahapan perkembangan teknologi manusia dari Zaman Batu (Paleolitikum–Megalitikum) hingga Zaman Logam.', img: 'g2.jpeg' },
    { id: 3, title: 'Perkembangan Kerajaan Islam', desc: 'Perkembangan Kerajaan Islam', detail: 'Penyebaran Islam di Indonesia melalui saluran perdagangan, pernikahan, pendidikan, dan dakwah para ulama.', img: 'g3.jpeg' },
    { id: 4, title: 'Perkembangan Kerajaan Hindu-Buddha', desc: 'Perkembangan Kerajaan Hindu-Buddha', detail: 'Teori penyebaran ajaran Hindu-Buddha di Nusantara melalui jalur Brahmana, Ksatria, Waisya, Sudra, dan Arus Balik.', img: 'g4.jpeg' },
  ];

  root.innerHTML = head('Peta Konsep', 'Bagan Hubungan Antarkonsep') +
  `<div class="row g-4 reveal">
    ${mapData.map(item => `
      <div class="col-md-6 col-lg-4">
        <div class="card-x h-100 p-0 overflow-hidden hover-lift style-concept-card" data-act="openConcept" data-id="${item.id}" style="cursor:pointer; border-radius:16px;">
          <div style="height: 160px; overflow:hidden; position:relative;">
            <img src="${item.img}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
          </div>
          <div class="p-3">
            <h5 class="fw-bold mb-1" style="font-family:'Playfair Display',serif;">${item.title}</h5>
            <p class="text-muted small mb-0">${item.desc}</p>
          </div>
        </div>
      </div>
    `).join('')}
  </div>`;

  // Simpan data ke window agar bisa diakses saat diklik
  window.conceptMapData = mapData;
};

PAGES.student.video = root => {
  const videoData = [
    {
      id: 1,
      title: 'Masa Kerajaan Hindu-Buddha',
      desc: 'Teori Masuk & Perkembangan 6 Kerajaan Besar',
      detail: 'Membahas konsep local genius masyarakat Nusantara, 4 teori masuknya ajaran Hindu-Buddha (Brahmana, Waisya, Kesatria, Arus Balik), serta perkembangan 6 kerajaan besar (Kutai, Tarumanagara, Sriwijaya, Mataram Kuno, Singasari, hingga Majapahit) beserta peninggalannya.',
      embedUrl: 'https://www.youtube-nocookie.com/embed/DeJVQ9zA0cE',
      thumb: 'https://img.youtube.com/vi/DeJVQ9zA0cE/hqdefault.jpg'
    },
    {
      id: 2,
      title: 'Pada Masa Kerajaan Islam',
      desc: 'Saluran Penyebaran Dakwah & 8 Kerajaan Islam',
      detail: 'Membahas proses awal masuknya Islam ke Nusantara melalui 6 saluran dakwah (perdagangan, pernikahan, pendidikan, seni budaya, dakwah langsung, dan tasawuf), serta perkembangan 8 kerajaan Islam besar (Samudra Pasai, Aceh, Demak, Banten, Makassar, Mataram Islam, Ternate-Tidore, dan Banjarmasin) beserta peninggalannya.',
      embedUrl: 'https://www.youtube-nocookie.com/embed/WcGCDGM0eVY',
      thumb: 'https://img.youtube.com/vi/WcGCDGM0eVY/hqdefault.jpg'
    },
    {
      id: 3,
      title: 'Perang Padri & Dinamika Nusantara',
      desc: 'Sisi Historis Perang Padri & Pergolakan Tapanuli',
      detail: 'Mengulas sisi historis dan dampak Perang Padri di wilayah Sumatra, pergerakan pasukan Padri di bawah Tuanku Imam Bonjol ke tanah Batak/Tapanuli, pergolakan sosial-agama pra-kolonial, serta dampak migrasi besar-besaran masyarakat Batak Toba pada abad ke-19.',
      embedUrl: 'https://www.youtube-nocookie.com/embed/StVapwlfV2E',
      thumb: 'https://img.youtube.com/vi/StVapwlfV2E/hqdefault.jpg'
    },
    {
      id: 4,
      title: 'Jalan Panjang Manusia Purba',
      desc: 'Migrasi Homo Erectus & Situs Sangiran',
      detail: 'Membahas sejarah migrasi manusia purba (Homo Erectus / Manusia Jawa) yang sampai di Indonesia jutaan tahun lalu, kehidupan di Lembah Bengawan Solo, serta penemuan alat batu kuno di Situs Sangiran yang diakui sebagai warisan budaya dunia oleh UNESCO.',
      embedUrl: 'https://www.youtube-nocookie.com/embed/gLQZT46_ojA',
      thumb: 'https://img.youtube.com/vi/gLQZT46_ojA/hqdefault.jpg'
    }
  ];

  root.innerHTML = head('Video Pembelajaran', 'Visualisasi Dokumenter & Edukasi Sejarah') +
  `<div class="row g-4 reveal">
    ${videoData.map(item => `
      <div class="col-md-6 col-lg-4">
        <div class="card-x h-100 p-0 overflow-hidden hover-lift style-concept-card" data-act="openVideo" data-id="${item.id}" style="cursor:pointer; border-radius:16px;">
          <div style="height: 180px; overflow:hidden; position:relative; background:#000;">
            <img src="${item.thumb}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.85; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.08)'; this.style.opacity='1';" onmouseout="this.style.transform='scale(1)'; this.style.opacity='0.85';">
            <div class="position-absolute top-50 start-50 translate-middle">
              <i class="bi bi-play-circle-fill text-white" style="font-size:3rem; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4));"></i>
            </div>
            <span class="badge-soft primary position-absolute top-0 start-0 m-3">Edukasi</span>
          </div>
          <div class="p-3">
            <h5 class="fw-bold mb-1" style="font-family:'Playfair Display',serif;">${item.title}</h5>
            <p class="text-muted small mb-0">${item.desc}</p>
          </div>
        </div>
      </div>
    `).join('')}
  </div>`;

  // Simpan data video ke objek window
  window.videoListData = videoData;
};
PAGES.student.diskusi = root => {
  root.innerHTML = head('Ruang Diskusi', 'Forum tanya jawab dan tukar pendapat (Bab 3)') +
  `<div class="card-x reveal">
    <div class="chat-box" id="chatContainer">
      <div class="chat-msg">
        <div class="chat-info">Bpk. Ki Hajar D. (Guru) • 08:00</div>
        <div class="chat-bubble">Menurut kalian, mengapa taktik Benteng Stelsel sangat efektif menjepit pergerakan pasukan Diponegoro?</div>
      </div>
      <div class="chat-msg me">
        <div class="chat-info">Kamu • 08:15</div>
        <div class="chat-bubble">Izin menjawab Pak. Karena benteng yang dibangun saling terhubung oleh infrastruktur jalan, sehingga mobilitas pasukan bantuan Belanda jadi jauh lebih cepat.</div>
      </div>
    </div>
    <form id="chatForm" class="d-flex gap-2">
      <input type="text" id="chatInput" class="form-control" placeholder="Ketik pendapat/argumenmu..." required>
      <button type="submit" class="btn btn-accent px-4"><i class="bi bi-send"></i> Kirim</button>
    </form>
  </div>`;
  // Timeout for DOM element binding
  setTimeout(() => {
    const f = $('#chatForm');
    if (f) f.onsubmit = e => {
      e.preventDefault();
      const inp = $('#chatInput'); if (!inp.value.trim()) return;
      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      $('#chatContainer').innerHTML += `<div class="chat-msg me reveal"><div class="chat-info">Kamu • ${time}</div><div class="chat-bubble">${esc(inp.value)}</div></div>`;
      inp.value = ''; $('#chatContainer').scrollTop = $('#chatContainer').scrollHeight;
    };
  }, 100);
};

PAGES.student.presensi = root => {
  root.innerHTML = head('Presensi', 'Pencatatan Kehadiran Siswa Kelas XI') +
  `<div class="card-x reveal text-center p-5">
    <i class="bi bi-fingerprint" style="font-size: 5rem; color:var(--accent);"></i>
    <h3 class="fw-bold mt-3" style="font-family:'Playfair Display',serif;">Daftar Hadir</h3>
    <p class="text-muted mb-4">Jadwal Sesi Pembelajaran Sejarah: 08:00 - 09:30 WIB</p>
    <button class="btn btn-accent btn-lg px-5" data-act="absen" id="btnHadir">Catat Kehadiran Saya</button>
  </div>`;
};

PAGES.student.tugas = root => {
  let tab = ui.sTab || 'Belum';
  root.innerHTML = head('Tugas', 'Kumpulkan tugas analisis sejarah sebelum tenggat ya!') +
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
  root.innerHTML = head('Evaluasi (Kuis)', 'Daftar evaluasi sejarah. Klik kartu kuis untuk langsung mengisi formulir Google Form.') + 
  `<div class="row g-3">
    ${QUIZ_LINKS.map(item => {
      const d = dueInfo(item.due);
      return `
        <div class="col-md-6 col-xl-3 reveal">
          <div class="card-x subj-card hover-lift h-100" data-act="openGform" data-id="${item.id}" style="--c:#8b5a2b; cursor:pointer;">
            <i class="bi bi-file-earmark-text big-ico"></i>
            <div class="icon-bubble mb-3" style="--c:#8b5a2b"><i class="bi bi-file-earmark-text"></i></div>
            <h5 class="fw-bold mb-1" style="font-family:'Playfair Display',serif;">${item.title}</h5>
            <div class="small text-muted mb-3"><i class="bi bi-calendar3"></i> ${fmtDate(item.due)} &nbsp; <i class="bi bi-clock"></i> ${item.duration} menit</div>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <span class="badge-soft ${d.c}">${d.t}</span>
              <button class="btn btn-sm btn-accent" data-act="openGform" data-id="${item.id}">
                Buka <i class="bi bi-box-arrow-up-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>`;
    }).join('')}
  </div>`;
};

PAGES.student.nilai = root => {
  const rows = SUBJECTS.map(s => ({ s, ...getScores('s1', s.id), f: finalOf('s1', s.id) }));
  const avg = avgOf(rows.map(r => r.f)), rank = myRank();
  root.innerHTML = head('Nilai', 'Rekap nilai semester ganjil. Nilai akhir = Tugas 30% + UTS 30% + UAS 40%.') + `
    <div class="row g-3 mb-3">${stat('bi-bar-chart-fill', 'Rata-rata', avg, '#8b5a2b')}${stat('bi-trophy-fill', 'Peringkat kelas', rank, '#f59e0b')}${stat('bi-star-fill', 'Nilai tertinggi', Math.max(...rows.map(r => r.f)), '#27ae60')}${stat('bi-people-fill', 'Jumlah siswa', studentsOf('c1').length, '#c62828')}</div>
    <div class="row g-3"><div class="col-lg-7 reveal"><div class="card-x"><div class="table-responsive"><table class="table-x"><thead><tr><th>Mata pelajaran</th><th>Tugas</th><th>UTS</th><th>UAS</th><th>Akhir</th><th>Pred.</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td><div class="d-flex align-items-center gap-2"><div class="icon-bubble" style="--c:${r.s.color};width:34px;height:34px;font-size:1rem;border-radius:10px"><i class="bi ${r.s.icon}"></i></div><b>${r.s.name}</b></div></td><td>${r.tugas}</td><td>${r.uts}</td><td>${r.uas}</td><td><b>${r.f}</b></td><td><span class="badge-soft ${gradeTone(r.f)}">${predikat(r.f)}</span></td></tr>`).join('')}</tbody></table></div></div></div>
      <div class="col-lg-5 reveal"><div class="card-x h-100"><div class="card-title-x">Grafik Nilai Akhir</div><div style="height:340px"><canvas id="chNilai"></canvas></div></div></div></div>`;
  chart('chNilai', { type: 'bar', data: { labels: rows.map(r => r.s.name), datasets: [{ data: rows.map(r => r.f), backgroundColor: rows.map(r => r.s.color), borderRadius: 8 }] }, options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { min: 50, max: 100 } } } });
};

/* ---------------------------- Pages: UMUM -------------------------- */
function profilePage(root) {
  const u = state.user, isT = state.role === 'teacher';
  const stats = isT ? [[CLASSES.length, 'Kelas'], [STUDENTS.length, 'Siswa'], [8, 'Thn mengajar']] : [[avgOf(SUBJECTS.map(s => finalOf('s1', s.id))), 'Rata-rata'], [myRank(), 'Peringkat'], [studentsOf('c1')[0].attend + '%', 'Kehadiran']];
  
  root.innerHTML = `<div class="profile-banner reveal"></div><div class="row g-3">
    <div class="col-lg-4 reveal"><div class="card-x text-center profile-card">${avatar(u.name, 80)}<h4 class="fw-bold mt-3 mb-4" style="font-family:'Playfair Display',serif;">${esc(u.name)}</h4><p class="text-muted mb-2">${isT ? 'Guru Sejarah (Guru Penggerak)' : 'Siswa ' + u.className}</p><span class="badge-soft primary">${isT ? 'NIP ' + u.id : 'NIS ' + u.id}</span>
      <div class="mini-stats">${stats.map(s => `<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div></div></div>
    <div class="col-lg-8 reveal">
    ${isT ? `
      <div class="card-x mb-3">
        <h5 class="fw-bold border-bottom pb-2" style="font-family:'Playfair Display',serif;">Kutipan Inspiratif</h5>
        <blockquote class="text-muted fst-italic mt-2" style="border-left: 4px solid var(--accent); padding-left:15px;">"لا تحتقر من دونك فلكلّ شيئ مزيّة"</blockquote>
        
<!-- BAGIAN PERANGKAT PEMBELAJARAN & CV GURU -->
        <h6 class="fw-bold mt-4 mb-2" style="font-family:'Playfair Display',serif;"><i class="bi bi-file-earmark-person me-1"></i> Berkas & Perangkat Guru</h6>
        <div class="row g-2">
          <!-- Kata Pengantar -->
          <div class="col-md-6">
            <div class="list-row p-2 border rounded-3 d-flex align-items-center gap-2">
              <div class="icon-bubble flex-shrink-0" style="width:36px; height:36px; font-size:1.1rem;"><i class="bi bi-file-earmark-pdf text-danger"></i></div>
              <div class="flex-grow-1 min-w-0">
                <div class="fw-bold text-truncate small">Kata Pengantar</div>
                <small class="text-muted d-block" style="font-size:0.75rem;">Kata Pengantar</small>
              </div>
              <button class="btn btn-light-x btn-sm px-2 flex-shrink-0" data-act="viewRpp" data-doc="pengantar" title="Lihat Kata Pengantar"><i class="bi bi-eye"></i> Lihat</button>
            </div>
          </div>

          <!-- CV Guru -->
          <div class="col-md-6">
            <div class="list-row p-2 border rounded-3 d-flex align-items-center gap-2">
              <div class="icon-bubble flex-shrink-0" style="width:36px; height:36px; font-size:1.1rem;"><i class="bi bi-person-badge text-success"></i></div>
              <div class="flex-grow-1 min-w-0">
                <div class="fw-bold text-truncate small">CV Guru</div>
                <small class="text-muted d-block" style="font-size:0.75rem;">Curriculum Vitae</small>
              </div>
              <button class="btn btn-light-x btn-sm px-2 flex-shrink-0" data-act="viewRpp" data-doc="cv" title="Lihat CV"><i class="bi bi-eye"></i> Lihat</button>
            </div>
          </div>

          <!-- RPP K13 -->
          <div class="col-md-6">
            <div class="list-row p-2 border rounded-3 d-flex align-items-center gap-2">
              <div class="icon-bubble flex-shrink-0" style="width:36px; height:36px; font-size:1.1rem;"><i class="bi bi-file-earmark-pdf text-danger"></i></div>
              <div class="flex-grow-1 min-w-0">
                <div class="fw-bold text-truncate small">RPP K13 (4 Materi)</div>
                <small class="text-muted d-block" style="font-size:0.75rem;">Sejarah Kelas XI</small>
              </div>
              <button class="btn btn-light-x btn-sm px-2 flex-shrink-0" data-act="viewRpp" data-doc="k13" title="Pratinjau RPP"><i class="bi bi-eye"></i> Lihat</button>
            </div>
          </div>

          <!-- Modul Kurikulum Merdeka -->
          <div class="col-md-6">
            <div class="list-row p-2 border rounded-3 d-flex align-items-center gap-2">
              <div class="icon-bubble flex-shrink-0" style="width:36px; height:36px; font-size:1.1rem;"><i class="bi bi-file-earmark-richtext text-primary"></i></div>
              <div class="flex-grow-1 min-w-0">
                <div class="fw-bold text-truncate small">Modul Merdeka</div>
                <small class="text-muted d-block" style="font-size:0.75rem;">Sejarah Kelas XI</small>
              </div>
              <button class="btn btn-light-x btn-sm px-2 flex-shrink-0" data-act="viewRpp" data-doc="merdeka" title="Pratinjau Modul"><i class="bi bi-eye"></i> Lihat</button>
            </div>
          </div>
        </div>
      ` : ''}
      <div class="card-x"><h5 class="fw-bold mb-3" style="font-family:'Playfair Display',serif;">Informasi Pribadi</h5><form id="profForm" class="row g-3">
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
  root.innerHTML = head('Pengaturan', 'Sesuaikan tampilan arsip dan preferensi.') + `<div class="row g-3"><div class="col-lg-7 reveal"><div class="card-x">
    <div class="set-row"><div><div class="fw-bold">Mode gelap</div><small class="text-muted">Nyaman untuk baca di malam hari</small></div><div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" data-set="theme" ${settings.theme === 'dark' ? 'checked' : ''}></div></div>
    <div class="set-row"><div><div class="fw-bold">Warna aksen</div><small class="text-muted">Pilih warna utama</small></div><div class="d-flex gap-2">${Object.entries(ACCENTS).map(([k, v]) => `<span class="swatch ${settings.accent === k ? 'active' : ''}" data-act="accent" data-k="${k}" style="background:linear-gradient(135deg,${v[0]},${v[1]})" title="${k}"></span>`).join('')}</div></div>
    <div class="set-row"><div><div class="fw-bold">Animasi</div><small class="text-muted">Matikan jika kurang lancar</small></div><div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" data-set="anim" ${settings.anim ? 'checked' : ''}></div></div>
    <div class="set-row"><div><div class="fw-bold">Ukuran teks</div><small class="text-muted">Atur bacaan sejarah</small></div><select class="form-select" style="width:140px" data-set="font"><option value="sm" ${settings.font === 'sm' ? 'selected' : ''}>Kecil</option><option value="md" ${settings.font === 'md' ? 'selected' : ''}>Sedang</option><option value="lg" ${settings.font === 'lg' ? 'selected' : ''}>Besar</option></select></div>
    <div class="set-row"><div><div class="fw-bold">Notifikasi email</div><small class="text-muted">Kirim tugas ke email</small></div><div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" data-set="emailNotif" ${settings.emailNotif ? 'checked' : ''}></div></div></div></div>
    <div class="col-lg-5 reveal"><div class="card-x"><h5 class="fw-bold">Akun</h5><p class="text-muted small">Masuk sebagai <b>${esc(state.user.name)}</b> (${state.role === 'teacher' ? 'Guru' : 'Siswa'}).</p>
      <div class="d-grid gap-2"><button class="btn btn-light-x py-2" data-act="resetDemo"><i class="bi bi-arrow-counterclockwise"></i> Reset data demo</button><button class="btn btn-danger py-2" data-act="logout"><i class="bi bi-box-arrow-right"></i> Keluar</button></div></div></div></div>`;
};
/* ---------------------------- Actions ------------------------------ */
const ACTIONS = {
  go: d => go(d.page),
  goBack: () => {
    if (state.history.length > 1) {
      state.history.pop();
      const prevPage = state.history[state.history.length - 1];
      state.page = prevPage;
      killCharts();
      const root = $('#content');
      root.classList.remove('page-enter'); void root.offsetWidth; root.classList.add('page-enter');
      const fn = (PAGES[state.role] && PAGES[state.role][prevPage]) || PAGES.common[prevPage] || PAGES[state.role].dashboard;
      fn(root);
      post(root);
      renderSidebar();
    } else { go('dashboard'); }
  },
  toggleSidebar: () => { $('#sidebar').classList.toggle('open'); },
  theme: () => { settings.theme = settings.theme === 'dark' ? 'light' : 'dark'; applySettings(); renderTop(); go(state.page); },
  accent: d => { settings.accent = d.k; applySettings(); go('pengaturan'); },
  logout: () => {
    store.del('session');
    $('#appView').classList.add('d-none');
    const lv = $('#loginView'); lv.classList.remove('d-none', 'leaving');
    setRole(state.role || 'student'); resetLoginBtn();
    state.role = null; killCharts(); state.history = ['dashboard'];
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
    body: `<form id="matForm" class="row g-3"><div class="col-12"><label class="form-label small fw-semibold">Judul materi</label><input class="form-control" name="title" placeholder="mis. Taktik Gerilya" required></div>
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
  absen: () => {
    const btn = $('#btnHadir'); if(btn) btn.innerHTML = `<span class="badge-soft success"><i class="bi bi-check2"></i> Hadir Tercatat</span>`;
    toast('Presensi berhasil disimpan ke dalam arsip.', 'success');
  },
  viewRpp: d => {
    let title, pdfUrl, fileName, desc;
    
    if (d.doc === 'pengantar') {
      title = 'Kata Pengantar';
      pdfUrl = 'Kp.pdf'; // Nama file word/dokumen kamu
      fileName = 'Kata Pengantar';
      desc = 'Kata pengantar perangkat pembelajaran Sejarah Indonesia.';
    } else if (d.doc === 'cv') {
      title = 'Curriculum Vitae (CV) - Pak Kamal Aminullah, S.Pd.';
      pdfUrl = 'cvkamal.pdf';
      fileName = 'cvkamal.pdf';
      desc = 'Profil profesional, riwayat pendidikan, dan pengalaman mengajar Guru Sejarah.';
    } else if (d.doc === 'k13') {
      title = 'RPP K13 - Sejarah Indonesia Kelas XI';
      pdfUrl = 'RPP_K13 (1).pdf';
      fileName = 'RPP_K13_Sejarah_Kelas_XI.pdf';
      desc = 'Perangkat pembelajaran resmi untuk pengajar Sejarah Kelas XI.';
    } else {
      title = 'Modul Ajar Kurikulum Merdeka - Sejarah XI';
      pdfUrl = 'RPP_KUR MERDEKA (1).pdf';
      fileName = 'Modul_Ajar_Kurikulum_Merdeka.pdf';
      desc = 'Modul ajar Kurikulum Merdeka Sejarah Kelas XI.';
    }

    const isDocx = pdfUrl.endsWith('.docx');

    openModal({
      title: `<span style="font-family:'Playfair Display',serif;">${esc(title)}</span>`,
      size: 'modal-xl',
      body: `
        <!-- Alert Banner Atas Lengkap Dengan Tombol Unduh -->
        <div class="d-flex justify-content-between align-items-center alert alert-warning small py-2 mb-3">
          <span><i class="bi bi-${isDocx ? 'file-earmark-word' : 'file-earmark-pdf'} me-1"></i> ${desc}</span>
          <a href="${pdfUrl}" download="${fileName}" class="btn btn-accent btn-sm rounded-pill px-3 flex-shrink-0" onclick="toast('Mengunduh dokumen...')">
            <i class="bi bi-download me-1"></i> Unduh ${isDocx ? 'DOCX' : 'PDF'}
          </a>
        </div>
        
        <!-- Pratinjau Dokumen -->
        <div class="ratio ratio-16x9 rounded-3 overflow-hidden border shadow-sm">
          ${isDocx 
            ? `<div class="d-flex flex-column align-items-center justify-content-center bg-light p-4 text-center">
                <i class="bi bi-file-earmark-word text-primary" style="font-size: 4rem;"></i>
                <h5 class="fw-bold mt-2">${esc(fileName)}</h5>
                <p class="text-muted small">File Word (.docx) dapat langsung diunduh untuk dibaca secara utuh.</p>
                <a href="${pdfUrl}" download="${fileName}" class="btn btn-primary rounded-pill px-4"><i class="bi bi-download me-1"></i> Unduh File Word</a>
               </div>`
            : `<iframe src="${pdfUrl}#toolbar=1&navpanes=0" style="border:0;" allowfullscreen></iframe>`
          }
        </div>
      `,
      footer: `<button class="btn btn-light-x rounded-pill px-4" data-bs-dismiss="modal">Tutup</button>`
    });
  },
  /* siswa */
  goSubj: d => { ui.materiSubject = d.id; go('materi'); },
  openMat: d => {
    const m = MATERIALS.find(x => x.id == d.id),
          [ic, col] = TYPE[m.type],
          s = subj(m.subject),
          done = READ.has(m.id);

    const raw = (m.url || '').trim();
    const fileUrl = raw && raw !== '#' ? raw : '';

    const box = fileUrl
      ? `<a href="${esc(fileUrl)}" target="_blank" rel="noopener noreferrer" class="d-block text-decoration-none p-4 mb-3 text-center" style="background:color-mix(in srgb,${col} 10%,transparent); border-radius:18px; cursor:pointer; transition: transform .2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
           <i class="bi ${ic}" style="font-size:4.5rem; color:${col}"></i>
           <div class="fw-bold mt-2" style="color:var(--text)">${m.type} · ${m.size}</div>
           <small class="text-muted d-block mt-1"><i class="bi bi-box-arrow-up-right me-1"></i> Klik untuk membuka / mengunduh materi</small>
         </a>`
      : `<div class="p-4 mb-3 text-center" style="background:color-mix(in srgb,${col} 10%,transparent); border-radius:18px;">
           <i class="bi ${ic}" style="font-size:4.5rem; color:${col}"></i>
           <div class="fw-bold mt-2">${m.type} · ${m.size}</div>
           <small class="text-muted d-block mt-1">File belum tersedia</small>
         </div>`;

    openModal({
      title: esc(m.title),
      body: `
        ${box}
        <div class="d-flex justify-content-between small"><span class="text-muted">Mata pelajaran</span><b>${s ? s.name : '-'}</b></div>
        <div class="d-flex justify-content-between small mt-1"><span class="text-muted">Pengajar</span><b>${s ? s.teacher : '-'}</b></div>
        <div class="d-flex justify-content-between small mt-1"><span class="text-muted">Diunggah</span><b>${fmtDate(m.date)}</b></div>`,
      footer: `
        <button class="btn btn-light-x" data-bs-dismiss="modal">Tutup</button>
        <button class="btn btn-accent px-4" data-act="readMat" data-id="${m.id}" ${done ? 'disabled' : ''}>
          ${done ? '<i class="bi bi-check2"></i> Sudah dibaca' : 'Tandai selesai dibaca'}
        </button>`
    });
  },
  openVideo: d => {
    const item = (window.videoListData || []).find(x => x.id == d.id);
    if (!item) return;

    openModal({
      title: `<span style="font-family:-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; font-weight:700; font-size:1.25rem;">${item.title}</span>`,
      size: 'modal-lg',
      body: `
        <div class="ratio ratio-16x9 rounded-4 overflow-hidden mb-3 shadow-sm bg-black">
          <iframe src="${item.embedUrl}" title="${item.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="px-2">
          <span class="badge rounded-pill bg-light text-dark border px-3 py-2 mb-3" style="font-size:0.85rem;">
            <i class="bi bi-info-circle me-1 text-primary"></i> ${item.desc}
          </span>
          <p class="lh-base mt-2 mb-0" style="font-size:1.05rem; color:var(--text); opacity:0.95;">${item.detail}</p>
        </div>
      `,
      footer: `<button class="btn btn-dark rounded-pill px-4 py-2 fw-semibold" data-bs-dismiss="modal" style="font-size:0.9rem;">Tutup</button>`
    });
  },
  openConcept: d => {
    const item = (window.conceptMapData || []).find(x => x.id == d.id);
    if (!item) return;

    openModal({
      title: `<span style="font-family:-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-weight:700; font-size:1.25rem;">${item.title}</span>`,
      size: 'modal-lg',
      body: `
        <!-- Gambar dibuat utuh (contain) agar foto tidak terpotong -->
        <div class="rounded-4 overflow-hidden mb-3 shadow-sm bg-light text-center" style="max-height: 380px;">
          <img src="${item.img}" alt="${item.title}" style="width:100%; max-height:380px; object-fit:contain;">
        </div>
        <div class="px-2">
          <span class="badge rounded-pill bg-light text-dark border px-3 py-2 mb-3" style="font-size:0.85rem;">
            <i class="bi bi-info-circle me-1 text-primary"></i> ${item.desc}
          </span>
          <p class="lh-base mt-2 mb-0" style="font-size:1.05rem; color:var(--text); opacity:0.95;">${item.detail}</p>
        </div>
      `,
      footer: `<button class="btn btn-dark rounded-pill px-4 py-2 fw-semibold" data-bs-dismiss="modal" style="font-size:0.9rem;">Tutup</button>`
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
  openGform: d => {
    const item = QUIZ_LINKS.find(x => x.id == d.id);
    if (item && item.url) {
      window.open(item.url, '_blank');
    }
  },
  startExam: d => {
    const item = QUIZ_LINKS.find(x => x.id == d.id) || QUIZ_LINKS[0];
    if (item && item.url) {
      window.open(item.url, '_blank');
    }
  }
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
    CLASSES.forEach(c => push('Kelas ' + c.name, 'Sejarah · ' + c.room, 'bi-people', 'kelas'));
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
  box.innerHTML = res.length ? res.map(x => `<div class="sr-item" data-page="${x.p}"><div class="icon-bubble" style="width:36px;height:36px;font-size:1rem;border-radius:10px"><i class="bi ${x.i}"></i></div><div><div class="fw-semibold">${hl(x.l, q)}</div><small>${esc(x.s)}</small></div></div>`).join('') : '<div class="empty py-4"><i class="bi bi-search"></i>Tidak ada arsip yang cocok</div>';
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
    const b = $('#loginBtn'); b.disabled = true; b.innerHTML = '<span class="spinner-x"></span>Tunggu sebentar…';
    setTimeout(() => { if ($('#remember').checked) store.set('session', r); startApp(r, true); }, 900);
    return;
  }
  err.classList.remove('d-none'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
});

function startApp(role, animated) {
  state.role = role; state.user = USERS[role]; state.page = 'dashboard'; state.history = ['dashboard'];
  const lv = $('#loginView');
  const show = () => { lv.classList.add('d-none'); $('#appView').classList.remove('d-none'); renderSidebar(); renderTop(); go('dashboard'); };
  if (animated && settings.anim) { lv.classList.add('leaving'); setTimeout(show, 450); } else show();
}

function typeEffect() {
  const words = ['interaktif', 'mendalam', 'menarik', 'bermakna'], el = $('#typed'); let w = 0, c = 0, del = false;
  if(!el) return;
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