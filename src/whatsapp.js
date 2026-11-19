export function buildWhatsAppUrl(number, task) {
  if (!number || typeof number !== 'string') return null;
  const trimmed = number.trim();
  if (!/^\+[1-9]\d{7,14}$/.test(trimmed)) return null;
  const t = task || {};
  const judul = t.judul || '';
  const project = t.projectName || t.project || '';
  const assignee = t.assigneeName || (t.assigneeId ? t.assigneeId : 'Open');
  const status = t.status || '';
  const prioritas = t.prioritas || '';
  const deadline = t.deadline || '—';
  const estimasi = t.estimasiJam != null ? t.estimasiJam : '';
  const pesan = `Judul: ${judul}\nProject: ${project}\nAssignee: ${assignee}\nStatus: ${status}\nPrioritas: ${prioritas}\nDeadline: ${deadline}\nEstimasi: ${estimasi} jam`;
  const num = trimmed.replace(/^\+/, '');
  return `https://wa.me/${num}?text=${encodeURIComponent(pesan)}`;
}
export default buildWhatsAppUrl;
