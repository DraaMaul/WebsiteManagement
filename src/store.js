import { getSeed } from './tasks.js';
import { validateState } from './schema.js';

const KEY = 'tugaskita.v1';
const BACKUP_KEY = 'tugaskita.v1:corrupt-backup';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = getSeed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
    const err = validateState(parsed);
    if (err) {
      try { localStorage.setItem(BACKUP_KEY, raw); } catch(e){}
      const s = getSeed();
      localStorage.setItem(KEY, JSON.stringify(s));
      window.__corruptNotice = 'Data lokal tidak dapat dibaca. Data contoh telah dipulihkan.';
      return s;
    }
    return parsed;
  } catch (e) {
    const s = getSeed();
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(err){}
    return s;
  }
}

function saveAtomic(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

let state = load();
let filterState = { query: '', status: [], prioritas: [], assigneeId: 'all', sortBy: 'deadline' };

export function getState() { return state; }
export function setState(s) { state = s; saveAtomic(state); }
export function getFilter() { return filterState; }
export function setFilter(patch) { filterState = { ...filterState, ...patch }; return filterState; }

export function addTask(task) { state.tasks.push(task); saveAtomic(state); }
export function updateTask(id, patch) {
  const i = state.tasks.findIndex(t => t.id === id);
  if (i >= 0) { state.tasks[i] = { ...state.tasks[i], ...patch, updatedAt: new Date().toISOString() }; saveAtomic(state); }
}
export function deleteTask(id) { state.tasks = state.tasks.filter(t => t.id !== id); saveAtomic(state); }
export function addMember(m) { state.members.push(m); saveAtomic(state); }
export function updateMember(id, patch) {
  const i = state.members.findIndex(m => m.id === id);
  if (i >= 0) { state.members[i] = { ...state.members[i], ...patch }; saveAtomic(state); }
}
export function deleteMember(id) {
  state.members = state.members.filter(m => m.id !== id);
  state.tasks.forEach(t => { if (t.assigneeId === id) t.assigneeId = null; });
  saveAtomic(state);
}
export function resetData() {
  const s = getSeed();
  state = s;
  saveAtomic(state);
  return state;
}
export function exportState() {
  return { schemaVersion: 1, exportedAt: new Date().toISOString(), data: { tasks: state.tasks, members: state.members, projects: state.projects } };
}
export function importState(payload) {
  let data = payload;
  if (payload && payload.data) data = payload.data;
  const err = validateState(data);
  if (err) return { ok: false, error: err };
  state = { tasks: data.tasks, members: data.members, projects: data.projects };
  saveAtomic(state);
  return { ok: true };
}
export function saveStatus() { return true; }
export default { getState, setState, getFilter, setFilter, addTask, updateTask, deleteTask, addMember, updateMember, deleteMember, resetData, exportState, importState };