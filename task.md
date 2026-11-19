# TASKS.md — TugasKita (Website Management Pembagian Tugas)

> **Dasar:** `SPEC.md` (fitur MVP, acceptance criteria AC 1–30) dan `UI-SPEC.md` (token, komponen, wireframe, checklist aksesibilitas).
> **Adaptasi dari versi katalog:** milestone "katalog" → **daftar tugas**; milestone "WhatsApp" → **tombol Salin ringkasan**; ditambah **workload view** pada milestone dashboard.
> **Tidak ada kode pada dokumen ini.** Estimasi total ≈ 8–9 jam (latihan 1 hari).

---

## 0. Konvensi

- **ID tugas:** `M<milestone>-T<n>` (mis. `M2-T3`).
- **Estimasi:** dalam jam orang.
- **Kolom "Berkas mungkin berubah"** berisi berkas yang *direncanakan* (belum tentu sudah ada). Jika nama final berbeda, perbarui kolom ini saat implementasi.
- **AC tiap tugas** harus bisa diperiksa manual dan ditelusuri ke AC `SPEC.md`.
- **Definition of Done umum (berlaku semua tugas):**
  1. AC tugas terpenuhi dan dicentang di `docs/AC-CHECKLIST.md`.
  2. Tidak ada error di console saat alur normal.
  3. Tidak ada request jaringan eksternal baru (cek tab Network).
  4. Tidak ada string yang terlihat seperti API key/token.
  5. Perilaku konsisten di 375 px dan 1280 px.
  6. Kode di-commit dengan pesan yang menyebut ID tugas.

### Struktur berkas yang direncanakan

```
index.html
package.json
vite.config.js
.gitignore
README.md
docs/
  AC-CHECKLIST.md
  TEST-PLAN.md
  SECURITY.md
  DEPLOY.md
  RISKS.md
public/
  favicon.svg
src/
  main.js
  styles/
    tokens.css
    base.css
    layout.css
    components.css
  store/
    storage.js
    seed.js
    state.js
    mutations.js
  ui/
    navbar.js
    hero.js
    stats.js
    taskCard.js
    taskList.js
    filters.js
    sort.js
    search.js
    detailModal.js
    confirmDialog.js
    toast.js
    dashboard.js
    workload.js
    memberForm.js
    taskForm.js
    avatar.js
  utils/
    format.js
    validate.js
    escape.js
    id.js
    clipboard.js
```

---

## M0 — Scaffold (≈1 jam)

