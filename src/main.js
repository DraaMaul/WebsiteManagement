import './style.css';
import { getState, resetData, getFilter, setFilter } from './store.js';
import { taskCard, statsSummary, toast, confirmDialog, showDetailModal, escapeHtml } from './ui.js';
import { filterTasks } from './filters.js';
import { getSeed } from './tasks.js';
import { OWNER_WHATSAPP_NUMBER } from './config.js';
import { buildWhatsAppUrl } from './whatsapp.js';
import renderDashboard from './dashboard.js';

const app = document.getElementById('app');

function route() {
  const hash = location.hash.replace('#', '') || 'tim';
  return hash;
}

function render() {
  const state = getState();
  const projects = state.projects || [];
  const members = state.members || [];
  const r = route();

  const nav = `
    <header class="navbar">
      <div class="navbar-container">
        <a href="#tim" class="brand">
          <div class="brand-icon">✓</div>
          <span class="logo">
            TugasKita
            <span class="logo-badge">Pro</span>
          </span>
        </a>
        <nav class="nav-links">
          <a href="#tim" class="${r === 'tim' ? 'active' : ''}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Tim
          </a>
          <a href="#tugas" class="${r === 'tugas' ? 'active' : ''}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Tugas
          </a>
          <a href="#dashboard" class="${r === 'dashboard' || r === 'anggota' ? 'active' : ''}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            Dashboard
          </a>
        </nav>
        <div class="nav-actions">
          <button id="resetBtn" class="btn-ghost btn-sm" title="Kembalikan ke data contoh awal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Reset data
          </button>
        </div>
      </div>
    </header>
  `;

  if (r === 'dashboard' || r === 'anggota') {
    app.innerHTML = `
      ${nav}
      <main id="dashboardView">
        <div id="dashboardRoot"></div>
      </main>
    `;
    const dr = document.getElementById('dashboardRoot');
    if (dr) renderDashboard(dr);
  } else {
    // Both 'tim' and 'tugas' show the full interactive team task view
    const criteria = getFilter();
    const filtered = filterTasks(state.tasks, criteria);
    const isFilterEmpty = filtered.length === 0 && state.tasks.length > 0;
    const isEmptyAll = state.tasks.length === 0;
    const memberOptions = members.map(m => `<option value="${m.id}" ${criteria.assigneeId === m.id ? 'selected' : ''}>${escapeHtml(m.nama)}</option>`).join('');
    const cards = filtered.map(t => taskCard(t, projects.find(p => p.id === t.projectId), members.find(m => m.id === t.assigneeId))).join('');

    app.innerHTML = `
      ${nav}
      <main id="mainView">
        <section class="hero">
          <div class="hero-content">
            <h1>Kelola Tugas Tim Tanpa Tumpang Tindih</h1>
            <p>Pantau siapa mengerjakan apa, status progres, dan estimasi beban kerja secara terstruktur dalam satu pandangan.</p>
            <div class="hero-cta">
              <a href="#tugas" class="btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Eksplorasi Tugas
              </a>
              <a href="#dashboard" class="btn-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                Kelola di Dashboard
              </a>
            </div>
          </div>
        </section>

        ${statsSummary(state)}

        <div class="layout">
          <aside class="filters">
            <div class="filters-header">
              <span class="filters-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filter Tugas
              </span>
              <button id="clearAll" class="btn-ghost btn-sm" title="Hapus semua filter aktif">Reset</button>
            </div>

            <div class="filter-group">
              <label for="search">
                Pencarian
                <input id="search" type="search" value="${escapeHtml(criteria.query)}" placeholder="Cari judul atau kata kunci..." />
              </label>
            </div>

            <div class="filter-group">
              <fieldset>
                <legend>Status Tugas</legend>
                ${['To Do', 'In Progress', 'Review', 'Done'].map(s => `
                  <label class="checkbox-label">
                    <input type="checkbox" data-status="${s}" ${criteria.status.includes(s) ? 'checked' : ''}/>
                    <span class="chip-dot" style="background:${s === 'To Do' ? '#2B4764' : s === 'In Progress' ? '#1E429F' : s === 'Review' ? '#854D0E' : '#03543F'}"></span>
                    ${s}
                  </label>
                `).join('')}
              </fieldset>
            </div>

            <div class="filter-group">
              <fieldset>
                <legend>Tingkat Prioritas</legend>
                ${['High', 'Medium', 'Low'].map(p => `
                  <label class="checkbox-label">
                    <input type="checkbox" data-prio="${p}" ${criteria.prioritas.includes(p) ? 'checked' : ''}/>
                    ${p}
                  </label>
                `).join('')}
              </fieldset>
            </div>

            <div class="filter-group">
              <label for="assignee">
                Penanggung Jawab (Assignee)
                <select id="assignee">
                  <option value="all" ${criteria.assigneeId === 'all' ? 'selected' : ''}>Semua Anggota</option>
                  <option value="none" ${criteria.assigneeId === 'none' ? 'selected' : ''}>Tanpa Assignee (Open)</option>
                  ${memberOptions}
                </select>
              </label>
            </div>

            <div class="filter-group">
              <label for="sort">
                Urutan Tampilan
                <select id="sort">
                  <option value="deadline" ${criteria.sortBy === 'deadline' ? 'selected' : ''}>Deadline Terdekat</option>
                  <option value="prioritas" ${criteria.sortBy === 'prioritas' ? 'selected' : ''}>Prioritas Tertinggi</option>
                  <option value="estimasi" ${criteria.sortBy === 'estimasi' ? 'selected' : ''}>Estimasi Jam Terbesar</option>
                  <option value="judul" ${criteria.sortBy === 'judul' ? 'selected' : ''}>Judul (A–Z)</option>
                </select>
              </label>
            </div>
          </aside>

          <section id="daftar" class="results">
            <div class="results-header">
              <div class="results-count" aria-live="polite">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Menampilkan <strong>${filtered.length}</strong> dari ${state.tasks.length} tugas
              </div>
            </div>

            ${isEmptyAll ? `
              <div class="empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <h3>Belum Ada Tugas Tersimpan</h3>
                <p>Mulai tambahkan tugas tim pertama melalui panel dashboard demo.</p>
                <a href="#dashboard" class="btn-primary">Buka Dashboard</a>
              </div>
            ` : ''}

            ${isFilterEmpty ? `
              <div class="empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <h3>Tidak Ada Tugas Yang Cocok</h3>
                <p>Coba sesuaikan kata kunci pencarian atau kombinasi filter Anda.</p>
                <button id="clearFilters" class="btn-secondary">Hapus Semua Filter</button>
              </div>
            ` : ''}

            <div class="task-grid">
              ${cards}
            </div>
          </section>
        </div>
      </main>
    `;
    bindTaskEvents(state, projects, members);
  }

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      const ok = await confirmDialog('Reset Data Contoh?', 'Semua modifikasi akan dibatalkan dan 8 tugas contoh awal akan dimuat ulang.');
      if (ok) {
        resetData();
        setFilter({ query: '', status: [], prioritas: [], assigneeId: 'all', sortBy: 'deadline' });
        render();
        toast('Data berhasil dipulihkan ke set contoh awal.');
      }
    });
  }
}

