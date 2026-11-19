const projects = [
  { id: 'p1', nama: 'Website Redesign', deskripsi: 'Redesign situs perusahaan' },
  { id: 'p2', nama: 'Kampanye Akhir Tahun', deskripsi: 'Kampanye pemasaran akhir tahun' },
  { id: 'p3', nama: 'Internal', deskripsi: 'Pekerjaan internal tim' }
];

const members = [
  { id: 'm1', nama: 'Andi Dwi', peran: 'Designer', kapasitasJamMingguan: 40, aktif: true, warnaAvatar: '#1F4D3A' },
  { id: 'm2', nama: 'Bunga Putri', peran: 'Copywriter', kapasitasJamMingguan: 40, aktif: true, warnaAvatar: '#A8541F' },
  { id: 'm3', nama: 'Citra Lestari', peran: 'QA', kapasitasJamMingguan: 40, aktif: true, warnaAvatar: '#0B6E4F' },
  { id: 'm4', nama: 'Dedi Saputra', peran: 'Developer', kapasitasJamMingguan: 40, aktif: true, warnaAvatar: '#1F5FA8' }
];

const tasks = [
  { id: 't1', judul: 'Perbaiki alur checkout', deskripsi: 'Perbaiki bug pada alur checkout', projectId: 'p1', assigneeId: 'm1', status: 'To Do', prioritas: 'High', deadline: '2026-11-22', estimasiJam: 6.5, unggulan: true, createdAt: '2026-11-01T00:00:00.000Z', updatedAt: '2026-11-01T00:00:00.000Z' },
  { id: 't2', judul: 'Susun copy halaman promo', deskripsi: 'Tulis copy untuk halaman promo', projectId: 'p2', assigneeId: 'm2', status: 'In Progress', prioritas: 'Medium', deadline: '2026-11-25', estimasiJam: 4, unggulan: false, createdAt: '2026-11-02T00:00:00.000Z', updatedAt: '2026-11-02T00:00:00.000Z' },
  { id: 't3', judul: 'Review desain halaman utama', deskripsi: 'Review desain baru', projectId: 'p1', assigneeId: 'm3', status: 'Review', prioritas: 'High', deadline: '2026-11-24', estimasiJam: 3, unggulan: false, createdAt: '2026-11-03T00:00:00.000Z', updatedAt: '2026-11-03T00:00:00.000Z' },
  { id: 't4', judul: 'Lengkapi dokumentasi onboarding', deskripsi: 'Dokumen onboarding baru', projectId: 'p3', assigneeId: null, status: 'To Do', prioritas: 'Low', deadline: null, estimasiJam: 2, unggulan: false, createdAt: '2026-11-04T00:00:00.000Z', updatedAt: '2026-11-04T00:00:00.000Z' },
  { id: 't5', judul: 'Update aset brand', deskripsi: 'Perbarui aset brand', projectId: 'p3', assigneeId: 'm2', status: 'Done', prioritas: 'Medium', deadline: '2026-11-20', estimasiJam: 5, unggulan: false, createdAt: '2026-11-05T00:00:00.000Z', updatedAt: '2026-11-05T00:00:00.000Z' },
  { id: 't6', judul: 'Siapkan QA checklist', deskripsi: 'Checklist QA', projectId: 'p1', assigneeId: 'm1', status: 'To Do', prioritas: 'High', deadline: '2026-11-26', estimasiJam: 2.5, unggulan: false, createdAt: '2026-11-06T00:00:00.000Z', updatedAt: '2026-11-06T00:00:00.000Z' },
  { id: 't7', judul: 'Riset kata kunci', deskripsi: 'Riset SEO', projectId: 'p2', assigneeId: null, status: 'To Do', prioritas: 'Low', deadline: null, estimasiJam: 3, unggulan: false, createdAt: '2026-11-07T00:00:00.000Z', updatedAt: '2026-11-07T00:00:00.000Z' },
  { id: 't8', judul: 'Buat laporan mingguan', deskripsi: 'Laporan mingguan tim', projectId: 'p3', assigneeId: 'm4', status: 'In Progress', prioritas: 'Medium', deadline: '2026-11-28', estimasiJam: 1.5, unggulan: false, createdAt: '2026-11-08T00:00:00.000Z', updatedAt: '2026-11-08T00:00:00.000Z' }
];

export const seed = { projects, members, tasks };
export function getSeed() { return JSON.parse(JSON.stringify(seed)); }
export default seed;
