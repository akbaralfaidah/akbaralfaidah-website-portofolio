# PRD — Portofolio akbaralfaidah.com

*Revisi 2 — Hero centerpiece partikel 3D, palet cream/charcoal/brass*

## 1. Overview

Portofolio pribadi Akbar Alfaidah sebagai solo developer (Web Developer, Mobile Developer, AI Engineer). Berfungsi sebagai personal branding, showcase project, dan titik kontak utama untuk calon klien (SME/UMKM/wedding/mahasiswa) maupun koneksi profesional (recruiter, komunitas developer).

## 2. Target Audience

- Calon klien yang menemukan Abay lewat media sosial, rekomendasi, atau pencarian lokal
- Recruiter/koneksi profesional (LinkedIn)
- Komunitas developer/mentor (IndonesiaNEXT, dll)

## 3. Goals & Success Criteria

- Kesan premium & profesional tercapai dalam beberapa detik pertama kunjungan
- Pengunjung langsung paham 3 kompetensi inti: Web, Mobile, AI
- Ada jalur aksi yang jelas: lihat project, hubungi via WhatsApp, atau ke LinkedIn

## 4. Tech Stack

| Kebutuhan | Pilihan |
|---|---|
| Framework | Vite + React |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| Animasi 2D | Framer Motion |
| **3D/Partikel** | `three`, `@react-three/fiber`, `@react-three/drei` |
| Multi-bahasa | react-i18next |
| Theme switcher | React Context + localStorage |
| Ikon tech stack | react-icons (Simple Icons/Devicons) |
| SEO meta | react-helmet-async |
| GitHub contribution graph | Embed gambar dari layanan pihak ketiga |
| Deploy | Docker → GHCR → Coolify (infrastruktur yang sudah dibangun) |

**Catatan adaptasi:** 2 komponen referensi dari 21st.dev (`ScrollExpandMedia`, `ContainerScrollAnimation`) awalnya ditulis untuk Next.js — sebelum dipakai, `next/image` diganti `<img>` biasa dan `'use client'` dihapus (tidak berlaku di Vite). Logic inti (React hooks + Framer Motion) portable tanpa masalah.

## 5. Site Map

- `/` — Landing (Navbar, Hero, About, Projects, Experience, Contact, Footer)
- `/project/:slug` — Halaman detail per project (hero pakai efek Scroll Expand Media)

## 6. Prioritas Pengembangan (Agile — Phase 0 → Layer 1 → Layer 2)

### Phase 0 — Prototipe Berisiko Tinggi (WAJIB divalidasi sebelum lanjut)
- Bangun efek partikel 3D dari foto Abay **secara terpisah**, di luar halaman utama
- Test performa di HP asli (bukan cuma resize browser laptop)
- **Keputusan gerbang**: kalau lancar → lanjut sebagai Hero utama. Kalau berat/patah-patah → fallback ke foto statis dengan styling (tetap masuk Layer 1), efek partikel jadi target Layer 2/eksperimen lanjutan

### Layer 1 — Fondasi
- Semua section berdiri dengan struktur & konten lengkap, Bahasa Indonesia
- Tema Light (Paper/Charcoal/Brass) sebagai satu-satunya tema aktif
- Hero dengan komposisi terpusat (nama besar, role title di sekeliling, visual sesuai hasil Phase 0)
- Routing halaman detail project berfungsi
- Form kontak → redirect WhatsApp berfungsi
- Responsive mobile, animasi dasar (fade/scroll-reveal sederhana)

### Layer 2 — Polish
- Bahasa Inggris (toggle EN/ID), Tema Dark + toggle
- Navbar morph on scroll
- Foto About dengan efek layer/shape
- Monogram "AA" watermark
- **Projects showcase** — tilt 3D on scroll (ContainerScrollAnimation, sudah diadaptasi)
- **Halaman detail project** — Scroll Expand Media (sudah diadaptasi)
- GitHub contribution graph, hover interaction tech icon
- Scroll-linked animation di Experience timeline