function bindTaskEvents(state, projects, members) {
  const search = document.getElementById('search');
  let timer;
  if (search) {
    search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setFilter({ query: search.value });
        render();
      }, 150);
    });
  }

  document.querySelectorAll('[data-status]').forEach(cb => {
    cb.addEventListener('change', () => {
      const s = getFilter().status.slice();
      const v = cb.dataset.status;
      if (cb.checked) {
        if (!s.includes(v)) s.push(v);
      } else {
        const i = s.indexOf(v);
        if (i >= 0) s.splice(i, 1);
      }
      setFilter({ status: s });
      render();
    });
  });

  document.querySelectorAll('[data-prio]').forEach(cb => {
    cb.addEventListener('change', () => {
      const s = getFilter().prioritas.slice();
      const v = cb.dataset.prio;
      if (cb.checked) {
        if (!s.includes(v)) s.push(v);
      } else {
        const i = s.indexOf(v);
        if (i >= 0) s.splice(i, 1);
      }
      setFilter({ prioritas: s });
      render();
    });
  });

  const assignee = document.getElementById('assignee');
  if (assignee) {
    assignee.addEventListener('change', e => {
      setFilter({ assigneeId: e.target.value });
      render();
    });
  }

  const sort = document.getElementById('sort');
  if (sort) {
    sort.addEventListener('change', e => {
      setFilter({ sortBy: e.target.value });
      render();
    });
  }

  const clearAll = document.getElementById('clearAll');
  if (clearAll) {
    clearAll.addEventListener('click', () => {
      setFilter({ query: '', status: [], prioritas: [], assigneeId: 'all', sortBy: 'deadline' });
      render();
    });
  }

  const cf = document.getElementById('clearFilters');
  if (cf) {
    cf.addEventListener('click', () => {
      setFilter({ query: '', status: [], prioritas: [], assigneeId: 'all', sortBy: 'deadline' });
      render();
    });
  }

  // Detail Modal
  document.querySelectorAll('[data-detail]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = state.tasks.find(x => x.id === btn.dataset.detail);
      if (!t) return;
      const project = projects.find(p => p.id === t.projectId);
      const member = members.find(m => m.id === t.assigneeId);
      showDetailModal(t, project, member);
    });
  });

  // Copy Task Summary
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const t = state.tasks.find(x => x.id === btn.dataset.copy);
      if (!t) return;
      const text = `${t.judul} — ${projects.find(p => p.id === t.projectId)?.nama || 'Umum'} | Assignee: ${members.find(m => m.id === t.assigneeId)?.nama || 'Open'} | Status: ${t.status} | Deadline: ${t.deadline || '—'} | Estimasi: ${t.estimasiJam} jam`;
      try {
        await navigator.clipboard.writeText(text);
        toast('Ringkasan disalin ke clipboard.');
      } catch (e) {
        toast('Gagal menyalin ringkasan.');
      }
    });
  });

  // WhatsApp Action
  document.querySelectorAll('[data-wa]').forEach(btn => {
    const t = state.tasks.find(x => x.id === btn.dataset.wa);
    if (!t) return;
    const project = projects.find(p => p.id === t.projectId);
    const member = members.find(m => m.id === t.assigneeId);
    const url = buildWhatsAppUrl(OWNER_WHATSAPP_NUMBER, { ...t, projectName: project?.nama, assigneeName: member?.nama });
    if (!url || t.status === 'Done' || t.assigneeId === null) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.title = t.status === 'Done' ? 'Tugas sudah selesai' : (t.assigneeId === null ? 'Belum ada assignee' : 'Nomor WhatsApp belum dikonfigurasi');
    } else {
      btn.addEventListener('click', () => window.open(url, '_blank', 'noopener,noreferrer'));
    }
  });
}

window.addEventListener('hashchange', render);
render();
window.__seed = getSeed();
