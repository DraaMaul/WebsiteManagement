# SPEC.md — TugasKita (Website Management Pembagian Tugas)

> **Catatan adaptasi:** Dokumen ini memakai struktur dan tingkat ketelitian yang sama dengan SPEC.md "RasaNusa", tetapi objeknya diganti menjadi website project management untuk tim kecil–menengah. Peran "calon pembeli" diganti "anggota tim", dan "pengelola toko" diganti "manager demo". Semua batasan asli tetap dipertahankan: tanpa backend, tanpa login palsu, tanpa API key, data contoh nonpribadi.

---

## 1. Tujuan

Menyediakan aplikasi web ringan untuk **membagi dan memantau tugas tim kecil–menengah pada satu perangkat**, dengan fokus:

- Melihat daftar tugas dan siapa penanggung jawabnya.
- Mencari, memfilter, dan mengurutkan tugas dengan cepat.
- Melakukan CRUD tugas pada mode demo (dashboard).
- Melihat ringkasan beban kerja per anggota agar pembagian tugas tidak menumpuk pada satu orang.
- Menyimpan semua perubahan di `localStorage` sehingga data bertahan saat halaman dimuat ulang.

Target penyelesaian: **latihan 1 hari**, sehingga cakupan sengaja dibatasi pada satu halaman aplikasi dengan dua area (tampilan tim dan dashboard demo).

---

## 2. Pengguna

| Pengguna | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Anggota tim** | Orang yang melihat daftar tugas dan mencari tugas miliknya | Daftar tugas jelas, pencarian/filter cepat, ringkasan tugas per anggota |
| **Manager demo** | Pengelola data pada perangkat yang sama (bukan akun terpisah) | CRUD tugas & anggota, ringkasan total, deteksi overload |

Catatan:
- Kedua peran berada pada **satu perangkat dan satu sesi browser**.
- **Tidak ada autentikasi.** Perpindahan ke "mode manager" hanya berupa toggle tampilan/panel, bukan login. Tidak ada halaman login, tidak ada kredensial, tidak ada data pengguna.
- Data contoh memakai nama fiktif nonpribadi (mis. "Anggota A", "Anggota B") dan nama project fiktif.

---

## 3. Daftar Fitur (MVP)

### 3.1 Area Tim (halaman utama)
1. **Daftar 8 tugas contoh** yang dimuat otomatis saat pertama kali dibuka (seed data), mencakup: judul, project, assignee (termasuk minimal 1 tugas tanpa assignee), status, prioritas, deadline, estimasi jam, dan deskripsi.
2. **Kartu tugas** menampilkan nama, project, assignee, status, prioritas, deadline, estimasi jam, dan indikator unggulan/prioritas tinggi.
3. **Foto/placeholder lokal**: setiap anggota memiliki avatar placeholder lokal (inisial + warna), **tanpa permintaan ke jaringan eksternal**.
4. **Pencarian** berdasarkan judul dan deskripsi tugas (case-insensitive, minimal 1 karakter).
5. **Filter** berdasarkan status, prioritas, dan assignee (termasuk opsi "Tanpa assignee").
6. **Sorting** berdasarkan deadline terdekat, prioritas tertinggi, estimasi jam terbesar, dan judul A–Z.
7. **Tombol "Salin ringkasan"** pada kartu tugas: menyalin teks ringkasan tugas ke clipboard (pengganti tombol WhatsApp pada versi katalog). Tidak melakukan panggilan jaringan.
8. **Ringkasan cepat** di atas daftar: total tugas, total estimasi jam, jumlah tugas selesai, jumlah tugas tanpa assignee.

### 3.2 Dashboard Demo (panel manager)
9. **CRUD tugas**: tambah, lihat detail, ubah, dan hapus tugas dengan validasi field.
10. **CRUD anggota demo**: tambah/ubah/hapus anggota (nama, peran label, kapasitas jam/minggu, aktif/tidak).
11. **Ringkasan total**: jumlah tugas, jumlah anggota, total estimasi jam, total tugas per status, jumlah anggota overload.
12. **Workload view sederhana**: total estimasi jam per anggota per minggu dikelompokkan menjadi `Available` (<70%), `Normal` (70–90%), `Overload` (>90%) terhadap kapasitas anggota.
13. **Penyimpanan localStorage**: seluruh perubahan tugas dan anggota tersimpan otomatis dan bertahan setelah reload.
14. **Reset data contoh**: tombol untuk mengembalikan data ke 8 tugas contoh awal (dengan konfirmasi).

