# Design Document — Portofolio akbaralfaidah.com

*Revisi 2 — palet warna cream/charcoal, Hero centerpiece partikel 3D*

## 1. Arah Desain

Subjek: portofolio solo developer Indonesia (Web, Mobile, AI) yang menyasar kesan **premium dan profesional** — bukan portofolio "template developer" generik, karena audiensnya termasuk calon klien SME/UMKM yang menilai kepercayaan dari kesan visual pertama.

Tesis desain: **precision meets warmth** — presisi teknis (grid rapi, tipografi tegas, aksen monospace ala kode, foto dirender jadi data partikel) dipadu kehangatan cream-kertas dan aksen brass/kuningan yang terasa personal & mewah, bukan korporat dingin.

## 2. Token Warna

| Nama | Hex (Light) | Hex (Dark) | Peran |
|---|---|---|---|
| **Paper** | `#FAF8ED` | — | Background utama tema Light (cream hangat, kayak kertas premium) |
| **Charcoal** | `#2F3135` | — | Teks utama di tema Light; jadi **background** di tema Dark |
| **Brass** | `#A9762E` | `#D4A24C` | SATU-SATUNYA aksen interaktif (CTA, link aktif, hover glow, focus ring) — dicerahkan di Dark biar kontras tetap kebaca |
| **Mist** | `#EFE9D8` | `#3A3C41` | Tint halus untuk card/border |

**Tema Dark = kebalikan dari Light**: background jadi `Charcoal (#2F3135)`, teks jadi `Paper (#FAF8ED)`. `Brass` tetap jadi satu-satunya aksen di kedua tema.

**Prinsip pemakaian:** `Brass` HANYA untuk elemen interaktif — jangan dipakai dekorasi random. Di luar itu, palet ini sengaja dibuat nyaris monokrom (cream + charcoal) supaya `Brass` terasa istimewa tiap kali muncul.

## 3. Tipografi

| Peran | Font | Alasan |
|---|---|---|
| **Display** | **Fraunces** | Serif hangat & editorial — kontras dengan sans di body |
| **Body** | **Plus Jakarta Sans** | Sans humanis modern, lahir dari komisi Pemkot Jakarta — detail personal untuk developer asal Indonesia |
| **Utility/Mono** | **JetBrains Mono** | Font dunia coding, dipakai di tag stack/tanggal — menegaskan identitas developer |

## 4. Signature Element

**Monogram "AA"** — sekarang di-render dalam warna `Charcoal` (Light) / `Paper` (Dark), outline tipis opacity rendah, muncul berulang di beberapa section dengan posisi & rotasi berbeda.

## 5. Prinsip Motion

- Satu momen animasi "diorkestrasi" per section — jangan ditumpuk di satu titik
- 3 teknik berat (partikel 3D, tilt scroll, expand media) **disebar ke 3 momen berbeda**, bukan ditumpuk di Hero semua (detail di bagian 11)
- Hormati `prefers-reduced-motion` di semua animasi

## 6. Hero — REVISI: Komposisi Terpusat

- **Bukan lagi** split kiri-teks/kanan-foto. Sekarang: nama "Akbar Alfaidah" jadi elemen dominan di tengah, role title (Web Developer / Mobile Developer / AI Engineer) tersebar di beberapa sudut mengelilingi nama (asimetris, bukan simetris kaku)
- **Centerpiece**: foto Abay yang di-render sebagai efek **partikel 3D point-cloud** (lihat bagian 11 untuk detail teknis) — muncul di tengah/belakang komposisi teks, sedikit interaktif terhadap gerakan mouse/scroll
- CTA "Lihat Project" + "LinkedIn" tetap ada, posisi menyesuaikan komposisi baru (bukan lagi sejajar di bawah teks kiri)
- Monogram "AA" mengintip di salah satu sudut sebagai layer tambahan

## 7. About

- Foto (foto biasa, bukan partikel — efek berat cukup 1 kali di Hero) dengan panel solid `Charcoal` di belakangnya, offset kanan-bawah ~16px, menciptakan efek layer/depth

## 8. Projects

- Grid card standar (nama, tech stack icon, deskripsi singkat)
- Hover (Layer 2): card terangkat, border jadi `Brass`
- **Showcase reveal** (lihat bagian 11): 1 project unggulan ditampilkan pakai teknik tilt-3D-on-scroll (ContainerScrollAnimation)

