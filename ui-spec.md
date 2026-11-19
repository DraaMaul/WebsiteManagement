# UI-SPEC.md — TugasKita (Website Management Pembagian Tugas)

> **Catatan adaptasi:** Dokumen ini memakai kerangka dan tingkat ketelitian UI-SPEC "RasaNusa", tetapi seluruh objek diadaptasi ke aplikasi manajemen tugas **TugasKita** sesuai `SPEC.md`. Identitas warna tetap memakai **krem hangat + hijau rempah**, ditambah warna semantik untuk status, prioritas, dan beban kerja. Tombol WhatsApp pada katalog diganti **tombol "Salin ringkasan"**. Tidak ada kode pada dokumen ini.

---

## 1. Prinsip Desain

1. **Tenang, bukan ramai.** Krem hangat sebagai kanvas; hijau rempah hanya untuk aksi utama dan penanda aktif. Warna semantik dipakai hemat.
2. **Mobile-first.** Semua layout dirancang untuk 375 px lebih dulu, lalu ditingkatkan ke tablet dan desktop.
3. **Informasi tugas terbaca dalam 3 detik.** Judul → assignee → status → deadline → estimasi jam, dalam urutan baca yang konsisten.
4. **Beban kerja terlihat, bukan tersembunyi.** Workload view memakai warna + label teks, bukan warna saja.
5. **Aksesibel sejak awal.** Kontras minimal AA, target sentuh ≥ 44 px, fokus keyboard selalu terlihat, status tidak pernah disampaikan lewat warna saja.
6. **Tanpa aset eksternal.** Avatar memakai placeholder lokal (inisial + warna), bukan gambar dari jaringan.

---

## 2. Design Tokens

### 2.1 Warna

| Token | Nilai | Pemakaian | Kontras terhadap `--bg` |
|---|---|---|---|
| `--bg` | `#FBF6EC` (krem hangat) | Latar halaman | — |
| `--surface` | `#FFFDF8` | Kartu, panel, form | — |
| `--surface-alt` | `#F5EEDF` | Header tabel, area ringkasan | — |
| `--border` | `#E4D8C3` | Garis kartu, divider | 1.3:1 (dekoratif) |
| `--text` | `#22201C` | Teks utama | 14.8:1 ✅ AAA |
| `--text-muted` | `#5C564B` | Teks sekunder, label | 7.1:1 ✅ AAA |
| `--primary` | `#1F4D3A` (hijau rempah tua) | Tombol utama, nav aktif | 9.4:1 ✅ AAA |
| `--primary-hover` | `#173B2C` | Hover/pressed tombol utama | 11.2:1 ✅ |
| `--primary-soft` | `#E3EDE6` | Latar chip aktif, highlight | 8.6:1 dengan `--primary` ✅ |
| `--accent` | `#A8541F` (terracotta rempah) | Aksen sekunder, badge unggulan | 5.3:1 ✅ AA |
| `--focus` | `#0B6E4F` | Outline fokus (3 px) | 5.9:1 ✅ AA |
| `--danger` | `#A3241C` | Hapus, error, Overload | 6.5:1 ✅ AA |
| `--warning` | `#8A5A00` | Normal (workload), peringatan | 5.6:1 ✅ AA |
| `--success` | `#1F6B45` | Done, Available | 6.2:1 ✅ AA |

**Warna status tugas** (semua dipakai sebagai teks + latar chip, bukan teks berwarna di atas latar terang tanpa pengaman):

| Status | Teks | Latar chip | Kontras teks/latar |
|---|---|---|---|
| To Do | `#3C4A5A` | `#E7EBEF` | 8.1:1 ✅ |
| In Progress | `#1F5FA8` | `#E2EBF7` | 6.4:1 ✅ |
| Review | `#8A5A00` | `#F7ECD4` | 5.6:1 ✅ |
| Done | `#1F6B45` | `#DFEFE5` | 6.2:1 ✅ |

**Warna prioritas:** High = `--danger`, Medium = `--warning`, Low = `--text-muted`. Selalu disertai teks label.