### 3.3 Aturan bisnis minimum
- Status tugas: `To Do`, `In Progress`, `Review`, `Done`.
- Prioritas: `Low`, `Medium`, `High`.
- Tugas tanpa assignee ditampilkan pada kelompok "Open Tasks" dan dapat difilter.
- Perubahan assignee dan deadline dicatat pada `updatedAt` (log aktivitas lengkap di luar scope MVP).

---

## 4. Data Model

Semua data disimpan dalam satu objek `localStorage` dengan key `tugaskita.v1`.

### 4.1 Task

| Field | Tipe | Aturan validasi |
|---|---|---|
| `id` | string | Unik, dibuat otomatis, tidak boleh kosong |
| `judul` | string | Wajib, 3–80 karakter, trim spasi |
| `deskripsi` | string | Opsional, maks 300 karakter |
| `projectId` | string | Wajib, harus merujuk ke project yang ada |
| `assigneeId` | string \| null | Opsional; jika diisi harus merujuk ke anggota yang ada |
| `status` | enum | Salah satu dari 4 status; default `To Do` |
| `prioritas` | enum | `Low` / `Medium` / `High`; default `Medium` |
| `deadline` | string (YYYY-MM-DD) | Opsional; jika diisi harus format valid |
| `estimasiJam` | number | Wajib, angka **>= 0**, boleh desimal 0.5 |
| `unggulan` | boolean | Default `false` |
| `createdAt` | string (ISO) | Diisi otomatis |
| `updatedAt` | string (ISO) | Diperbarui otomatis setiap perubahan |

### 4.2 Member

| Field | Tipe | Aturan validasi |
|---|---|---|
| `id` | string | Unik, otomatis |
| `nama` | string | Wajib, 2–40 karakter |
| `peran` | string | Label bebas (mis. "Designer"), maks 30 karakter |
| `kapasitasJamMingguan` | number | Wajib, angka **>= 0**, default 40 |
| `aktif` | boolean | Default `true` |
| `warnaAvatar` | string | Kode warna lokal untuk placeholder, default dari daftar tetap |

### 4.3 Project

| Field | Tipe | Aturan validasi |
|---|---|---|
| `id` | string | Unik, otomatis |
| `nama` | string | Wajib, 2–50 karakter |
| `deskripsi` | string | Opsional, maks 200 karakter |

### 4.4 Seed data
- 3 project fiktif, 4 anggota fiktif, **8 tugas contoh**.
- Minimal 1 tugas `assigneeId = null`, minimal 1 tugas `Done`, minimal 1 tugas dengan prioritas `High`.
- Tidak ada nama orang nyata, email, nomor telepon, atau alamat.

### 4.5 Aturan integritas
- Hapus anggota: tugas milik anggota tersebut diubah menjadi `assigneeId = null` (tidak menghapus tugas).
- Hapus project: ditolak jika masih ada tugas yang merujuk, atau semua tugas terkait dipindah ke project default (pilih salah satu, dan tulis di UI).
- Angka negatif, `NaN`, atau string kosong pada field angka wajib ditolak dengan pesan error.

---

## 5. Nonfunctional Requirements

| Aspek | Ketentuan |
|---|---|
| **Teknologi** | Vite + JavaScript vanilla, tanpa framework UI, tanpa backend |
| **Jaringan** | Aplikasi berjalan penuh secara lokal; tidak ada request ke API eksternal; tidak ada API key di mana pun |
| **Performa** | First load < 2 detik pada mesin lokal; pencarian/filter/sort < 200 ms untuk 8–100 tugas |
| **Persistensi** | Semua perubahan tersimpan di `localStorage` dan bertahan setelah reload |
| **Responsif** | Layout nyaman pada lebar 768 px (tablet) hingga 1440 px (desktop); minimal tidak rusak di 375 px |
| **Aksesibilitas dasar** | Semua kontrol form punya label; navigasi keyboard untuk tombol utama; kontras teks memadai |
| **Validasi** | Pesan error tampil di dekat field yang salah dan bersifat spesifik |
| **Keamanan** | Tidak menyimpan kredensial/API key; tidak menjalankan perintah berbahaya; input pengguna di-escape saat dirender (cegah HTML injection) |
| **Privasi** | Data contoh nonpribadi; aplikasi tidak mengirim data ke mana pun |
| **Kompatibilitas** | Chrome/Edge/Firefox versi stabil terbaru |
| **Bahasa & format** | UI berbahasa Indonesia; angka jam memakai format desimal titik; tanggal `YYYY-MM-DD` |

