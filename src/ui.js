export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function avatar(member) {
  if (!member) {
    return `<span class="open-label">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Open (Belum ada assignee)
    </span>`;
  }
  const initials = member.nama
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const bg = member.warnaAvatar || '#1F4D3A';
  return `<span class="avatar" style="background:${bg}" aria-label="${escapeHtml(member.nama)}" title="${escapeHtml(member.nama)}">${initials}</span> <span>${escapeHtml(member.nama)}</span>`;
}

export function taskCard(task, project, member) {
  const isDone = task.status === 'Done';
  const isHigh = task.prioritas === 'High';
  const isOverdue = task.deadline && new Date(task.deadline) < new Date(new Date().toDateString()) && !isDone;

  return `
    <article class="task-card" data-id="${task.id}">
      <div class="card-top">
        <div class="card-badges">
          <span class="chip status-${task.status.replace(/\s+/g, '-')}">
            <span class="chip-dot"></span>
            ${escapeHtml(task.status)}
          </span>
          <span class="chip prio-${task.prioritas}">
            ${escapeHtml(task.prioritas)}
          </span>
          ${task.unggulan ? '<span class="chip badge-featured">★ Prioritas</span>' : ''}
          ${isOverdue ? '<span class="chip prio-High">Telat</span>' : ''}
        </div>
      </div>

      <h3 class="task-title" style="${isDone ? 'text-decoration: line-through; opacity: 0.75;' : ''}">
        ${escapeHtml(task.judul)}
      </h3>

      <div class="task-project">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        ${escapeHtml(project ? project.nama : 'Umum')}
      </div>

      <div class="task-assignee">
        ${avatar(member)}
      </div>

      <div class="task-meta">
        <div class="meta-item" title="Batas waktu">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${task.deadline ? escapeHtml(task.deadline) : 'Tanpa batas'}
        </div>
        <div class="meta-item" title="Estimasi pengerjaan">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${task.estimasiJam} jam
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-secondary btn-sm" data-detail="${task.id}" title="Lihat detail">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Detail
        </button>
        <button class="btn-primary btn-sm" data-copy="${task.id}" title="Salin ringkasan ke clipboard">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Salin
        </button>
        <button class="btn-secondary btn-sm" data-wa="${task.id}" title="Kirim ke WhatsApp">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          WA
        </button>
      </div>
    </article>
  `;
}

export function statsSummary(state) {
  const tasks = state.tasks || [];
  const total = tasks.length;
  const jam = tasks.reduce((a, t) => a + (Number(t.estimasiJam) || 0), 0);
  const done = tasks.filter(t => t.status === 'Done').length;
  const open = tasks.filter(t => t.assigneeId === null).length;

  return `
    <div class="stats">
      <div class="stat">
        <div class="stat-icon primary">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div class="stat-info">
          <span>Total Tugas</span>
          <strong>${total}</strong>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon accent">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="stat-info">
          <span>Total Estimasi</span>
          <strong>${jam.toLocaleString('id-ID')} <small style="font-size: 14px; font-weight: 500;">jam</small></strong>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon success">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-info">
          <span>Tugas Selesai</span>
          <strong>${done}</strong>
        </div>
      </div>

      <div class="stat">
        <div class="stat-icon warning">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="stat-info">
          <span>Tanpa Assignee</span>
          <strong>${open}</strong>
        </div>
      </div>
    </div>
  `;
}

export function showDetailModal(task, project, member) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-overlay';
    wrap.innerHTML = `
      <div class="modal">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div class="card-badges">
            <span class="chip status-${task.status.replace(/\s+/g, '-')}">
              <span class="chip-dot"></span>
              ${escapeHtml(task.status)}
            </span>
            <span class="chip prio-${task.prioritas}">
              ${escapeHtml(task.prioritas)}
            </span>
          </div>
          <button class="btn-ghost btn-sm" data-close style="border-radius:50%; width:32px; height:32px; padding:0;">✕</button>
        </div>

        <h2 style="font-size: 20px; line-height: 1.35; margin-bottom: 8px;">${escapeHtml(task.judul)}</h2>
        
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px; background: var(--surface-subtle); padding: 12px; border-radius: var(--r-sm); border: 1px solid var(--border-light);">
          ${task.deskripsi ? escapeHtml(task.deskripsi) : '<em>Tidak ada deskripsi rinci untuk tugas ini.</em>'}
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; font-size: 13px;">
          <div>
            <strong style="display:block; color:var(--text-light); font-size:11px; text-transform:uppercase;">Project</strong>
            <span style="font-weight:600;">${escapeHtml(project ? project.nama : 'Umum')}</span>
          </div>
          <div>
            <strong style="display:block; color:var(--text-light); font-size:11px; text-transform:uppercase;">Assignee</strong>
            <span style="font-weight:600;">${member ? escapeHtml(member.nama) : 'Belum Ditugaskan'}</span>
          </div>
          <div>
            <strong style="display:block; color:var(--text-light); font-size:11px; text-transform:uppercase;">Deadline</strong>
            <span style="font-weight:600;">${task.deadline || '—'}</span>
          </div>
          <div>
            <strong style="display:block; color:var(--text-light); font-size:11px; text-transform:uppercase;">Estimasi Jam</strong>
            <span style="font-weight:600;">${task.estimasiJam} jam</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-primary" data-copy-modal>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Salin Ringkasan
          </button>
          <button class="btn-secondary" data-close>Tutup</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const close = () => {
      wrap.remove();
      resolve();
    };

    wrap.querySelectorAll('[data-close]').forEach(btn => btn.onclick = close);
    wrap.onclick = e => { if (e.target === wrap) close(); };
    wrap.querySelector('[data-copy-modal]').onclick = async () => {
      const text = `${task.judul} — ${project ? project.nama : 'Umum'} | Assignee: ${member ? member.nama : 'Open'} | Status: ${task.status} | Deadline: ${task.deadline || '—'} | Estimasi: ${task.estimasiJam} jam`;
      try {
        await navigator.clipboard.writeText(text);
        toast('Ringkasan disalin ke clipboard');
      } catch (err) {
        toast('Gagal menyalin');
      }
    };
  });
}

export function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${escapeHtml(msg)}</span>
  `;
  el.setAttribute('aria-live', 'polite');
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, 10px)';
    el.style.transition = 'all 0.2s ease';
    setTimeout(() => el.remove(), 200);
  }, 2200);
}

export function confirmDialog(title, body) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-overlay';
    wrap.innerHTML = `
      <div class="modal">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(body)}</p>
        <div class="modal-actions">
          <button class="btn-secondary" data-cancel>Batal</button>
          <button class="btn-danger" data-ok>Lanjutkan</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-cancel]').onclick = () => { wrap.remove(); resolve(false); };
    wrap.querySelector('[data-ok]').onclick = () => { wrap.remove(); resolve(true); };
  });
}