**Warna workload:** Available = `--success`, Normal = `--warning`, Overload = `--danger`. Selalu disertai label teks dan ikon.

**Aturan kontras:** Semua teks isi minimal 4.5:1; teks besar (≥ 18.66 px bold / 24 px regular) minimal 3:1; elemen non-teks yang membawa makna (border input, ikon status) minimal 3:1. Warna tidak boleh menjadi satu-satunya pembeda — tambahkan label atau ikon.

### 2.2 Tipografi

- **Keluarga font:** sans-serif sistem — `Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Tanpa unduhan font eksternal.
- **Skala:**

| Token | Ukuran / line-height | Berat | Pemakaian |
|---|---|---|---|
| `--fs-display` | 28 px / 1.2 (mobile) · 36 px / 1.15 (desktop) | 700 | Judul hero |
| `--fs-h2` | 20 px / 1.3 · 24 px / 1.25 | 700 | Judul section, judul dashboard |
| `--fs-h3` | 16 px / 1.35 | 600 | Judul kartu tugas |
| `--fs-body` | 15 px / 1.55 | 400 | Deskripsi, isi form |
| `--fs-sm` | 13 px / 1.45 | 400–600 | Metadata kartu, label chip |
| `--fs-xs` | 12 px / 1.4 | 600 | Label tabel, helper text |

- **Aturan:** maksimal 2 baris untuk judul kartu (line-clamp), maksimal 2 baris deskripsi. Angka memakai `font-variant-numeric: tabular-nums` agar kolom jam rapi.

### 2.3 Spacing, Radius, Elevasi, Gerak

- **Spacing:** skala 4 px — 4, 8, 12, 16, 24, 32, 48. Jarak antar kartu 12 px (mobile) / 16 px (desktop). Padding kartu 16 px. Padding halaman 16 px (mobile) / 24 px (tablet) / 32 px (desktop).
- **Radius:** `--r-sm` 6 px (chip, input), `--r-md` 10 px (kartu, tombol), `--r-lg` 14 px (panel dashboard, modal).
- **Elevasi:** kartu memakai border 1 px + shadow sangat halus (`0 1px 2px rgba(34,32,28,.06)`); modal memakai shadow lebih kuat + overlay `rgba(34,32,28,.45)`.
- **Gerak:** transisi 120–160 ms `ease-out` untuk hover/fokus; tanpa animasi berulang; hormati `prefers-reduced-motion` (matikan transisi non-esensial).

---

## 3. Layout & Breakpoint (Mobile-First)

| Breakpoint | Lebar | Perilaku |
|---|---|---|
| **Mobile** (default) | 375–639 px | 1 kolom; filter dalam panel/akordeon; navbar dengan menu ringkas; dashboard sebagai halaman/tab terpisah |
| **Tablet** | 640–1023 px | Grid kartu 2 kolom; filter tetap dalam panel yang bisa dibuka; ringkasan 2 kolom |
| **Desktop** | ≥ 1024 px | Grid kartu 3 kolom (maks 3, tidak melebar); filter sebagai sidebar kiri 260 px; dashboard dan area tim bisa berdampingan (split 2/3–1/3) bila layar ≥ 1280 px |

- **Kontainer:** maks 1200 px, `margin-inline: auto`.
- **Target sentuh:** semua tombol, chip filter, dan item menu minimal 44×44 px (mobile), 36 px tinggi (desktop).
- **Tanpa horizontal scroll** pada lebar ≥ 320 px. Tabel di dashboard diubah menjadi kartu bertumpuk di mobile, bukan scroll horizontal.
- **Sticky:** header/navbar sticky di atas; filter bar sticky di bawah navbar pada mobile saat daftar digulir.

---

## 4. Struktur Halaman

Aplikasi satu halaman dengan dua mode tampilan pada perangkat yang sama:

1. **Mode Tim** (default) — hero ringkas, ringkasan, filter, grid tugas, aksi salin ringkasan.
2. **Mode Dashboard Demo** — diakses lewat tombol toggle di navbar, bukan login. Menampilkan CRUD tugas/anggota, ringkasan total, dan workload view.

Navigasi antar-mode mempertahankan state filter (kecuali dashboard memakai filternya sendiri).

---

## 5. Komponen

### 5.1 Navbar
- **Isi (mobile):** logo teks "TugasKita" (kiri) + tombol ikon menu (kanan). Menu membuka panel berisi tautan "Tim", "Dashboard", dan tombol "Reset data contoh".
- **Isi (desktop):** logo teks + tautan "Tim" / "Dashboard" + indikator mode aktif (garis bawah `--primary`) + tombol sekunder "Reset data contoh" di kanan.
- **Spesifikasi:** tinggi 56 px (mobile) / 64 px (desktop); latar `--surface`; border bawah 1 px `--border`; sticky; tidak ada tombol login/akun.
- **Aksesibilitas:** tombol menu punya `aria-expanded`, `aria-controls`; tautan aktif punya `aria-current="page"`; fokus terlihat dengan outline `--focus` 3 px offset 2 px.

### 5.2 Hero / Header Halaman
- **Mobile:** judul "Kelola tugas tim tanpa tumpang tindih" (display), subjudul 1–2 baris, dan 3 kartu ringkasan bertumpuk (total tugas, total jam, tugas open).
- **Desktop:** teks di kiri (maks 60% lebar), kartu ringkasan dalam baris 3 kolom di bawahnya.
- **Aturan:** hero tidak memuat gambar/ilustrasi jaringan; boleh memakai blok warna `--primary-soft` sebagai latar.
- **Kontras:** teks hero selalu `--text` di atas `--bg` (bukan teks putih di atas krem).

### 5.3 Kartu Ringkasan (Stat)
- Komponen kecil berisi label (`--fs-sm`, `--text-muted`) + angka besar (`--fs-h2`, tabular-nums) + satuan opsional.
- Contoh stat: Total tugas, Total estimasi jam, Tugas selesai, Tugas tanpa assignee, Anggota overload.
- **Aksesibilitas:** angka tidak dibedakan hanya lewat warna; label selalu ada. Jika berubah karena aksi pengguna, gunakan `aria-live="polite"` pada kontainer ringkasan.

### 5.4 Search Bar
- Input dengan ikon kaca pembesar (ikon dekoratif `aria-hidden`), placeholder "Cari judul atau deskripsi tugas…", tombol bersihkan (×) muncul saat ada teks.
- **Spesifikasi:** tinggi 44 px; radius `--r-md`; border 1 px `--border`, saat fokus border `--focus` + ring 3 px transparan 30%; label terlihat atau `aria-label` yang jelas.
- **Perilaku:** filter instan saat mengetik (debounce ~150 ms), case-insensitive, tanpa reload.

### 5.5 Filter & Sorting
- **Mobile:** baris tombol "Filter" (menampilkan jumlah filter aktif) dan "Urutkan" yang membuka **bottom sheet**. Chip filter aktif tampil di bawah bar dan bisa dihapus satu per satu, plus tombol "Hapus semua".
- **Desktop:** sidebar kiri berisi grup:
  - **Status** (checkbox/chip): To Do, In Progress, Review, Done.
  - **Prioritas:** High, Medium, Low.
  - **Assignee:** daftar anggota + "Tanpa assignee".
  - **Urutkan** (radio/select): Deadline terdekat (default), Prioritas tertinggi, Estimasi jam terbesar, Judul A–Z.
- **Aksesibilitas:** setiap grup punya `fieldset`/`legend` atau heading; chip aktif menyertakan teks (tidak hanya warna), status aktif ditandai `aria-pressed="true"`; hasil filter diumumkan lewat `aria-live="polite"` ("12 tugas ditampilkan").
- **Empty state filter:** tampil pesan "Tidak ada tugas yang cocok" + tombol "Hapus semua filter".

### 5.6 Grid Produk → **Grid Tugas**
- **Kartu tugas berisi (urutan):**
  1. Baris atas: chip status (kiri) + indikator prioritas (chip teks, kanan).
  2. Judul tugas (`--fs-h3`, maks 2 baris).
  3. Nama project (`--fs-sm`, `--text-muted`).
  4. Assignee: avatar placeholder 28 px (inisial + warna) + nama; atau label "Open" dengan gaya garis putus-putus.
  5. Metadata: deadline (`YYYY-MM-DD`, ditandai "Telat" bila lewat) dan estimasi jam ("6,5 jam").
  6. Aksi: tombol sekunder "Detail" + tombol "Salin ringkasan".
  7. Badge unggulan/prioritas tinggi bila `unggulan = true`.
- **Spesifikasi:** latar `--surface`, radius `--r-md`, border 1 px `--border`, padding 16 px; seluruh kartu dapat difokus keyboard; kartu tidak boleh bergantung pada hover untuk informasi penting.
- **Kondisi khusus:** tugas `Done` memakai judul `--text-muted` + garis coret halus, tetap terbaca. Tugas telat menampilkan chip "Telat" (`--danger`) — bukan hanya teks merah.
- **Placeholder avatar lokal:** lingkaran berisi 1–2 inisial, latar dari daftar warna tetap, teks `#FFFFFF` dengan kontras ≥ 4.5:1; `alt`/`aria-label` = nama anggota.