---

## 6. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| `localStorage` penuh atau diblokir (mode privat) | Perubahan tidak tersimpan | Deteksi kegagalan tulis, tampilkan banner peringatan, sediakan tombol export JSON teks ke clipboard |
| Data localStorage rusak/tidak valid | Aplikasi error saat load | Validasi skema saat load; jika gagal, tawarkan reset ke seed data |
| Scope creep (Gantt, auth, integrasi) | Tidak selesai dalam 1 hari | Semua di daftar out-of-scope; review di akhir tiap iterasi |
| Definisi overload ambigu | Hasil workload tidak konsisten | Ambang batas ditetapkan eksplisit: <70% / 70–90% / >90% |
| Perbedaan zona waktu pada deadline | Tugas dianggap telat/lebih awal | Deadline diperlakukan sebagai tanggal kalender lokal, tanpa jam |
| Sorting tidak stabil untuk nilai sama | Urutan berubah-ubah | Gunakan tie-breaker `judul` A–Z |
| Hapus data tanpa sengaja | Data demo hilang | Konfirmasi sebelum hapus + tombol reset seed |
| Seed data ter-overwrite saat development | Uji manual tidak konsisten | Seed hanya dimuat jika key belum ada; reset manual tersedia |

---

## 7. Out-of-Scope

- Autentikasi, login, registrasi, manajemen sesi, atau "login palsu".
- Backend, database server, API, sinkronisasi multi-perangkat, kolaborasi real-time.
- Integrasi pihak ketiga (Slack, WhatsApp API, Google Calendar, email).
- Notifikasi otomatis, email, push notification.
- Timeline/Gantt, kalender, dependency antar tugas, recurring task.
- Time tracking, upload file/gambar (avatar hanya placeholder lokal).
- Multi-workspace/multi-tenant, role permission granular.
- Export CSV/PDF, laporan lanjutan, AI auto-assign.
- Mobile app native.

---

## 8. Acceptance Criteria (dapat diperiksa manual)

**A. Seed & tampilan awal**
1. Buka aplikasi pertama kali → tampil **tepat 8 tugas contoh** dan ringkasan berisi total tugas = 8.
2. Setiap kartu tugas menampilkan judul, project, assignee (atau label "Open"), status, prioritas, deadline, estimasi jam.
3. Minimal satu tugas tampil dengan label "Open" (tanpa assignee).

**B. Pencarian**
4. Ketik kata yang ada pada judul salah satu tugas → hanya tugas yang judul/deskripsinya mengandung kata itu yang tampil.
5. Ketik huruf besar/kecil berbeda (mis. "DESAIN" vs "desain") → hasil sama.
6. Ketik kata yang tidak ada → tampil pesan "Tidak ada tugas yang cocok", bukan daftar kosong tanpa keterangan.

**C. Filter & sorting**
7. Pilih filter status `Done` → hanya tugas berstatus Done yang tampil; jumlah hasil sesuai ringkasan.
8. Pilih filter assignee "Tanpa assignee" → hanya tugas Open yang tampil.
9. Kombinasikan filter status + prioritas → hasil memenuhi kedua kondisi.
10. Sorting "Deadline terdekat" → urutan tanggal naik; tugas tanpa deadline diletakkan paling akhir.
11. Sorting "Estimasi jam terbesar" → angka menurun; jika sama, urutan judul A–Z.

**D. Salin ringkasan**
12. Klik "Salin ringkasan" pada satu kartu → clipboard berisi teks yang memuat judul, assignee, status, dan deadline tugas tersebut; muncul umpan balik "Tersalin".
13. Tidak ada request jaringan yang terjadi saat tombol diklik (cek tab Network).

