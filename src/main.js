import './style.css';
import { getState, resetData, getFilter, setFilter } from './store.js';
import { taskCard, statsSummary, toast, confirmDialog, escapeHtml } from './ui.js';
import { filterTasks } from './filters.js';
import { getSeed } from './tasks.js';
import { OWNER_WHATSAPP_NUMBER } from './config.js';
import { buildWhatsAppUrl } from './whatsapp.js';

const app = document.getElementById('app');

function render() {
  const state = getState();
  const projects = state.projects;
  const members = state.members;
  const criteria = getFilter();
  const filtered = filterTasks(state.tasks, criteria);
  const isFilterEmpty = filtered.length === 0 && state.tasks.length > 0;
  const isEmptyAll = state.tasks.length === 0;

  const memberOptions = members.map(m => `<option value="${m.id}">${escapeHtml(m.nama)}</option>`).join('');
  const cards = filtered.map(t => taskCard(t, projects.find(p=>p.id===t.projectId), members.find(m=>m.id===t.assigneeId))).join('');

  app.innerHTML = `
    <header class="navbar"><span class="logo">TugasKita</span><nav><a href="#tim" aria-current="page">Tim</a><a href="#dashboard">Dashboard</a><button id="resetBtn">Reset data contoh</button></nav></header>
    <main id="tim">
      <section class="hero"><h1>Kelola tugas tim tanpa tumpang tindih</h1><p>Lihat siapa mengerjakan apa, kapan.</p><div class="hero-cta"><a href="#daftar" class="btn-primary">Lihat daftar tugas</a><a href="#dashboard" class="btn-secondary">Buka dashboard demo</a></div></section>
      <div class="layout">
        <aside class="filters">
          <label>Cari <input id="search" type="search" value="${escapeHtml(criteria.query)}" placeholder="Cari judul atau deskripsi…" /></label>
          <fieldset><legend>Status</legend>
            ${['To Do','In Progress','Review','Done'].map(s=>`<label><input type="checkbox" data-status="${s}" ${criteria.status.includes(s)?'checked':''}/> ${s}</label>`).join('')}
          </fieldset>
          <fieldset><legend>Prioritas</legend>
            ${['High','Medium','Low'].map(p=>`<label><input type="checkbox" data-prio="${p}" ${criteria.prioritas.includes(p)?'checked':''}/> ${p}</label>`).join('')}
          </fieldset>
          <label>Assignee <select id="assignee">
            <option value="all" ${criteria.assigneeId==='all'?'selected':''}>Semua</option>
            <option value="none" ${criteria.assigneeId==='none'?'selected':''}>Tanpa assignee</option>
            ${memberOptions}
          </select></label>
          <label>Urutkan <select id="sort">
            <option value="deadline" ${criteria.sortBy==='deadline'?'selected':''}>Deadline terdekat</option>
            <option value="prioritas" ${criteria.sortBy==='prioritas'?'selected':''}>Prioritas tertinggi</option>
            <option value="estimasi" ${criteria.sortBy==='estimasi'?'selected':''}>Estimasi jam terbesar</option>
            <option value="judul" ${criteria.sortBy==='judul'?'selected':''}>Judul A–Z</option>
          </select></label>
          <button id="clearAll">Hapus semua filter</button>
        </aside>
        <section id="daftar" class="results">
          <div aria-live="polite">${filtered.length} tugas ditampilkan</div>
          ${isEmptyAll ? '<div class="empty">Belum ada tugas. Tambah tugas pertama di dashboard demo.</div>' : ''}
          ${isFilterEmpty ? '<div class="empty">Tidak ada tugas yang cocok. <button id="clearFilters">Hapus semua filter</button></div>' : ''}
          <div class="task-grid">${cards}</div>
        </section>
      </div>
      <section id="dashboard" class="dashboard"><h2>Dashboard demo</h2><p>Total tugas: ${state.tasks.length}, anggota: ${state.members.length}</p></section>
    </main>
  `;

  const search = document.getElementById('search');
  let timer;
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { setFilter({ query: search.value }); render(); }, 150);
  });

  document.querySelectorAll('[data-status]').forEach(cb => {
    cb.addEventListener('change', () => {
      const s = getFilter().status.slice();
      const v = cb.dataset.status;
      if (cb.checked) { if (!s.includes(v)) s.push(v); } else { const i=s.indexOf(v); if(i>=0) s.splice(i,1); }
      setFilter({ status: s }); render();
    });
  });
  document.querySelectorAll('[data-prio]').forEach(cb => {
    cb.addEventListener('change', () => {
      const s = getFilter().prioritas.slice();
      const v = cb.dataset.prio;
      if (cb.checked) { if (!s.includes(v)) s.push(v); } else { const i=s.indexOf(v); if(i>=0) s.splice(i,1); }
      setFilter({ prioritas: s }); render();
    });
  });
  document.getElementById('assignee').addEventListener('change', e => { setFilter({ assigneeId: e.target.value }); render(); });
  document.getElementById('sort').addEventListener('change', e => { setFilter({ sortBy: e.target.value }); render(); });
  document.getElementById('clearAll').addEventListener('click', () => { setFilter({ query:'', status:[], prioritas:[], assigneeId:'all', sortBy:'deadline' }); render(); });
  const cf = document.getElementById('clearFilters');
  if (cf) cf.addEventListener('click', () => { setFilter({ query:'', status:[], prioritas:[], assigneeId:'all', sortBy:'deadline' }); render(); });

  document.getElementById('resetBtn').addEventListener('click', async () => {
    const ok = await confirmDialog('Reset data contoh', 'Semua perubahan akan hilang dan 8 tugas contoh dimuat ulang.');
    if (ok) { resetData(); setFilter({ query:'', status:[], prioritas:[], assigneeId:'all', sortBy:'deadline' }); render(); toast('Data direset'); }
  });

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const t = state.tasks.find(x=>x.id===btn.dataset.copy);
      const text = `${t.judul} — ${projects.find(p=>p.id===t.projectId)?.nama} | Assignee: ${members.find(m=>m.id===t.assigneeId)?.nama || 'Open'} | Status: ${t.status} | Deadline: ${t.deadline || '—'} | Estimasi: ${t.estimasiJam} jam`;
      try { await navigator.clipboard.writeText(text); toast('Ringkasan disalin.'); } catch(e){ toast('Gagal menyalin.'); }
    });
  });

  document.querySelectorAll('[data-wa]').forEach(btn => {
    const t = state.tasks.find(x=>x.id===btn.dataset.wa);
    const project = projects.find(p=>p.id===t.projectId);
    const member = members.find(m=>m.id===t.assigneeId);
    const url = buildWhatsAppUrl(OWNER_WHATSAPP_NUMBER, { ...t, projectName: project?.nama, assigneeName: member?.nama });
    if (!url || t.status === 'Done' || t.assigneeId === null) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled','true');
      btn.title = t.status === 'Done' ? 'Tugas sudah selesai' : (t.assigneeId === null ? 'Belum ada assignee' : 'Nomor WhatsApp belum dikonfigurasi');
    } else {
      btn.addEventListener('click', () => window.open(url, '_blank', 'noopener,noreferrer'));
    }
  });
}

render();
window.__seed = getSeed();
console.log('seed tasks:', getState().tasks.length);