### 5.7 Tombol "Salin Ringkasan" (pengganti tombol WhatsApp)
- Gaya: tombol utama (`--primary`) dengan ikon salin + label "Salin ringkasan".
- Format teks yang disalin (contoh struktur, bukan kode): `[Judul] — [Project] | Assignee: [nama/Open] | Status: [status] | Deadline: [tanggal] | Estimasi: [jam] jam`.
- Umpan balik: toast/inline "Ringkasan disalin" selama ~2 detik, diumumkan via `aria-live="polite"`. Jika clipboard gagal, tampilkan pesan error dan sediakan fallback berupa area teks yang bisa dipilih manual.
- Tidak ada panggilan jaringan; tidak ada ikon/link ke layanan eksternal.

### 5.8 Panel Detail Tugas
- Modal (desktop) / halaman penuh atau bottom sheet (mobile) berisi seluruh field, deskripsi, dan tombol "Ubah", "Hapus", "Tutup".
- Fokus dipindahkan ke judul modal saat dibuka dan dikembalikan ke pemicu saat ditutup; `Esc` menutup; klik overlay menutup; fokus terperangkap di dalam modal.

### 5.9 Dashboard Demo
- **Sub-bagian:** (a) Ringkasan total, (b) Workload per anggota, (c) Tabel/daftar tugas dengan aksi CRUD, (d) Manajemen anggota, (e) Tombol "Reset data contoh".
- **Workload view:** baris per anggota berisi avatar + nama + "32 / 40 jam (80%)" + bar progres + chip kategori (`Available` / `Normal` / `Overload`). Bar progres memakai warna semantik **dan** label teks; nilai persen selalu tertulis.
- **Tabel tugas (desktop):** kolom Judul, Assignee, Status, Prioritas, Deadline, Estimasi, Aksi. Header `--surface-alt`. (Mobile: berubah menjadi daftar kartu ringkas, tanpa scroll horizontal.)
- **Form CRUD:** label di atas field, helper text untuk aturan (mis. "Angka ≥ 0"), pesan error tepat di bawah field terkait dengan ikon + teks (`--danger`), ringkasan error di atas form bila > 1 field salah. Tombol "Simpan" (utama) dan "Batal" (sekunder).
- **Konfirmasi hapus:** dialog dengan nama objek yang akan dihapus, tombol destruktif "Hapus" (`--danger`) dan "Batal" (default fokus pada Batal). Untuk hapus anggota, dialog menjelaskan bahwa tugas terkait akan menjadi "Open".
- **Reset data contoh:** tombol sekunder dengan dialog konfirmasi eksplisit ("Semua perubahan akan hilang").