**E. CRUD dashboard demo**
14. Tambah tugas dengan data valid → tugas muncul di daftar dan total tugas bertambah 1.
15. Tambah tugas dengan judul kosong → form ditolak dan tampil pesan error pada field judul.
16. Tambah tugas dengan `estimasiJam = -5` → ditolak dengan pesan bahwa nilai harus >= 0.
17. Ubah status tugas dari `To Do` ke `Done` → kartu dan ringkasan jumlah Done ikut berubah.
18. Ubah assignee tugas → nama assignee pada kartu berubah dan `updatedAt` bertambah.
19. Hapus tugas dengan konfirmasi → tugas hilang dan total tugas berkurang 1.
20. Hapus anggota yang masih memiliki tugas → tugas terkait berubah menjadi "Open", tugas tidak terhapus.

**F. Persistensi**
21. Tambah 1 tugas lalu reload halaman → tugas tersebut masih ada.
22. Ubah nama anggota lalu reload → perubahan tetap ada.
23. Klik "Reset data contoh" dan konfirmasi → daftar kembali ke 8 tugas contoh awal.

**G. Workload & ringkasan**
24. Anggota dengan total estimasi 20 jam dan kapasitas 40 jam → tampil kategori `Available`.
25. Total 32 jam dari kapasitas 40 jam (80%) → tampil `Normal`.
26. Total 40 jam dari kapasitas 40 jam (100%) → tampil `Overload`.
27. Ringkasan dashboard menampilkan jumlah anggota overload yang sama dengan jumlah baris berlabel `Overload`.

**H. Nonfunctional**
28. Muat ulang halaman dengan tab Network terbuka → tidak ada request ke domain eksternal.
29. Cari teks pada seluruh source (hasil build) untuk pola API key/token → tidak ditemukan.
30. Perkecil jendela ke 768 px → tidak ada elemen yang tumpang tindih atau terpotong.

---

## 9. Implementation Plan per Iterasi

**Iterasi 0 — Fondasi (≈1 jam)**
- Setup Vite + vanilla JS, struktur folder (`src/data`, `src/ui`, `src/store`).
- Tentukan kontrak `localStorage` (`tugaskita.v1`) dan fungsi load/save + fallback seed.
- Buat 8 tugas contoh, 4 anggota, 3 project.
- **Definition of Done:** halaman kosong tampil, data seed terbaca di console, tidak ada error.

**Iterasi 1 — Tampilan daftar + ringkasan (≈1,5 jam)**
- Render kartu tugas, placeholder avatar lokal, area ringkasan cepat.
- Status "Open" untuk tugas tanpa assignee.
- **DoD:** AC 1–3 lulus.

**Iterasi 2 — Pencarian, filter, sorting (≈1,5 jam)**
- State filter di memori + reset filter; empty state.
- Sorting dengan tie-breaker judul.
- **DoD:** AC 4–11 lulus.

**Iterasi 3 — Detail + salin ringkasan (≈1 jam)**
- Panel/modal detail tugas, tombol salin ke clipboard + umpan balik.
- **DoD:** AC 12–13 lulus.

**Iterasi 4 — CRUD tugas & anggota (≈2 jam)**
- Form tambah/ubah dengan validasi field, konfirmasi hapus, aturan integritas hapus anggota/project.
- **DoD:** AC 14–20 lulus.

**Iterasi 5 — Persistensi & reset (≈1 jam)**
- Simpan otomatis setiap mutasi, penanganan gagal tulis, tombol reset seed.
- **DoD:** AC 21–23 lulus.

**Iterasi 6 — Workload view + ringkasan dashboard (≈1 jam)**
- Hitung total jam per anggota, klasifikasi ambang batas, tampilkan jumlah overload.
- **DoD:** AC 24–27 lulus.

**Iterasi 7 — Hardening & uji manual (≈1 jam)**
- Escape input saat render, cek responsif 768 px, audit tidak ada request eksternal/API key.
- Jalankan seluruh AC 1–30 sebagai daftar centang manual.
- **DoD:** semua AC lulus atau tercatat sebagai known issue dengan alasan.