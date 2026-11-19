import './style.css';
import { getState, resetData } from './store.js';
import { taskCard, statsSummary, toast, confirmDialog } from './ui.js';
import { getSeed } from './tasks.js';

const app = document.getElementById('app');

function render() {
  const state = getState();
  const projects = state.projects;
  const members = state.members;
  const cards = state.tasks.map(t => taskCard(t, projects.find(p=>p.id===t.projectId), members.find(m=>m.id===t.assigneeId))).join('');
  app.innerHTML = `
    <header class="navbar"><span class="logo">TugasKita</span><nav><button id="modeTim">Tim</button><button id="modeDash">Dashboard</button><button id="resetBtn">Reset data contoh</button></nav></header>
    <main>
      <section class="hero"><h1>Kelola tugas tim tanpa tumpang tindih</h1><p>Lihat siapa mengerjakan apa, kapan.</p></section>
      ${statsSummary(state)}
      <section class="task-grid">${cards || '<p>Tidak ada tugas</p>'}</section>
      <section class="dashboard"><h2>Dashboard demo</h2><p>Total tugas: ${state.tasks.length}, anggota: ${state.members.length}</p></section>
    </main>
  `;
  document.getElementById('resetBtn').addEventListener('click', async () => {
    const ok = await confirmDialog('Reset data contoh', 'Semua perubahan akan hilang dan 8 tugas contoh dimuat ulang.');
    if (ok) { resetData(); render(); toast('Data direset'); }
  });
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const t = state.tasks.find(x=>x.id===btn.dataset.copy);
      const text = `${t.judul} — ${projects.find(p=>p.id===t.projectId)?.nama} | Assignee: ${members.find(m=>m.id===t.assigneeId)?.nama || 'Open'} | Status: ${t.status} | Deadline: ${t.deadline || '—'} | Estimasi: ${t.estimasiJam} jam`;
      try { await navigator.clipboard.writeText(text); toast('Ringkasan disalin.'); } catch(e){ toast('Gagal menyalin.'); }
    });
  });
}

render();
window.__seed = getSeed();
console.log('seed tasks:', getState().tasks.length);