### 5.10 Toast / Banner
- Toast sukses (hijau) untuk "Tersalin", "Tugas disimpan", "Tugas dihapus".
- Banner peringatan (kuning) untuk kegagalan `localStorage` ("Perubahan tidak dapat disimpan di perangkat ini").
- Banner error (merah) untuk data rusak + tombol "Muat ulang data contoh".
- Semua banner punya tombol tutup dan tidak menutupi tombol utama; diumumkan via `aria-live`.

### 5.11 Tombol & Form (aturan umum)
- Varian: **Primary** (`--primary`), **Secondary** (border `--primary`, latar transparan), **Ghost** (teks `--primary`), **Destructive** (`--danger`).
- Tinggi minimal 44 px (mobile) / 36 px (desktop); radius `--r-md`; label berupa kata kerja ("Simpan", "Salin ringkasan", "Hapus").
- Fokus: outline `--focus` 3 px, offset 2 px, selalu terlihat (jangan `outline: none` tanpa pengganti).
- Disabled: opasitas 0.55 + `cursor: not-allowed` + alasan tersedia lewat teks/`title`.
- Input: `inputmode="decimal"` untuk estimasi jam, `inputmode="numeric"` untuk kapasitas; validasi saat blur dan saat submit; error tidak hanya warna (ada ikon + teks).

