import {
  getState,
  addTask,
  updateTask,
  deleteTask,
  addMember,
  updateMember,
  deleteMember,
  resetData,
  exportState,
  importState
} from './store.js';
import { escapeHtml, confirmDialog, toast, avatar } from './ui.js';

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export function renderDashboard(root) {
  const state = getState();
  const tasks = state.tasks || [];
  const members = state.members || [];
  const projects = state.projects || [];

  const totalTasks = tasks.length;
  const totalJam = tasks.reduce((a, t) => a + (Number(t.estimasiJam) || 0), 0);
  const doneTasks = tasks.filter(t => t.status === 'Done').length;

  const memberWorkloads = members.map(m => {
    const assignedTasks = tasks.filter(t => t.assigneeId === m.id);
    const jam = assignedTasks.reduce((a, t) => a + (Number(t.estimasiJam) || 0), 0);
    const capacity = m.kapasitasJamMingguan || 40;
    const ratio = jam / capacity;
    let category = 'Available';
    let statusClass = 'success';

    if (ratio > 0.9) {
      category = 'Overload';
      statusClass = 'danger';
    } else if (ratio >= 0.7) {
      category = 'Normal';
      statusClass = 'warning';
    }

    return {
      member: m,
      jam,
      capacity,
      ratio,
      pct: Math.round(ratio * 100),
      category,
      statusClass,
      taskCount: assignedTasks.length
    };
  });

  const overloadCount = memberWorkloads.filter(w => w.category === 'Overload').length;

  const countToDo = tasks.filter(t => t.status === 'To Do').length;
  const countInProg = tasks.filter(t => t.status === 'In Progress').length;
  const countReview = tasks.filter(t => t.status === 'Review').length;
  const countDone = doneTasks;

  const pctToDo = totalTasks ? Math.round((countToDo / totalTasks) * 100) : 0;
  const pctInProg = totalTasks ? Math.round((countInProg / totalTasks) * 100) : 0;
  const pctReview = totalTasks ? Math.round((countReview / totalTasks) * 100) : 0;
  const pctDone = totalTasks ? Math.round((countDone / totalTasks) * 100) : 0;

  root.innerHTML = `
    <section class="dashboard">
      <div class="section-header">
        <div>
          <h2 class="section-title">Dashboard Manajemen Tim</h2>
          <p style="color:var(--text-muted); font-size:14px; margin-top:2px;">
            Pusat kendali tugas, alokasi kapasitas anggota tim, dan distribusi pekerjaan.
          </p>
        </div>
        <div class="toolbar">
          <button id="exportBtn" class="btn-secondary btn-sm" title="Ekspor data ke format JSON">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export JSON
          </button>
          <label class="btn-secondary btn-sm" style="cursor:pointer;" title="Impor data dari berkas JSON">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import JSON
            <input type="file" id="importFile" accept=".json" style="display:none;" />
          </label>
          <button id="resetDataBtn" class="btn-ghost btn-sm" title="Kembalikan data ke set seed awal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Reset Contoh
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="stats" style="padding:0;">
        <div class="stat">
          <div class="stat-icon primary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <div class="stat-info">
            <span>Total Tugas</span>
            <strong>${totalTasks}</strong>
          </div>
        </div>

        <div class="stat">
          <div class="stat-icon success">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
          </div>
          <div class="stat-info">
            <span>Jumlah Anggota</span>
            <strong>${members.length}</strong>
          </div>
        </div>

        <div class="stat">
          <div class="stat-icon accent">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-info">
            <span>Total Jam Tugas</span>
            <strong>${totalJam} <small style="font-size:14px; font-weight:500;">jam</small></strong>
          </div>
        </div>

        <div class="stat">
          <div class="stat-icon ${overloadCount > 0 ? 'danger' : 'success'}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="stat-info">
            <span>Kondisi Overload</span>
            <strong>${overloadCount} <small style="font-size:14px; font-weight:500;">anggota</small></strong>
          </div>
        </div>
      </div>

      <!-- Status Distribution & Workload Section -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
        <!-- Status Breakdown Card -->
        <div class="dashboard-card">
          <h3 style="font-size:var(--fs-h3); font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            Distribusi Status Tugas
          </h3>
          <div style="height:12px; display:flex; border-radius:var(--r-full); overflow:hidden; background:#E5DAC7; margin-bottom:16px;">
            <div style="width:${pctToDo}%; background:#2B4764;" title="To Do: ${countToDo} (${pctToDo}%)"></div>
            <div style="width:${pctInProg}%; background:#1E429F;" title="In Progress: ${countInProg} (${pctInProg}%)"></div>
            <div style="width:${pctReview}%; background:#854D0E;" title="Review: ${countReview} (${pctReview}%)"></div>
            <div style="width:${pctDone}%; background:#03543F;" title="Done: ${countDone} (${pctDone}%)"></div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:13px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="chip-dot" style="background:#2B4764;"></span>
              <span>To Do: <strong>${countToDo}</strong> (${pctToDo}%)</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="chip-dot" style="background:#1E429F;"></span>
              <span>In Progress: <strong>${countInProg}</strong> (${pctInProg}%)</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="chip-dot" style="background:#854D0E;"></span>
              <span>Review: <strong>${countReview}</strong> (${pctReview}%)</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="chip-dot" style="background:#03543F;"></span>
              <span>Done: <strong>${countDone}</strong> (${pctDone}%)</span>
            </div>
          </div>
        </div>

        <!-- Workload Overview Card -->
        <div class="dashboard-card">
          <h3 style="font-size:var(--fs-h3); font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Beban Kerja Anggota (Workload)
          </h3>
          <div class="workload-list">
            ${memberWorkloads.map(w => `
              <div class="workload-item">
                <div class="workload-meta">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="avatar" style="width:26px; height:26px; font-size:10px; background:${w.member.warnaAvatar||'#1F4D3A'}">
                      ${w.member.nama.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}
                    </span>
                    <span>${escapeHtml(w.member.nama)}</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:12px; color:var(--text-muted);">${w.jam}/${w.capacity} jam (${w.pct}%)</span>
                    <span class="chip ${w.category === 'Overload' ? 'prio-High' : w.category === 'Normal' ? 'prio-Medium' : 'status-Done'}">
                      ${w.category}
                    </span>
                  </div>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${w.statusClass}" style="width: ${Math.min(w.pct, 100)}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Task Management Table -->
      <div class="dashboard-card">
        <div class="section-header">
          <h3 style="font-size:var(--fs-h3); font-weight:700; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Daftar Tugas Tim
          </h3>
          <button id="addTaskBtn" class="btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Tugas
          </button>
        </div>

        <div class="table-responsive">
          <table class="task-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Prioritas</th>
                <th>Deadline</th>
                <th>Estimasi</th>
                <th style="text-align:right;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.length === 0 ? `
                <tr><td colspan="8" style="text-align:center; padding:32px; color:var(--text-muted);">Belum ada tugas. Klik tombol Tambah Tugas di atas.</td></tr>
              ` : tasks.map(t => {
                const p = projects.find(x => x.id === t.projectId);
                const m = members.find(x => x.id === t.assigneeId);
                return `
                  <tr>
                    <td>
                      <strong>${escapeHtml(t.judul)}</strong>
                      ${t.unggulan ? '<span class="chip badge-featured" style="margin-left:6px;">★</span>' : ''}
                    </td>
                    <td><span class="task-project">${escapeHtml(p ? p.nama : 'Umum')}</span></td>
                    <td>${avatar(m)}</td>
                    <td>
                      <span class="chip status-${t.status.replace(/\s+/g, '-')}">
                        <span class="chip-dot"></span>
                        ${escapeHtml(t.status)}
                      </span>
                    </td>
                    <td>
                      <span class="chip prio-${t.prioritas}">
                        ${escapeHtml(t.prioritas)}
                      </span>
                    </td>
                    <td>${escapeHtml(t.deadline || '—')}</td>
                    <td><strong>${t.estimasiJam}</strong> jam</td>
                    <td style="text-align:right;">
                      <button data-edit="${t.id}" class="btn-secondary btn-sm" title="Ubah tugas">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        Ubah
                      </button>
                      <button data-del="${t.id}" class="btn-danger btn-sm" title="Hapus tugas">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Hapus
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Member Management Section -->
      <div class="dashboard-card">
        <div class="section-header">
          <h3 style="font-size:var(--fs-h3); font-weight:700; display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Daftar Anggota Tim
          </h3>
          <button id="addMemberBtn" class="btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Anggota
          </button>
        </div>

        <div class="member-grid">
          ${members.map(m => `
            <div class="member-card">
              <div style="display:flex; align-items:center; gap:12px;">
                <span class="avatar" style="width:36px; height:36px; font-size:13px; background:${m.warnaAvatar||'#1F4D3A'}">
                  ${m.nama.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}
                </span>
                <div>
                  <div style="font-weight:700; color:var(--text);">${escapeHtml(m.nama)}</div>
                  <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(m.peran || 'Anggota Tim')} · ${m.kapasitasJamMingguan} j/mgg</div>
                </div>
              </div>
              <div style="display:flex; gap:6px;">
                <button data-editm="${m.id}" class="btn-secondary btn-sm" title="Ubah anggota">Ubah</button>
                <button data-delm="${m.id}" class="btn-danger btn-sm" title="Hapus anggota">Hapus</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="formArea"></div>
    </section>
  `;

  // Toolbar Actions
  root.querySelector('#exportBtn').addEventListener('click', () => {
    const data = exportState();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    a.download = `tugaskita-backup-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data berhasil diekspor sebagai JSON');
  });

  root.querySelector('#importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast('File melebihi batas 1 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        const res = importState(payload);
        if (!res.ok) {
          toast(res.error);
          return;
        }
        renderDashboard(root);
        toast('Data berhasil diimpor');
      } catch (err) {
        toast('Format JSON tidak valid');
      }
    };
    reader.readAsText(file);
  });

  root.querySelector('#resetDataBtn').addEventListener('click', async () => {
    const ok = await confirmDialog('Reset Data Contoh?', 'Semua modifikasi akan dibatalkan dan 8 tugas contoh awal akan dimuat ulang.');
    if (ok) {
      resetData();
      renderDashboard(root);
      toast('Data berhasil dipulihkan');
    }
  });

  // Task Form Actions
  const addTaskBtn = root.querySelector('#addTaskBtn');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => showTaskForm(root, null));
  }

  root.querySelectorAll('[data-edit]').forEach(b => {
    b.addEventListener('click', () => showTaskForm(root, b.dataset.edit));
  });

  root.querySelectorAll('[data-del]').forEach(b => {
    b.addEventListener('click', async () => {
      const t = state.tasks.find(x => x.id === b.dataset.del);
      if (!t) return;
      const ok = await confirmDialog('Hapus Tugas?', `"${t.judul}" akan dihapus permanen dari perangkat ini.`);
      if (ok) {
        deleteTask(t.id);
        renderDashboard(root);
        toast('Tugas berhasil dihapus');
      }
    });
  });

  // Member Form Actions
  const addMemberBtn = root.querySelector('#addMemberBtn');
  if (addMemberBtn) {
    addMemberBtn.addEventListener('click', () => showMemberForm(root, null));
  }

  root.querySelectorAll('[data-editm]').forEach(b => {
    b.addEventListener('click', () => showMemberForm(root, b.dataset.editm));
  });

  root.querySelectorAll('[data-delm]').forEach(b => {
    b.addEventListener('click', async () => {
      const m = state.members.find(x => x.id === b.dataset.delm);
      if (!m) return;
      const ok = await confirmDialog('Hapus Anggota Tim?', `Tugas yang sebelumnya ditugaskan ke "${m.nama}" akan otomatis dialihkan menjadi status Open.`);
      if (ok) {
        deleteMember(m.id);
        renderDashboard(root);
        toast('Anggota berhasil dihapus');
      }
    });
  });
}

function showTaskForm(root, id) {
  const state = getState();
  const t = id ? state.tasks.find(x => x.id === id) : null;
  const area = root.querySelector('#formArea');
  
  area.innerHTML = `
    <form id="taskForm" class="form">
      <h3 style="font-size:var(--fs-h3); font-weight:800; color:var(--primary); margin-bottom:4px;">
        ${id ? 'Ubah Informasi Tugas' : 'Tambah Tugas Baru'}
      </h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:8px;">
        Isi detail informasi tugas di bawah ini secara lengkap.
      </p>

      <label>
        Judul Tugas (Wajib)
        <input name="judul" value="${escapeHtml(t ? t.judul : '')}" placeholder="Contoh: Perbaiki alur checkout" required />
      </label>

      <label>
        Deskripsi Rinci
        <textarea name="deskripsi" rows="3" placeholder="Jelaskan kebutuhan tugas ini...">${escapeHtml(t ? t.deskripsi : '')}</textarea>
      </label>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <label>
          Project
          <select name="projectId">
            ${state.projects.map(p => `<option value="${p.id}" ${t && t.projectId === p.id ? 'selected' : ''}>${escapeHtml(p.nama)}</option>`).join('')}
          </select>
        </label>

        <label>
          Assignee
          <select name="assigneeId">
            <option value="">Open (Belum ada)</option>
            ${state.members.map(m => `<option value="${m.id}" ${t && t.assigneeId === m.id ? 'selected' : ''}>${escapeHtml(m.nama)}</option>`).join('')}
          </select>
        </label>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <label>
          Status
          <select name="status">
            ${['To Do', 'In Progress', 'Review', 'Done'].map(s => `<option value="${s}" ${t && t.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </label>

        <label>
          Prioritas
          <select name="prioritas">
            ${['Low', 'Medium', 'High'].map(p => `<option value="${p}" ${t && t.prioritas === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </label>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <label>
          Deadline
          <input name="deadline" type="date" value="${t ? t.deadline || '' : ''}" />
        </label>

        <label>
          Estimasi Pengerjaan (Jam)
          <input name="estimasiJam" type="number" step="0.5" min="0" value="${t ? t.estimasiJam : 1}" required />
        </label>
      </div>

      <label class="checkbox-label" style="margin-top:4px;">
        <input type="checkbox" name="unggulan" ${t && t.unggulan ? 'checked' : ''}/>
        <span>Tandai sebagai Tugas Prioritas / Unggulan</span>
      </label>

      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Simpan Tugas
        </button>
        <button type="button" id="cancelForm" class="btn-secondary">Batal</button>
      </div>
    </form>
  `;

  area.scrollIntoView({ behavior: 'smooth', block: 'center' });

  area.querySelector('#cancelForm').addEventListener('click', () => {
    area.innerHTML = '';
  });

  area.querySelector('#taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const judul = String(fd.get('judul')).trim();
    const estimasi = Number(fd.get('estimasiJam'));

    if (judul.length < 3 || judul.length > 80) {
      toast('Judul wajib 3–80 karakter.');
      return;
    }
    if (!Number.isFinite(estimasi) || estimasi < 0) {
      toast('Estimasi jam harus berupa angka ≥ 0.');
      return;
    }

    const payload = {
      judul,
      deskripsi: String(fd.get('deskripsi')).trim(),
      projectId: String(fd.get('projectId')),
      assigneeId: fd.get('assigneeId') || null,
      status: String(fd.get('status')),
      prioritas: String(fd.get('prioritas')),
      deadline: fd.get('deadline') || null,
      estimasiJam: estimasi,
      unggulan: fd.get('unggulan') === 'on'
    };

    if (id) {
      updateTask(id, payload);
      toast('Perubahan tugas berhasil disimpan');
    } else {
      addTask({
        id: uid('t'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...payload
      });
      toast('Tugas baru berhasil ditambahkan');
    }

    renderDashboard(root);
  });
}

function showMemberForm(root, id) {
  const state = getState();
  const m = id ? state.members.find(x => x.id === id) : null;
  const area = root.querySelector('#formArea');

  area.innerHTML = `
    <form id="memberForm" class="form">
      <h3 style="font-size:var(--fs-h3); font-weight:800; color:var(--primary); margin-bottom:4px;">
        ${id ? 'Ubah Data Anggota' : 'Tambah Anggota Baru'}
      </h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:8px;">
        Tentukan identitas dan kapasitas kerja mingguan anggota.
      </p>

      <label>
        Nama Anggota (Wajib)
        <input name="nama" value="${escapeHtml(m ? m.nama : '')}" placeholder="Contoh: Sarah Azhari" required />
      </label>

      <label>
        Peran / Keahlian
        <input name="peran" value="${escapeHtml(m ? m.peran : '')}" placeholder="Contoh: UI/UX Designer" />
      </label>

      <label>
        Kapasitas Jam per Minggu
        <input name="kapasitasJamMingguan" type="number" min="0" step="1" value="${m ? m.kapasitasJamMingguan : 40}" required />
      </label>

      <label class="checkbox-label" style="margin-top:4px;">
        <input type="checkbox" name="aktif" ${m ? (m.aktif ? 'checked' : '') : 'checked'} />
        <span>Status Anggota Aktif</span>
      </label>

      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Simpan Anggota
        </button>
        <button type="button" id="cancelForm" class="btn-secondary">Batal</button>
      </div>
    </form>
  `;

  area.scrollIntoView({ behavior: 'smooth', block: 'center' });

  area.querySelector('#cancelForm').addEventListener('click', () => {
    area.innerHTML = '';
  });

  area.querySelector('#memberForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nama = String(fd.get('nama')).trim();
    const kap = Number(fd.get('kapasitasJamMingguan'));

    if (nama.length < 2 || nama.length > 40) {
      toast('Nama wajib 2–40 karakter.');
      return;
    }
    if (!Number.isFinite(kap) || kap < 0 || !Number.isInteger(kap)) {
      toast('Kapasitas harus berupa bilangan bulat ≥ 0.');
      return;
    }

    const defaultColors = ['#1F4D3A', '#A8541F', '#0B6E4F', '#1F5FA8', '#6D28D9', '#0E7490'];
    const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)];

    const payload = {
      nama,
      peran: String(fd.get('peran')).trim() || 'Anggota Tim',
      kapasitasJamMingguan: kap,
      aktif: fd.get('aktif') === 'on',
      warnaAvatar: m ? m.warnaAvatar : randomColor
    };

    if (id) {
      updateMember(id, payload);
      toast('Data anggota berhasil disimpan');
    } else {
      addMember({
        id: uid('m'),
        ...payload
      });
      toast('Anggota baru berhasil ditambahkan');
    }

    renderDashboard(root);
  });
}

export default renderDashboard;