**Tujuan milestone:** proyek Vite + JS vanilla berjalan lokal, struktur folder & token siap, skema penyimpanan dan seed data disepakati. **Exit criteria:** halaman kosong tampil tanpa error; seed terbaca di console; tidak ada dependensi jaringan.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M0-T1 | Inisialisasi proyek Vite + JS vanilla, set `lang="id"`, struktur folder sesuai rencana | 0,2 | `npm run dev` menyajikan halaman; tidak ada framework UI; `index.html` memuat `src/main.js`; tidak ada CDN/font eksternal | `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `.gitignore` |
| M0-T2 | Definisikan design tokens (warna, tipografi, spacing, radius, elevasi, fokus) sesuai UI-SPEC §2 | 0,2 | Token warna & font tersedia global; nilai sama dengan tabel UI-SPEC §2.1–2.2; tidak ada unduhan font | `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/layout.css`, `src/styles/components.css` |
| M0-T3 | Tetapkan kontrak `localStorage` key `tugaskita.v1` + fungsi load/save + fallback seed | 0,2 | Key & bentuk objek terdokumentasi di README; load mengembalikan objek valid; save mengembalikan status berhasil/gagal | `src/store/storage.js`, `src/store/state.js`, `README.md` |
| M0-T4 | Buat seed data: 3 project, 4 anggota fiktif, **8 tugas** (≥1 tanpa assignee, ≥1 Done, ≥1 High), tanpa data pribadi | 0,2 | Seed berisi tepat 8 tugas; tidak ada nama orang nyata/email/telepon/alamat; seed hanya dimuat jika key belum ada | `src/store/seed.js`, `docs/AC-CHECKLIST.md` |
| M0-T5 | Siapkan utilitas dasar: generator id, format tanggal/jam/angka, escape HTML, validasi | 0,2 | Id unik untuk 100 pembuatan berturut-turut; jam tampil desimal titik; tanggal `YYYY-MM-DD`; escape menetralkan `<`, `>`, `&`, kutip | `src/utils/id.js`, `src/utils/format.js`, `src/utils/escape.js`, `src/utils/validate.js` |

**Ketergantungan:** M0 harus selesai sebelum M1–M5. M0-T2 memblokir pekerjaan UI mana pun.

---

## M1 — Daftar Tugas / "Katalog" (≈1,5 jam)

**Tujuan:** mode Tim menampilkan navbar, hero, ringkasan, dan grid kartu tugas (termasuk placeholder avatar lokal dan label "Open"). **Exit criteria:** AC SPEC 1–3 lulus.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M1-T1 | Navbar (logo teks, tautan Tim/Dashboard, tombol reset, menu ringkas mobile, indikator aktif) | 0,3 | Navbar sticky; tautan aktif ditandai `aria-current="page"`; tombol menu punya `aria-expanded`; tinggi 56/64 px; target sentuh ≥44 px di mobile; tidak ada tombol login/akun | `src/ui/navbar.js`, `src/styles/components.css`, `index.html` |
| M1-T2 | Hero + stat ringkasan (total tugas, total estimasi jam, tugas tanpa assignee) | 0,3 | Stat menampilkan angka sesuai data seed; label selalu ada; angka memakai tabular-nums; `aria-live="polite"` pada kontainer stat; kontras teks memenuhi §2.1 | `src/ui/hero.js`, `src/ui/stats.js`, `src/styles/layout.css` |
| M1-T3 | Komponen avatar placeholder lokal (inisial + warna deterministik dari id) | 0,2 | Avatar tampil tanpa request jaringan; warna dipilih deterministik dari `id`; `aria-label` = nama anggota; kontras inisial ≥4.5:1 | `src/ui/avatar.js`, `src/styles/components.css`, `public/favicon.svg` |
| M1-T4 | Kartu tugas sesuai UI-SPEC §5.6 (status, prioritas, judul, project, assignee/Open, deadline, estimasi, aksi) | 0,4 | Kartu menampilkan semua field wajib; judul maks 2 baris; tugas tanpa assignee berlabel "Open"; tugas Done memakai judul muted + coret halus namun tetap terbaca; status & prioritas selalu berlabel teks, bukan warna saja | `src/ui/taskCard.js`, `src/ui/taskList.js`, `src/styles/components.css` |
| M1-T5 | Render daftar dari state + grid responsif (1/2/3 kolom) | 0,3 | Grid 1 kolom di 375 px, 2 kolom ≥640 px, 3 kolom ≥1024 px; maks 3 kolom, tidak melebar; tanpa horizontal scroll di ≥320 px; **AC SPEC 1–3 lulus** | `src/ui/taskList.js`, `src/main.js`, `src/styles/layout.css` |

**Ketergantungan:** M0 selesai. M1-T4 memblokir M2 dan M3.

---

## M2 — Interaksi Pencarian, Filter, Sorting (≈1,5 jam)

**Tujuan:** pencarian, filter, dan sorting bekerja instan dengan empty state dan pengumuman hasil. **Exit criteria:** AC SPEC 4–11 lulus.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M2-T1 | Search bar (debounce ~150 ms, case-insensitive, tombol bersihkan) | 0,3 | Mencari pada judul & deskripsi; "DESAIN" dan "desain" memberi hasil sama; tombol × muncul saat ada teks dan mengosongkan input; input berlabel; tinggi 44 px; **AC SPEC 4–5 lulus** | `src/ui/search.js`, `src/store/state.js`, `src/styles/components.css` |
| M2-T2 | Panel filter mobile (bottom sheet) + sidebar filter desktop | 0,4 | Grup Status/Prioritas/Assignee punya legend/heading; chip aktif `aria-pressed="true"`; tombol "Filter (n)" menampilkan jumlah aktif; "Hapus semua" mengosongkan filter; perilaku sama di kedua breakpoint; **AC SPEC 7–9 lulus** | `src/ui/filters.js`, `src/styles/layout.css`, `src/styles/components.css` |
| M2-T3 | Sorting (deadline, prioritas, estimasi, judul) dengan tie-breaker judul A–Z | 0,3 | Deadline naik, tanpa deadline di akhir; estimasi menurun; nilai sama diurutkan judul A–Z; default "Deadline terdekat"; **AC SPEC 10–11 lulus** | `src/ui/sort.js`, `src/store/state.js` |
| M2-T4 | Empty state + pengumuman hasil (`aria-live`) | 0,2 | Filter tanpa hasil menampilkan "Tidak ada tugas yang cocok" + tombol hapus filter; jumlah hasil diumumkan santai tanpa mengganggu; **AC SPEC 6 lulus** | `src/ui/taskList.js`, `src/ui/filters.js`, `src/styles/components.css` |
| M2-T5 | Kombinasi pencarian + filter + sorting & reset state | 0,3 | Filter status + prioritas menghasilkan irisan yang benar; pencarian bekerja bersama filter; reset mengembalikan seluruh daftar | `src/store/state.js`, `src/main.js` |

**Ketergantungan:** M1-T4 selesai. M2-T2/T3 memblokir M6 (uji filter) .

---

## M3 — Tombol "Salin Ringkasan" (pengganti WhatsApp) (≈1 jam)

**Tujuan:** pengguna dapat menyalin ringkasan tugas ke clipboard dengan umpan balik jelas, tanpa jaringan. **Exit criteria:** AC SPEC 12–13 lulus.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M3-T1 | Komponen tombol "Salin ringkasan" di kartu (varian primary, ikon salin) | 0,2 | Tombol punya label teks + ikon dekoratif `aria-hidden`; tinggi ≥44 px mobile; fokus terlihat (`--focus` 3 px offset 2 px) | `src/ui/taskCard.js`, `src/styles/components.css` |
| M3-T2 | Susun format teks ringkasan (judul, project, assignee/Open, status, deadline, estimasi) + aksi salin | 0,3 | Clipboard berisi seluruh field dengan urutan konsisten; tugas Open tertulis "Open"; deadline kosong ditulis "—"; **AC SPEC 12 lulus** | `src/utils/clipboard.js`, `src/ui/taskCard.js`, `src/ui/detailModal.js` |
| M3-T3 | Umpan balik sukses/gagal + fallback manual | 0,3 | Toast "Ringkasan disalin" muncul ≤2 detik dan diumumkan `aria-live`; jika gagal, toast error + panel detail menyediakan teks yang bisa dipilih manual; tidak ada request jaringan saat klik; **AC SPEC 13 lulus** | `src/ui/toast.js`, `src/ui/detailModal.js`, `src/styles/components.css` |
| M3-T4 | Panel detail tugas (modal desktop / sheet mobile) dengan tombol Ubah/Hapus/Tutup | 0,2 | Fokus pindah ke judul modal saat buka, kembali ke pemicu saat tutup; `Esc` menutup; fokus terperangkap; semua field tampil | `src/ui/detailModal.js`, `src/styles/components.css` |

**Ketergantungan:** M1-T4. Tidak boleh ada tautan/ikon ke layanan eksternal (batasan SPEC §5).

---

## M4 — CRUD Dashboard Demo + Workload (≈2 jam)

**Tujuan:** dashboard demo dapat menambah/ubah/hapus tugas & anggota dengan validasi, serta menampilkan ringkasan total dan beban kerja. **Exit criteria:** AC SPEC 14–20 dan 24–27 lulus.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M4-T1 | Kerangka dashboard: sub-bagian ringkasan, workload, tugas, anggota, reset | 0,3 | Dashboard dapat dibuka dari navbar tanpa login; state filter mode Tim tidak rusak saat bolak-balik; heading berurutan h1→h2→h3 | `src/ui/dashboard.js`, `src/ui/navbar.js`, `src/styles/layout.css` |
| M4-T2 | Form tambah/ubah tugas + validasi field | 0,4 | Judul 3–80 karakter wajib; estimasi angka ≥0 (tolak -5, NaN, kosong); `assigneeId` opsional; `projectId` wajib dan valid; error tampil di bawah field + ikon + teks, terhubung `aria-describedby`; ringkasan error bila >1 field salah; **AC SPEC 14–17 lulus** | `src/ui/taskForm.js`, `src/utils/validate.js`, `src/store/mutations.js` |
| M4-T3 | Hapus tugas & hapus anggota dengan aturan integritas | 0,4 | Dialog konfirmasi menyebut nama objek, fokus awal pada Batal; hapus tugas mengurangi total 1; hapus anggota mengubah tugas terkait menjadi Open (tidak menghapus tugas); hapus project yang masih dipakai ditolak/ dipindah sesuai aturan tertulis; **AC SPEC 18–20 lulus** | `src/ui/confirmDialog.js`, `src/store/mutations.js`, `src/ui/dashboard.js` |
| M4-T4 | CRUD anggota (nama, peran, kapasitas jam/minggu, aktif) | 0,3 | Tambah/ubah/hapus anggota berfungsi; kapasitas ≥0 wajib; anggota nonaktif tidak muncul sebagai pilihan assignee baru tetapi tetap tampil di data lama | `src/ui/memberForm.js`, `src/store/mutations.js`, `src/ui/dashboard.js` |
| M4-T5 | Tabel tugas desktop → daftar kartu di mobile + aksi Ubah/Hapus | 0,2 | Tabel punya header `--surface-alt`; di mobile berubah menjadi kartu tanpa scroll horizontal; tombol aksi punya label teks | `src/ui/dashboard.js`, `src/styles/components.css`, `src/styles/layout.css` |
| M4-T6 | Workload view: total jam/anggota, bar progres, kategori Available/Normal/Overload | 0,3 | 20/40 jam → Available; 32/40 (80%) → Normal; 40/40 (100%) → Overload; bar memakai `role="progressbar"` + `aria-valuenow`; persen selalu tertulis; kategori memakai label teks, bukan hanya warna; **AC SPEC 24–26 lulus** | `src/ui/workload.js`, `src/styles/components.css` |
| M4-T7 | Ringkasan total dashboard (tugas, anggota, jam, status, jumlah overload) | 0,1 | Jumlah overload di ringkasan = jumlah baris berlabel Overload; angka berubah setelah mutasi; **AC SPEC 27 lulus** | `src/ui/stats.js`, `src/ui/dashboard.js` |

**Ketergantungan:** M0-T3 (mutations), M1-T3 (avatar), M3-T4 (modal) untuk pola dialog.

---

## M5 — localStorage: Persistensi & Reset (≈1 jam)

**Tujuan:** semua mutasi tersimpan otomatis, bertahan setelah reload, dan bisa direset ke seed. **Exit criteria:** AC SPEC 21–23 lulus.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M5-T1 | Simpan otomatis setiap mutasi (tugas, anggota, project) | 0,3 | Tambah 1 tugas lalu reload → tugas masih ada; ubah nama anggota lalu reload → perubahan tetap; **AC SPEC 21–22 lulus** | `src/store/storage.js`, `src/store/mutations.js`, `src/main.js` |
| M5-T2 | Deteksi kegagalan tulis (penuh/mode privat) + banner peringatan | 0,2 | Banner kuning muncul saat penulisan gagal; teks sesuai UI-SPEC §7; banner punya tombol tutup; aplikasi tidak crash | `src/ui/toast.js`, `src/store/storage.js`, `src/styles/components.css` |
| M5-T3 | Validasi skema saat load + jalur pemulihan data rusak | 0,3 | Data tidak valid → banner merah + tombol "Muat ulang data contoh"; data valid → aplikasi tampil normal; tidak ada error tak tertangani | `src/store/storage.js`, `src/store/state.js`, `src/ui/toast.js` |
| M5-T4 | Tombol "Reset data contoh" + dialog konfirmasi | 0,2 | Konfirmasi menyebut "Semua perubahan akan hilang"; setelah reset, daftar kembali ke 8 tugas seed; **AC SPEC 23 lulus** | `src/ui/confirmDialog.js`, `src/store/mutations.js`, `src/ui/navbar.js` |
| M5-T5 | Opsi export teks JSON ke clipboard (mitigasi risiko SPEC §6) | 0,0–0,2 *(opsional bila waktu tersisa)* | Menyalin JSON state ke clipboard; tidak ada request jaringan; tidak wajib untuk MVP | `src/utils/clipboard.js`, `src/ui/dashboard.js` |

**Ketergantungan:** M0-T3, M4 (semua mutasi). M5-T4 memblokir uji M6-T4.

---

## M6 — Testing Manual & Aksesibilitas (≈1 jam)

**Tujuan:** seluruh AC SPEC 1–30 dapat diperiksa manual dengan hasil tercatat. **Exit criteria:** checklist terisi; tidak ada AC gagal tanpa catatan known issue.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M6-T1 | Susun `docs/TEST-PLAN.md` (data uji, langkah, expected result per AC) | 0,2 | Setiap AC SPEC 1–30 punya langkah & expected result; tercantum cara reset data sebelum uji | `docs/TEST-PLAN.md` |
| M6-T2 | Jalankan uji fungsional: seed, pencarian, filter, sorting, salin, CRUD, persistensi, workload | 0,3 | Semua AC 1–27 dicentang atau diberi catatan; temuan dicatat dengan langkah reproduksi | `docs/AC-CHECKLIST.md` |
| M6-T3 | Uji responsif 375/768/1024/1440 px | 0,15 | Tidak ada elemen tumpang tindih/terpotong; tidak ada horizontal scroll di ≥320 px; tabel dashboard berubah jadi kartu di mobile; **AC SPEC 30 lulus** | `docs/AC-CHECKLIST.md`, `src/styles/layout.css` |
| M6-T4 | Audit aksesibilitas manual: keyboard, fokus, kontras, label, `aria-live`, modal, zoom 200%, reduced-motion | 0,25 | Semua 12 butir checklist UI-SPEC §8 lulus; urutan tab mengikuti visual; modal mengembalikan fokus; zoom 200% tidak menghilangkan konten | `docs/AC-CHECKLIST.md`, `src/styles/base.css`, `src/ui/*.js` |
| M6-T5 | Uji edge case: judul 3 & 80 karakter, estimasi 0, kapasitas 0, filter tanpa hasil, tugas tanpa deadline, hapus anggota bertugas | 0,1 | Semua edge case berperilaku sesuai validasi SPEC §4; pesan error spesifik dan terbaca | `docs/AC-CHECKLIST.md` |

**Ketergantungan:** M1–M5 selesai.

---

## M7 — Security & Privasi (≈0,5 jam)

**Tujuan:** memastikan tidak ada rahasia, tidak ada request eksternal, dan input aman dirender. **Exit criteria:** AC SPEC 28–29 lulus.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M7-T1 | Audit tidak ada API key/token/kredensial di repo & hasil build | 0,1 | Pencarian pola `api_key`, `token`, `secret`, `bearer` pada source & `dist/` tidak menemukan nilai nyata; tidak ada berkas `.env` ter-commit; **AC SPEC 29 lulus** | `.gitignore`, `docs/SECURITY.md`, `README.md` |
| M7-T2 | Audit request jaringan: pastikan nol request ke domain eksternal | 0,1 | Tab Network saat load + semua interaksi hanya memuat aset lokal/origin sendiri; font sistem; ikon SVG inline; avatar lokal; **AC SPEC 28 lulus** | `docs/SECURITY.md`, `index.html`, `src/styles/tokens.css` |
| M7-T3 | Pastikan semua input pengguna di-escape saat dirender (cegah HTML injection) | 0,15 | Judul berisi `<b>x</b>` tampil sebagai teks, tidak dirender sebagai HTML; deskripsi & nama anggota sama; tidak ada penggunaan `innerHTML` dengan data pengguna tanpa escape | `src/utils/escape.js`, `src/ui/taskCard.js`, `src/ui/dashboard.js` |
| M7-T4 | Verifikasi batasan: tanpa login palsu, tanpa backend, data contoh nonpribadi, tanpa perintah berbahaya | 0,15 | Tidak ada form login/kredensial/penyimpanan sesi; tidak ada panggilan backend; seed tidak memuat data pribadi; tidak ada skrip yang menjalankan perintah sistem | `docs/SECURITY.md`, `src/store/seed.js`, `package.json` |

**Ketergantungan:** M6-T2 (butuh aplikasi berjalan penuh).

---

## M8 — Build (≈0,3 jam)

**Tujuan:** build produksi bersih dan dapat dijalankan lokal. **Exit criteria:** `npm run build` sukses, preview berfungsi, ukuran wajar.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M8-T1 | Konfigurasi build Vite & jalankan build | 0,1 | `npm run build` selesai tanpa error/warning kritis; `dist/` berisi `index.html` + aset lokal; tidak ada aset dari domain eksternal | `vite.config.js`, `package.json` |
| M8-T2 | Verifikasi hasil build via `npm run preview` | 0,1 | Semua AC utama tetap lulus di build produksi (minimal AC 1, 4, 12, 14, 21, 24); tidak ada error console | `docs/AC-CHECKLIST.md` |
| M8-T3 | Cek ukuran & catat di README | 0,1 | Total aset JS+CSS wajar untuk latihan 1 hari (target < 300 KB, tanpa aset biner besar); angka dicatat di README | `README.md` |

**Ketergantungan:** M6 dan M7 selesai (build terakhir setelah audit).

---

## M9 — Deployment (≈0,5 jam)

**Tujuan:** aplikasi dapat diakses dari hosting statis dengan dokumentasi langkah. **Exit criteria:** URL live berfungsi; `docs/DEPLOY.md` lengkap.

| ID | Tugas | Estimasi | Acceptance criteria | Berkas mungkin berubah |
|---|---|---|---|---|
| M9-T1 | Tulis `docs/DEPLOY.md` (prasyarat, perintah build, unggah `dist/`, rollback) | 0,15 | Langkah dapat diikuti orang lain tanpa bertanya; mencantumkan bahwa aplikasi 100% statis & tanpa backend | `docs/DEPLOY.md`, `README.md` |
| M9-T2 | Konfigurasi base path bila di-deploy ke sub-path | 0,15 | Aset termuat benar di sub-path; tidak ada 404 aset; navigasi tetap berfungsi | `vite.config.js`, `docs/DEPLOY.md` |
| M9-T3 | Deploy ke hosting statis (mis. GitHub Pages/Netlify) dan uji asap | 0,2 | URL live dapat dibuka; seed muncul (8 tugas); pencarian, filter, salin ringkasan, tambah tugas, dan persistensi setelah reload berfungsi; tidak ada request eksternal | `docs/DEPLOY.md`, `docs/AC-CHECKLIST.md` |
| M9-T4 | Catat known issues & batasan (tanpa backend, data per perangkat, tanpa multi-user) | 0,1 | `README.md` memuat bagian "Batasan" yang sesuai SPEC §7 (out-of-scope) | `README.md`, `docs/RISKS.md` |

**Ketergantungan:** M8 selesai.

---

## Matriks Ketergantungan Ringkas

```
M0 ──► M1 ──► M2 ──┐
        │          ├──► M6 ──► M7 ──► M8 ──► M9
        └► M3 ──┐  │
                 ├──┴► M4 ──► M5 ──┘
                 └───────────┘
```

- **M0** memblokir semua.
- **M1** memblokir M2, M3, M4.
- **M4** memblokir M5.
- **M6** membutuhkan M1–M5.
- **M7** membutuhkan M6.
- **M8** setelah M6 & M7.
- **M9** setelah M8.

---

## Traceability AC `SPEC.md` → Tugas

| AC SPEC | Tugas penanggung jawab |
|---|---|
| 1–3 (seed & kartu) | M0-T4, M1-T4, M1-T5 |
| 4–6 (pencarian & empty state) | M2-T1, M2-T4 |
| 7–11 (filter & sorting) | M2-T2, M2-T3, M2-T5 |
| 12–13 (salin ringkasan, tanpa jaringan) | M3-T2, M3-T3 |
| 14–20 (CRUD & validasi) | M4-T2, M4-T3, M4-T4 |
| 21–23 (persistensi & reset) | M5-T1, M5-T4 |
| 24–27 (workload & ringkasan) | M4-T6, M4-T7 |
| 28–29 (tanpa request eksternal / tanpa API key) | M7-T1, M7-T2 |
| 30 (responsif 768 px) | M6-T3, M1-T5, M4-T5 |

---

## Ringkasan Estimasi

| Milestone | Estimasi |
|---|---|
| M0 Scaffold | 1,0 jam |
| M1 Daftar tugas | 1,5 jam |
| M2 Pencarian/filter/sorting | 1,5 jam |
| M3 Salin ringkasan | 1,0 jam |
| M4 CRUD dashboard + workload | 2,0 jam |
| M5 localStorage | 1,0 jam |
| M6 Testing & aksesibilitas | 1,0 jam |
| M7 Security | 0,5 jam |
| M8 Build | 0,3 jam |
| M9 Deployment | 0,5 jam |
| **Total** | **≈10,3 jam (termasuk buffer kecil)** |

Jika waktu terbatas 1 hari, prioritaskan **M0–M5 + M6-T2/T3 + M7-T1/T2 + M8**. Tugas opsional yang bisa dipotong lebih dulu: **M5-T5**, **M9-T2** (jika deploy di root), dan sebagian butir audit aksesibilitas lanjutan di **M6-T4** — tetapi catat sebagai known issue, bukan dihapus tanpa jejak.