---

## 6. Wireframe Teks

### 6.1 Mobile (375 px) — Mode Tim

```
┌─────────────────────────────────────────┐
│ [TugasKita]                      [☰]    │  navbar sticky 56px
├─────────────────────────────────────────┤
│ Kelola tugas tim tanpa tumpang tindih   │  display, 28px
│ Lihat siapa mengerjakan apa, kapan.     │  body, muted
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Total tugas            8            │ │  stat 1 kolom
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Total estimasi         24,5 jam     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Tanpa assignee         2            │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ [🔍 Cari judul atau deskripsi…      ×]  │  input 44px
│ [ Filter (2) ]  [ Urutkan ▾ ]           │  tombol 44px
│ (To Do ×) (High ×)      [Hapus semua]   │  chip aktif
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [To Do]                 [High]      │ │  chip status/prioritas
│ │ Perbaiki alur checkout              │ │  h3, maks 2 baris
│ │ Project: Website Redesign           │ │  sm muted
│ │ (AD) Andi Dwi                       │ │  avatar + nama
│ │ 2026-11-22 · 6,5 jam    [Telat]     │ │  metadata
│ │ [ Detail ]  [ Salin ringkasan ]     │ │  aksi
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [In Progress]          [Medium]     │ │
│ │ Susun copy halaman promo            │ │
│ │ Project: Kampanye Akhir Tahun       │ │
│ │ (BP) Bunga Putri                    │ │
│ │ 2026-11-25 · 4 jam                  │ │
│ │ [ Detail ]  [ Salin ringkasan ]     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [To Do]                   [Low]     │ │
│ │ Lengkapi dokumentasi onboarding     │ │
│ │ Project: Internal                   │ │
│ │ ⌜ Open ⌟  (tanpa assignee)          │ │  label Open
│ │ — · 2 jam                           │ │
│ │ [ Detail ]  [ Salin ringkasan ]     │ │
│ └─────────────────────────────────────┘ │
│           … 5 kartu lainnya …           │
├─────────────────────────────────────────┤
│ [Toast: Ringkasan disalin]              │  aria-live
└─────────────────────────────────────────┘
```

**Bottom sheet filter (mobile):**
```
┌─────────────────────────────────────────┐
│ Filter                            [×]   │
│ Status                                  │
│  [x] To Do   [ ] In Progress            │
│  [ ] Review  [ ] Done                   │
│ Prioritas                               │
│  [ ] High  [x] Medium  [ ] Low          │
│ Assignee                                │
│  [x] Andi Dwi  [ ] Bunga Putri          │
│  [ ] Citra  [x] Tanpa assignee          │
│ [ Reset filter ]      [ Terapkan ]      │
└─────────────────────────────────────────┘
```

