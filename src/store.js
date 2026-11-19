const KEY = 'tugaskita.v1';

function seedState() {
  const s = (window.__seed || null);
  return s ? s : null;
}

import { getSeed } from './tasks.js';

function validState(obj) {
  if (!obj || typeof obj !== 'object') return false;
  if (!Array.isArray(obj.projects) || !Array.isArray(obj.members) || !Array.isArray(obj.tasks)) return false;
  return true;
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = getSeed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw);
    if (!validState(parsed)) throw new Error('invalid');
    return parsed;
  } catch (e) {
    return getSeed();
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

export function reset() {
  const s = getSeed();
  save(s);
  return s;
}

let state = load();

export function getState() { return state; }
export function setState(s) { state = s; save(state); }

export function addTask(task) {
  state.tasks.push(task);
  save(state);
}
export function updateTask(id, patch) {
  const i = state.tasks.findIndex(t => t.id === id);
  if (i >= 0) { state.tasks[i] = { ...state.tasks[i], ...patch, updatedAt: new Date().toISOString() }; save(state); }
}
export function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  save(state);
}
export function addMember(m) { state.members.push(m); save(state); }
export function updateMember(id, patch) {
  const i = state.members.findIndex(m => m.id === id);
  if (i >= 0) { state.members[i] = { ...state.members[i], ...patch }; save(state); }
}
export function deleteMember(id) {
  state.members = state.members.filter(m => m.id !== id);
  state.tasks.forEach(t => { if (t.assigneeId === id) t.assigneeId = null; });
  save(state);
}
export function resetData() { state = reset(); return state; }