## 9. Experience

- Timeline vertikal kronologis (justified — urutan karier memang linear)
- Scroll-linked progress line (Layer 2), warna `Brass`
- Tanggal/institusi pakai JetBrains Mono
- GitHub contribution graph di-embed di bawah

## 10. Contact & Footer

- Form Nama/Email/Pesan → redirect WhatsApp
- Footer background `Charcoal`, teks `Paper`, copyright kecil font Mono

## 11. Teknik 3D & Scroll Interaktif — Peta Penempatan

Tiga teknik berat, masing-masing dapat momen sendiri (bukan ditumpuk):

### A. Hero — Partikel 3D dari Foto (Phase 0, prototipe duluan sebelum section lain)
- Stack: `three`, `@react-three/fiber`, `@react-three/drei`
- Teknik: foto di-decode lewat canvas → tiap pixel disample jadi 1 titik → dirender sebagai `THREE.Points` dengan instancing (bukan 1 geometry per titik — itu bakal berat)
- Interaksi: rotasi idle halus + sedikit respons ke posisi mouse
- **Syarat foto**: kontras jelas subjek vs background (background polos/gelap), biar hasil partikelnya kebaca bentuknya
- **Wajib ditest di HP asli SEBELUM lanjut bangun section lain.** Kalau berat/patah-patah, fallback ke foto statis biasa (styling seperti section About)

### B. Projects Showcase — Tilt 3D on Scroll (Layer 2)
- Sumber: `ContainerScrollAnimation` (dari 21st.dev)
- **Perlu adaptasi**: ganti `import Image from 'next/image'` jadi `<img>` biasa (project ini Vite, bukan Next.js); `'use client'` boleh dihapus (gak berlaku di Vite)
- Dipakai untuk reveal 1 project unggulan dengan efek card yang tilt 3D saat discroll ke section Projects

### C. Halaman Detail Project — Scroll Expand Media (Layer 2)
- Sumber: `ScrollExpandMedia` (dari 21st.dev)
- **Perlu adaptasi sama**: ganti `next/image` → `<img>`, hapus `'use client'`
- Dipakai sebagai hero halaman `/project/:slug` — screenshot/video project itu membesar saat pengunjung scroll masuk ke halaman detail

## 12. Responsive

- Hero: komposisi terpusat tetap coba dipertahankan di mobile, tapi partikel 3D di-cap resolusi/DPR lebih rendah demi performa (pelajaran dari optimasi Three.js di hackathon kemarin — cap `dpr={[1, 2]}`)
- Navbar, Projects grid, Timeline: mengikuti spesifikasi sebelumnya (collapse/stack di mobile)

## 13. Aksesibilitas & Restraint

- Focus ring warna `Brass`
- Kontras `Charcoal` di atas `Paper` (dan sebaliknya di Dark) dicek memenuhi WCAG AA
- `prefers-reduced-motion`: partikel 3D fallback ke foto statis, animasi scroll lain di-nonaktifkan

## 14. Checklist Layer & Fase

**Phase 0 (SEBELUM section lain dibangun):**
- [ ] Prototipe efek partikel 3D dari foto, test di HP asli, validasi performa

**Layer 1 (Fondasi):**
- [ ] Struktur semua section + konten Bahasa Indonesia
- [ ] Tema Light (Paper/Charcoal/Brass/Mist)
- [ ] Tipografi 3 peran terpasang
- [ ] Hero dengan foto (partikel ATAU fallback statis, tergantung hasil Phase 0)
- [ ] Animasi dasar (fade/scroll-reveal)
- [ ] Responsive mobile

**Layer 2 (Polish):**
- [ ] Tema Dark + toggle
- [ ] Bahasa Inggris + toggle
- [ ] Navbar morph on scroll
- [ ] About photo layer effect
- [ ] Monogram "AA" watermark di semua section
- [ ] Projects showcase tilt-3D (ContainerScrollAnimation, sudah diadaptasi ke Vite)
- [ ] Halaman detail project — ScrollExpandMedia (sudah diadaptasi ke Vite)
- [ ] Timeline scroll-linked progress
- [ ] GitHub contribution graph
- [ ] Hover interaction tech icon & project card