### 6.2 Mobile (375 px) — Mode Dashboard Demo

```
┌─────────────────────────────────────────┐
│ [TugasKita]                      [☰]    │
├─────────────────────────────────────────┤
│ Dashboard demo                          │
│ (tanpa login — data lokal perangkat)    │
│ ┌───────────┬───────────┐               │
│ │ 8 tugas   │ 4 anggota │               │  stat 2 kolom
│ └───────────┴───────────┘               │
│ ┌───────────┬───────────┐               │
│ │ 24,5 jam  │ 1 overload│               │
│ └───────────┴───────────┘               │
├─────────────────────────────────────────┤
│ Beban kerja anggota                     │
│ (AD) Andi Dwi        32/40 · 80%        │
│ ████████████████░░░  [Normal]           │
│ (BP) Bunga Putri     44/40 · 110%       │
│ ███████████████████  [Overload]         │
│ (CT) Citra Lestari   12/40 · 30%        │
│ ██████░░░░░░░░░░░░░  [Available]        │
├─────────────────────────────────────────┤
│ Tugas                    [ + Tambah ]   │
│ ┌─────────────────────────────────────┐ │
│ │ Perbaiki alur checkout              │ │
│ │ Andi · To Do · High · 6,5 jam       │ │
│ │ [Ubah] [Hapus]                      │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Susun copy halaman promo            │ │
│ │ Bunga · In Progress · Medium · 4 j  │ │
│ │ [Ubah] [Hapus]                      │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Anggota                  [ + Tambah ]   │
│ (AD) Andi Dwi · Designer · 40 j/mgg     │
│      [Ubah] [Hapus]                     │
├─────────────────────────────────────────┤
│ [ Reset data contoh ]                   │  sekunder, konfirmasi
└─────────────────────────────────────────┘
```