## 7. Spesifikasi per Section

### 7.1 Navbar
- Menu: Tentang Saya / Projek / Pengalaman / Mari Diskusi (EN: About / Project / Experience / Let's Work Together)
- Toggle bahasa (ID/EN) & toggle tema (Light/Dark) di sisi kanan navbar
- Default: solid, sudut kotak. Setelah scroll (Layer 2): rounded pill, frosted-glass transparan

### 7.2 Hero — REVISI: Komposisi Terpusat
- Nama besar **Akbar Alfaidah** jadi elemen dominan tengah
- Role title (Web Developer / Mobile Developer / AI Engineer) tersebar di sekeliling nama, asimetris
- **Centerpiece**: foto Abay dirender sebagai efek partikel 3D point-cloud (lihat `design.md` bagian 11 untuk detail teknis & syarat foto)
- Fallback: kalau Phase 0 gagal validasi performa, pakai foto statis dengan styling
- CTA: "Lihat Project" + "LinkedIn"

### 7.3 About
- Copywriting profesional + foto dengan efek panel layer (bukan partikel — cukup 1 kali di Hero)

### 7.4 Projects
- Grid card: nama, stack (ikon), deskripsi singkat, klik → `/project/:slug`
- 1 project unggulan ditampilkan dengan efek tilt-3D-on-scroll (Layer 2)

### 7.5 Experience
- Timeline kronologis, dari pengalaman paling lama ke sekarang
- Scroll-linked animation (Layer 2), GitHub contribution graph, tech stack icon + hover

### 7.6 Contact — "Mari Diskusi"
- Form Nama/Email/Pesan → redirect WhatsApp otomatis (tanpa backend)
- Social links: GitHub, LinkedIn, Instagram

### 7.7 Footer
- Copywriting singkat + `© 2026 Akbar Alfaidah. All rights reserved.`

## 8. Multi-bahasa (i18n)

Default Indonesia, sekunder English. Semua teks lewat react-i18next, tidak hardcode.

## 9. Theming

Default Light (Paper/Charcoal/Brass). Alternatif Dark (kebalikan warna). Tersimpan di localStorage.

## 10. Aset yang Perlu Disiapkan Abay

- [ ] **Foto untuk efek partikel Hero** — kontras jelas subjek vs background (background polos/gelap disarankan), resolusi cukup tinggi
- [ ] Foto profil kedua untuk section About (foto biasa, bisa beda dari foto Hero)
- [ ] Logo "AA" (idealnya SVG)
- [ ] Data tiap project: nama, deskripsi, stack, link live/Play Store, screenshot/video (untuk Scroll Expand Media di halaman detail)
- [ ] Data pengalaman: posisi, institusi, periode, deskripsi
- [ ] Link sosial: GitHub, LinkedIn, Instagram, nomor WhatsApp
- [ ] Copywriting About

## 11. Non-Functional Requirements

- Responsive mobile-first
- Performa: DPR partikel 3D di-cap `[1, 2]`, wajib test HP asli di Phase 0
- Aksesibilitas: focus state `Brass`, hormati `prefers-reduced-motion` (partikel 3D → fallback statis)
- SEO dasar: meta title/description per halaman, Open Graph tags

## 12. Out of Scope (v1)

- Backend/database/CMS untuk data project & experience (hardcode di kode)
- Sistem komentar/like/fitur sosial
- Blog multi-halaman
- GPU shader simulation tingkat lanjut untuk partikel (cukup pakai teknik instancing standar, bukan render-target/FBO simulation)

## 13. Deployment

Build Docker → push ke GHCR via GitHub Actions → Coolify pull & deploy ke VPS DomaiNesia, domain `akbaralfaidah.com` (Cloudflare DNS, SSL Full Strict). Catatan: efek partikel 3D berjalan di browser pengunjung (client-side), tidak membebani VPS.
