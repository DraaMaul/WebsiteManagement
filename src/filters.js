const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

export function byDeadline(a, b) {
  if (!a.deadline && !b.deadline) return a.judul.localeCompare(b.judul, 'id');
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;
  if (a.deadline !== b.deadline) return a.deadline < b.deadline ? -1 : 1;
  return a.judul.localeCompare(b.judul, 'id');
}

export function byPriority(a, b) {
  const ra = PRIORITY_RANK[a.prioritas] || 0;
  const rb = PRIORITY_RANK[b.prioritas] || 0;
  if (ra !== rb) return rb - ra;
  return a.judul.localeCompare(b.judul, 'id');
}

export function byEstimasi(a, b) {
  if (a.estimasiJam !== b.estimasiJam) return b.estimasiJam - a.estimasiJam;
  return a.judul.localeCompare(b.judul, 'id');
}

export function byJudul(a, b) {
  return a.judul.localeCompare(b.judul, 'id');
}

const SORTERS = {
  deadline: byDeadline,
  prioritas: byPriority,
  estimasi: byEstimasi,
  judul: byJudul
};

export function filterTasks(tasks, criteria) {
  const list = Array.isArray(tasks) ? tasks.slice() : [];
  const c = criteria || {};
  const query = (c.query || '').trim().toLowerCase();
  const status = Array.isArray(c.status) ? c.status : [];
  const prioritas = Array.isArray(c.prioritas) ? c.prioritas : [];
  const assigneeId = c.assigneeId; // undefined/'all'/'none'/id
  const sortBy = c.sortBy || 'deadline';

  const filtered = list.filter(t => {
    if (query) {
      const hay = `${t.judul || ''} ${t.deskripsi || ''}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    if (status.length && !status.includes(t.status)) return false;
    if (prioritas.length && !prioritas.includes(t.prioritas)) return false;
    if (assigneeId && assigneeId !== 'all') {
      if (assigneeId === 'none') { if (t.assigneeId !== null) return false; }
      else { if (t.assigneeId !== assigneeId) return false; }
    }
    return true;
  });

  const sorter = SORTERS[sortBy] || byDeadline;
  return filtered.sort(sorter);
}
export default filterTasks;