### 6.3 Desktop (≥ 1024 px) — Mode Tim

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TugasKita      Tim   Dashboard                       [Reset data contoh]      │  navbar 64px
├──────────────────────────────────────────────────────────────────────────────┤
│  Kelola tugas tim tanpa tumpang tindih        ┌──────────┬──────────┬────────┐│
│  Lihat siapa mengerjakan apa, kapan, dan      │ 8 tugas  │ 24,5 jam │ 2 open ││  hero + stat
│  seberapa berat bebannya.                     └──────────┴──────────┴────────┘│
├───────────────┬──────────────────────────────────────────────────────────────┤
│ FILTER        │ [🔍 Cari judul atau deskripsi…                          ×]   │
│               │ Urutkan: [Deadline terdekat ▾]        12 tugas ditampilkan   │
│ Status        │                                                              │
│ [x] To Do     │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐        │
│ [ ] In Prog.  │ │[To Do][High]  │ │[In Prog][Med] │ │[Review][High] │        │
│ [ ] Review    │ │Perbaiki alur  │ │Susun copy     │ │Review desain  │        │
│ [x] Done      │ │checkout       │ │halaman promo  │ │halaman utama  │        │
│               │ │Website Redesign│ │Kampanye Akhir │ │Website Redesign│       │
│ Prioritas     │ │(AD) Andi Dwi  │ │(BP) Bunga P.  │ │(CT) Citra L.  │        │
│ [ ] High      │ │2026-11-22     │ │2026-11-25     │ │2026-11-24     │        │
│ [x] Medium    │ │6,5 jam [Telat]│ │4 jam          │ │3 jam          │        │
│ [ ] Low       │ │[Detail][Salin]│ │[Detail][Salin]│ │[Detail][Salin]│        │
│               │ └───────────────┘ └───────────────┘ └───────────────┘        │
│ Assignee      │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐        │
│ [x] Andi Dwi  │ │[To Do][Low]   │ │[Done][Medium] │ │[To Do][High]  │        │
│ [ ] Bunga P.  │ │Lengkapi dok.  │ │Update aset    │ │Siapkan QA     │        │
│ [ ] Citra L.  │ │onboarding     │ │brand          │ │checklist      │        │
│ [x] Tanpa     │ │Internal       │ │Internal       │ │Website Redesign│       │
│     assignee  │ │⌜Open⌟         │ │(BP) Bunga P.  │ │(AD) Andi Dwi  │        │
│               │ │— · 2 jam      │ │2026-11-20     │ │2026-11-26     │        │
│ [Hapus semua] │ │[Detail][Salin]│ │[Detail][Salin]│ │[Detail][Salin]│        │
│               │ └───────────────┘ └───────────────┘ └───────────────┘        │
│               │                    … 2 kartu lainnya …                       │
├───────────────┴──────────────────────────────────────────────────────────────┤
│ [Toast: Ringkasan disalin]                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Desktop (≥ 1280 px) — Mode Dashboard Demo

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TugasKita      Tim   [Dashboard]                     [Reset data contoh]      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Dashboard demo — data lokal, tanpa login                                     │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐                     │
│ │8 tugas   │4 anggota │24,5 jam  │3 selesai │1 overload│                     │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘                     │
├──────────────────────────────────┬───────────────────────────────────────────┤
│ BEBAN KERJA ANGGOTA              │ RINGKASAN STATUS                          │
│ (AD) Andi Dwi   32/40 · 80%      │ To Do        3  ██████░░░░                │
│ ████████████████░░░░ [Normal]    │ In Progress  2  ████░░░░░░                │
│ (BP) Bunga P.   44/40 · 110%     │ Review       1  ██░░░░░░░░                │
│ ████████████████████ [Overload]  │ Done         2  ████░░░░░░                │
│ (CT) Citra L.   12/40 · 30%      │                                           │
│ ██████░░░░░░░░░░░░░░ [Available] │                                           │
├──────────────────────────────────┴───────────────────────────────────────────┤
│ TUGAS                                                     [ + Tambah tugas ]  │
│ ┌───────────────┬──────────┬────────────┬──────────┬──────────┬───────────┐  │
│ │ Judul         │ Assignee │ Status     │ Prioritas│ Deadline │ Aksi      │  │
│ ├───────────────┼──────────┼────────────┼──────────┼──────────┼───────────┤  │
│ │ Perbaiki alur │ Andi Dwi │ [To Do]    │ [High]   │2026-11-22│Ubah Hapus │  │
│ │ Susun copy    │ Bunga P. │ [In Prog.] │ [Medium] │2026-11-25│Ubah Hapus │  │
│ │ Lengkapi dok. │ Open     │ [To Do]    │ [Low]    │ —        │Ubah Hapus │  │
│ └───────────────┴──────────┴────────────┴──────────┴──────────┴───────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│ ANGGOTA                                                  [ + Tambah anggota ] │
│ (AD) Andi Dwi · Designer · 40 jam/mgg · Aktif          [Ubah] [Hapus]        │
│ (BP) Bunga Putri · Copywriter · 40 jam/mgg · Aktif     [Ubah] [Hapus]        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.5 Wireframe dialog konfirmasi hapus (semua ukuran)

```
┌─────────────────────────────────────────┐
│ Hapus tugas?                      [×]   │
│ "Perbaiki alur checkout" akan dihapus   │
│ permanen dari perangkat ini.            │
│            [ Batal ]   [ Hapus ]        │  fokus awal: Batal
└─────────────────────────────────────────┘
```

---

## 7. State & Microcopy

