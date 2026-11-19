export function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

export function avatar(member) {
  if (!member) return '<span class="open-label">Open</span>';
  const initials = member.nama.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return `<span class="avatar" style="background:${member.warnaAvatar}" aria-label="${escapeHtml(member.nama)}">${initials}</span> ${escapeHtml(member.nama)}`;
}

export function taskCard(task, project, member) {
  return `<article class="task-card">
    <div class="card-top"><span class="chip status-${task.status.replace(' ','-')}">${escapeHtml(task.status)}</span><span class="prio prio-${task.prioritas}">${escapeHtml(task.prioritas)}</span></div>
    <h3 class="task-title">${escapeHtml(task.judul)}</h3>
    <div class="task-project">${escapeHtml(project ? project.nama : '')}</div>
    <div class="task-assignee">${avatar(member)}</div>
    <div class="task-meta">${task.deadline ? escapeHtml(task.deadline) : '—'} · ${task.estimasiJam} jam</div>
    <div class="card-actions"><button class="btn-secondary" data-detail="${task.id}">Detail</button><button class="btn-primary" data-copy="${task.id}">Salin ringkasan</button><button class="btn-secondary" data-wa="${task.id}">Bagikan via WhatsApp</button></div>
  </article>`;
}

export function statsSummary(state) {
  const total = state.tasks.length;
  const jam = state.tasks.reduce((a,t)=>a+t.estimasiJam,0);
  const done = state.tasks.filter(t=>t.status==='Done').length;
  const open = state.tasks.filter(t=>t.assigneeId===null).length;
  return `<div class="stats"><div class="stat"><span>Total tugas</span><strong>${total}</strong></div><div class="stat"><span>Total jam</span><strong>${jam}</strong></div><div class="stat"><span>Selesai</span><strong>${done}</strong></div><div class="stat"><span>Tanpa assignee</span><strong>${open}</strong></div></div>`;
}

export function emptyState() { return `<div class="empty">Tidak ada tugas yang cocok. <button id="clearFilters">Hapus semua filter</button></div>`; }

export function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  el.setAttribute('aria-live','polite');
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),2000);
}

export function confirmDialog(title, body) {
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-overlay';
    wrap.innerHTML = `<div class="modal"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p><div class="modal-actions"><button class="btn-secondary" data-cancel>Batal</button><button class="btn-danger" data-ok>Hapus</button></div></div>`;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-cancel]').onclick = ()=>{wrap.remove();resolve(false);};
    wrap.querySelector('[data-ok]').onclick = ()=>{wrap.remove();resolve(true);};
  });
}
