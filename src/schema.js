const STATUSES = ['To Do','In Progress','Review','Done'];
const PRIORITIES = ['Low','Medium','High'];
const AVATAR_COLORS = ['#1F4D3A','#A8541F','#0B6E4F','#1F5FA8','#1F6B45','#8A5A00'];

function isStr(v, min, max){ return typeof v==='string' && v.trim().length>=min && v.trim().length<=max; }
function isNum(v){ return typeof v==='number' && Number.isFinite(v) && v>=0; }
function isDate(v){ return v==='' || v===null || /^\d{4}-\d{2}-\d{2}$/.test(v); }
function isISO(v){ return typeof v==='string' && !isNaN(Date.parse(v)); }

export function validateTask(t, ids) {
  if (!t || typeof t!=='object') return 'task bukan objek';
  if (typeof t.id!=='string' || !t.id) return 'id tidak valid';
  if (ids && ids.has(t.id)) return 'id duplikat';
  if (ids) ids.add(t.id);
  if (!isStr(t.judul,3,80)) return 'judul harus 3–80 karakter';
  if (typeof t.deskripsi!=='string' || t.deskripsi.length>300) return 'deskripsi maks 300';
  if (typeof t.projectId!=='string') return 'projectId tidak valid';
  if (t.assigneeId !== null && typeof t.assigneeId!=='string') return 'assigneeId tidak valid';
  if (!STATUSES.includes(t.status)) return 'status tidak valid';
  if (!PRIORITIES.includes(t.prioritas)) return 'prioritas tidak valid';
  if (!isDate(t.deadline)) return 'deadline harus YYYY-MM-DD';
  if (!isNum(t.estimasiJam)) return 'estimasiJam harus angka ≥ 0';
  if (typeof t.unggulan!=='boolean') return 'unggulan harus boolean';
  if (!isISO(t.createdAt) || !isISO(t.updatedAt)) return 'timestamp tidak valid';
  return null;
}

export function validateMember(m, ids) {
  if (!m || typeof m!=='object') return 'member bukan objek';
  if (typeof m.id!=='string' || !m.id) return 'id tidak valid';
  if (ids && ids.has(m.id)) return 'id duplikat';
  if (ids) ids.add(m.id);
  if (!isStr(m.nama,2,40)) return 'nama harus 2–40 karakter';
  if (typeof m.peran!=='string' || m.peran.length>30) return 'peran maks 30';
  if (!isNum(m.kapasitasJamMingguan)) return 'kapasitas harus angka ≥ 0';
  if (typeof m.aktif!=='boolean') return 'aktif harus boolean';
  if (typeof m.warnaAvatar!=='string') return 'warnaAvatar tidak valid';
  return null;
}

export function validateProject(p, ids) {
  if (!p || typeof p!=='object') return 'project bukan objek';
  if (typeof p.id!=='string' || !p.id) return 'id tidak valid';
  if (ids && ids.has(p.id)) return 'id duplikat';
  if (ids) ids.add(p.id);
  if (!isStr(p.nama,2,50)) return 'nama project harus 2–50 karakter';
  if (typeof p.deskripsi!=='string' || p.deskripsi.length>200) return 'deskripsi project maks 200';
  return null;
}

export function validateState(obj) {
  if (!obj || typeof obj!=='object') return 'state bukan objek';
  if (Object.prototype.hasOwnProperty.call(obj,'__proto__') || Object.prototype.hasOwnProperty.call(obj,'constructor') || Object.prototype.hasOwnProperty.call(obj,'prototype')) return 'key mencurigakan';
  if (!Array.isArray(obj.tasks) || !Array.isArray(obj.members) || !Array.isArray(obj.projects)) return 'tasks/members/projects harus array';
  const taskIds = new Set();
  const memberIds = new Set();
  const projectIds = new Set();
  for (let i=0;i<obj.tasks.length;i++) {
    const e = validateTask(obj.tasks[i], taskIds);
    if (e) return `Task ke-${i+1}: ${e}`;
  }
  for (let i=0;i<obj.members.length;i++) {
    const e = validateMember(obj.members[i], memberIds);
    if (e) return `Member ke-${i+1}: ${e}`;
  }
  for (let i=0;i<obj.projects.length;i++) {
    const e = validateProject(obj.projects[i], projectIds);
    if (e) return `Project ke-${i+1}: ${e}`;
  }
  const projectSet = new Set(obj.projects.map(p=>p.id));
  const memberSet = new Set(obj.members.map(m=>m.id));
  for (const t of obj.tasks) {
    if (!projectSet.has(t.projectId)) return 'projectId tidak merujuk project yang ada';
    if (t.assigneeId !== null && !memberSet.has(t.assigneeId)) return 'assigneeId tidak merujuk anggota yang ada';
  }
  return null;
}
export default { validateTask, validateMember, validateProject, validateState };