| State | Tampilan | Teks |
|---|---|---|
| Kosong (belum ada tugas) | Ilustrasi teks sederhana + CTA | "Belum ada tugas. Tambah tugas pertama di dashboard demo." |
| Kosong (hasil filter) | Pesan + tombol | "Tidak ada tugas yang cocok." [Hapus semua filter] |
| Gagal simpan | Banner kuning | "Perubahan tidak dapat disimpan di perangkat ini. Data hanya bertahan di sesi ini." |
| Data rusak | Banner merah | "Data lokal tidak dapat dibaca." [Muat ulang data contoh] |
| Salin berhasil | Toast hijau | "Ringkasan disalin." |
| Salin gagal | Toast merah | "Gagal menyalin. Pilih teks di panel detail secara manual." |
| Form invalid | Error per field | "Judul wajib diisi (3–80 karakter)." / "Estimasi jam harus angka ≥ 0." |
| Hapus anggota | Dialog | "Tugas milik anggota ini akan menjadi Open. Lanjutkan?" |
| Reset seed | Dialog | "Semua perubahan akan hilang dan 8 tugas contoh dimuat ulang." |

---

## 8. Aksesibilitas (Checklist Wajib)

1. Kontras teks ≥ 4.5:1 (isi) dan ≥ 3:1 (teks besar) — terverifikasi untuk semua pasangan token di §2.1.
2. Status, prioritas, dan kategori workload **selalu** memakai teks label + warna + (opsional) ikon; tidak ada informasi yang hanya warna.
3. Target sentuh ≥ 44×44 px di mobile.
4. Fokus keyboard terlihat pada semua elemen interaktif (`--focus`, 3 px, offset 2 px); urutan tab mengikuti urutan visual.
5. Semua input punya label terprogram; pesan error terhubung ke field (`aria-describedby`) dan diumumkan.
6. Modal: fokus terperangkap, `Esc` menutup, fokus kembali ke pemicu.
7. Perubahan jumlah hasil filter dan toast diumumkan via `aria-live="polite"` (tanpa mengganggu).
8. Struktur heading berurutan (h1 → h2 → h3); landmark `header`, `nav`, `main`, `aside`, `footer`.
9. Ikon dekoratif `aria-hidden="true"`; ikon yang bermakna punya label teks.
10. Zoom 200% tanpa kehilangan konten atau fungsi; tidak ada teks dalam gambar.
11. `prefers-reduced-motion` dihormati.
12. Bahasa dokumen `lang="id"`.

---

## 9. Traceability ke Acceptance Criteria `SPEC.md`

| AC di SPEC.md | Elemen UI pada dokumen ini |
|---|---|
| 1–3 (seed & kartu) | §5.6 Grid Tugas, §6.1/6.3 wireframe |
| 4–6 (pencarian + empty state) | §5.4 Search Bar, §7 state kosong |
| 7–11 (filter & sorting) | §5.5 Filter & Sorting, §6.1 bottom sheet, §6.3 sidebar |
| 12–13 (salin ringkasan, tanpa jaringan) | §5.7 Tombol "Salin ringkasan" |
| 14–20 (CRUD & validasi) | §5.9 Dashboard Demo, §5.11 Form, §6.5 dialog hapus |
| 21–23 (persistensi & reset) | §7 banner gagal simpan, §5.9 tombol reset |
| 24–27 (workload & ringkasan) | §5.9 Workload view, §5.3 Stat, §6.2/6.4 wireframe |
| 28–29 (tanpa request eksternal / tanpa API key) | §1 prinsip 6, §5.7 catatan, §2.2 font sistem |
| 30 (responsif 768 px) | §3 breakpoint & aturan tanpa scroll horizontal |

---

## 10. Catatan Implementasi Visual (bukan kode)

- Definisikan semua token di satu tempat (CSS custom properties) agar konsisten dan mudah diuji.
- Placeholder avatar dibuat dari komponen fungsi: inisial + warna dari daftar tetap (mis. 6 warna) yang dipilih deterministik dari `id`.
- Bar progres workload memakai `role="progressbar"` dengan `aria-valuenow`/`aria-valuemin`/`aria-valuemax` dan teks persen di sampingnya.
- Tabel dashboard diubah menjadi daftar kartu pada mobile melalui CSS layout, bukan dua markup berbeda.
- Seluruh ikon berupa SVG inline lokal, bukan font ikon atau CDN.
- Uji visual manual: 375 px, 768 px, 1024 px, 1440 px; cek mode fokus keyboard dan zoom 200%.