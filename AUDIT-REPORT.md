# Audit Menyeluruh & Rencana Upgrade - `akbaralfaidah.com`

**Tanggal Audit:** 16 November 2026  
**Target:** `https://akbaralfaidah.com` + source code lokal (`c:\Users\akbar\Desktop\akbaralfaidah`, commit `7b68bcd`)  
**Mode:** Read-only audit + live verification lewat Playwright MCP (tidak ada file kode proyek yang diubah)  
**Skill yang Digunakan:** `design-taste-frontend`, `ui-ux-pro-max`, `design-system`, `ui-styling`, `brand`, `banner-design`, `code-review-excellence`, `design`

---

## Ringkasan Eksekutif

**Verdict Jujur:** Secara teknis stack sudah modern (React 19, Vite 8, Tailwind, Supabase, Cloudflare Turnstile, Coolify), tetapi secara eksekusi **website ini mengalami kebocoran kualitas di empat titik fatal sekaligus**:

1. **Identitas & Conversion (5 detik pertama):** H1 hanya menulis nama pribadi (`Akbar Alfaidah`) tanpa menyebut jasa/spesialisasi/posisi Anda ("freelance developer" vs "Tech Agency"), `Services` memakai wireframe palsu yang bertabrakan dengan teks, dan `Testimonials` memakai kartu X/Twitter palsu yang justru merusak kepercayaan.
2. **Performa & CSP Self-Sabotage:** CSP memblokir inline `onload` font Google sehingga **font display `Outfit` dan `JetBrains Mono` tidak pernah ter-load di production**, aset proyek di `/` masih menarik **~5,99 MB SVG mentah dari Supabase Storage**, dan logo SVG navbar/favicon (`181 KB`) ternyata PNG 1536×1024 yang dibungkus `<svg>`.
3. **Scroll & Mobile UX:** `YouCanScroll` memaksa pengunjung melakukan **4.092 px scroll-jacking** hanya untuk daftar 10 frasa yang bahkan **terpotong di layar 375 px**; di tablet `768 px` orbit Hero terpotong dan navbar menumpuk; di mobile `375 px` kartu testimoni meluber keluar layar dan link menu mobile melompat tertutup header.
4. **SEO & Aksesibilitas:** Proyek baru dari dashboard (`caterly`, `minum-vr9`) **otomatis mendapat `<meta name="robots" content="noindex,nofollow">`** akibat fallback `ProjectProgress`; route 404 menampilkan layar putih kosong; tidak ada dukungan `prefers-reduced-motion`; focus ring keyboard hilang pada tombol `AnimatedButton` dan link navbar; serta banyak teks gagal rasio kontras WCAG 2.1 AA (serendah `2.27:1`–`3.95:1`).

### Skor Audit per Area (Skala 1–10)

| Area Audit                        |         Skor | Alasan Utama                                                                                                                                                                                                                                                                                         | Skill Acuan                                            |
| --------------------------------- | -----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **1. Anti-Slop & Orisinalitas**   | **3.5 / 10** | Wireframe dummy macOS/iPhone di `Services`, 4 floating pill animasi di `About`, fake X/Twitter cards bertabur centang biru & likes artifisial, plus hero 3D card orbit yang tidak klikabel.                                                                                                          | `design-taste-frontend`, `design`                      |
| **2. UI & Design System**         | **4.5 / 10** | Token warna/tipografi terpecah (`Poppins` vs `Outfit` yang gagal load, hardcoded hex `#A9762E`/`#B5915F`, `dark:border-charcoal` terbalik jadi putih di dark mode), ukuran `H2` tidak konsisten (`48px`–`72px`), 3 library ikon campur aduk, tombol berbeda-beda antar halaman.                      | `design-system`, `ui-styling`, `ui-ux-pro-max`         |
| **3. UX & Conversion Flow**       | **4.5 / 10** | Hero tidak menjelaskan value proposition dalam 5 detik, `YouCanScroll` membajak 4.092 px scroll tanpa nilai konversi, sub-halaman `/projects` & `/project/:slug` tanpa navbar, studi kasus proyek terlalu dangkal & penuh key details generik.                                                       | `ui-ux-pro-max`, `design-taste-frontend`               |
| **4. Aksesibilitas (a11y)**       | **3.5 / 10** | Kontras gagal AA di banyak elemen (`2.27:1`–`3.95:1`), 0 dukungan `prefers-reduced-motion`, focus ring hilang di nav links & `AnimatedButton`, label tombol dibaca 2× oleh screen reader, 100 ikon marquee berlabel `"Technology Icon"`, hamburger `36×36px` (< 44 px), skip `H2 → H4`.              | `ui-ux-pro-max`, `ui-styling`, `design-taste-frontend` |
| **5. Performa & Core Web Vitals** | **4.0 / 10** | CLS=0 & `bosdepot.webp` LCP cepat di hero, tetapi font display gagal load (CSP), 4 gambar `#projects` live menarik 5,99 MB SVG, `unbackground.svg` 181 KB di-fetch 2×, 4 rAF/CSS loop berjalan terus, dan `supabase` 208 KB di-load eager di root.                                                   | `code-review-excellence`, `design-taste-frontend`      |
| **6. SEO & Metadata**             | **4.0 / 10** | `caterly` (proyek baru) terkena `noindex,nofollow`, URL verifikasi Google masuk `sitemap.xml`, `sitemap.xml` hanya memuat 4 dari 10 proyek, tidak ada `og:image`/`twitter:card`/`canonical`, `<title>` & `html[lang]` statis di semua route/bahasa.                                                  | `design-taste-frontend`, `banner-design`               |
| **7. Kualitas Kode & Keamanan**   | **5.0 / 10** | Crash bug `ReferenceError: fallbackProjects is not defined` di `fetchProjects()`, 25 warning `oxlint` & dead code (`EXPERIENCES`, `TECH_CATEGORIES`, `FluidDropdown`, `ScrollExpandMedia`, `Sandbox`), static assets kehilangan security headers di Nginx, Turnstile & rate limit hanya client-side. | `code-review-excellence`                               |
| **8. Branding & Tone of Voice**   | **4.0 / 10** | Positioning ambigu ("solo freelancer Jambi" vs "Akbar Alfaidah - Tech Agency"), typo fatal `"Terpecaya"`, `"Aplikasi mu?"`, dan `"and weddings in Jambi"` (EN), campur bahasa EN/ID di `/projects`, `/project/:slug`, dan kartu Maps.                                                                | `brand`, `banner-design`, `design-taste-frontend`      |

---

## FASE 1 - Pemahaman Project (Read-Only)

_(Skill yang digunakan: `code-review-excellence`, `design-system`, `ui-styling`, `brand`)_

### 1.1 Pemahaman Tentang Project Ini

Website `akbaralfaidah.com` adalah **SPA portfolio & lead-generation website** untuk **Akbar Alfaidah** (developer Web, Mobile, dan AI berbasis di Kota Jambi), yang juga terhubung ke ekosistem internal (`work.akbaralfaidah.com` sebagai admin dashboard privat yang mengelola data proyek dan client progress tracker).

- **Stack Teknis:** React `19.2.7`, Vite `8.1.1`, React Router DOM `7.18.1`, Tailwind CSS `3.4.19`, Framer Motion `12.43.0`, GSAP `3.15.0` (`ScrollTrigger`), Lenis `1.3.25`, `i18next` / `react-i18next` (ID default, EN sekunder), `@supabase/supabase-js` `2.112.3`, `@emailjs/browser` `4.4.1`, `@marsidev/react-turnstile` `1.6.0`, plus 3 library ikon (`lucide-react`, `react-icons`, SVG custom).
- **Tujuan Website:** Meyakinkan calon klien lokal Jambi maupun remote (UMKM, instansi pemerintahan, perusahaan, dan klien personal) dalam hitungan detik untuk melihat karya nyata, memahami kapabilitas Web/Mobile/AI, lalu mengonversi mereka menjadi lead lewat **WhatsApp** atau **Email**. Selain itu menyediakan URL privat pelacakan progres klien (`/project/:token`).

### 1.2 Arsitektur, Routing & Struktur Folder

- **Entry & Root Shell:** [index.html](file:///c:/Users/akbar/Desktop/akbaralfaidah/index.html) → [src/main.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/main.jsx) → [src/App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx).
- **Routing (`BrowserRouter` di [src/App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L120-L124)):**
  - `/` → [HomePage.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/HomePage.jsx) (merender `Navbar`, `Hero`, dan 7 lazy-loaded sections masing-masing di dalam `<Suspense>` sendiri: `YouCanScroll`, `About`, `Services`, `Projects`, `Experience`, `TestimonialsSection`, `Contact`, lalu `Footer`).
  - `/projects` → [Projects.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/Projects.jsx) (katalog semua proyek + filter kategori; tanpa `Navbar`).
  - `/project/:token` → `ProjectRoute` di [src/App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L46-L77):
    - Jika slug ada di `STATIC_PORTFOLIO_SLUGS` (8 slug lama) → [ProjectDetail.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectDetail.jsx).
    - Jika cocok pola hex 32–64 char atau UUID → [ProjectProgress.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectProgress.jsx) (client tracker privat).
    - Selain itu (termasuk slug proyek baru dari dashboard!) → merender `ProjectProgress` dulu dengan prop `fallbackComponent={<ProjectDetail />}`.
  - Tidak ada route wildcard `*` (404).
- **File Tidak Terpakai / Yatim:** [src/App.css](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.css), [src/components/ProjectCard.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ProjectCard.jsx), [src/components/ui/FluidDropdown.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/FluidDropdown.jsx), [src/components/ui/ScrollExpandMedia.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/ScrollExpandMedia.jsx), [src/pages/Sandbox.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/Sandbox.jsx) (mereferensikan `HeroParticle` yang tidak ada), serta folder tak sengaja `Users/` di root repo, `output.css`, `split.cjs`, `download.cjs`, `screenshot.js`, `lighthouse-*.json`.

### 1.3 State, Data Flow & Integrasi Eksternal

- **Supabase ([src/lib/supabase.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/lib/supabase.js), [src/data/projects.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/data/projects.js)):**
  - `PageTracker` di [App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L80-L109) mengirim `INSERT` ke tabel `page_views` (`path`, `browser` = `navigator.userAgent`, `device_type`) di setiap navigasi route (dengan filter string UA `bot`/`headless`/`lighthouse`).
  - `fetchProjects()` & `fetchProjectBySlug()` membaca view `public_projects_view` dengan timeout 3 detik (`Promise.race`) dan memory cache `cachedProjects`.
  - `ProjectProgress` memanggil RPC `get_project_progress({ p_token })`.
- **Contact Form, Turnstile & EmailJS ([src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx)):**
  - Dual mode (`WhatsApp` via `wa.me` deep link vs `Email` via `@emailjs/browser`).
  - Proteksi anti-spam: honeypot field tersembunyi (`website_url`), widget Cloudflare Turnstile (`@marsidev/react-turnstile`), cek `ALLOWED_ORIGINS` di `window.location.hostname`, dan rate limit di `localStorage` key `_cl_rl` (max 3/hari, cooldown 60 detik).
- **Theme & i18n:**
  - `useTheme()` ([src/hooks/useTheme.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/hooks/useTheme.js)) memakai local `useState` + `localStorage('theme')` + toggle class `.dark` di `<html>` (bukan React Context, sehingga state React antar-komponen tidak sinkron).
  - `i18next` ([src/i18n/index.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/i18n/index.js)) hardcode `lng: 'id'`, memuat JSON `id.json` dan `en.json` ke bundle utama.
- **SEO, Schema & Build/Deploy:**
  - Meta dasar + CSP meta + Google Fonts + JSON-LD `ProfessionalService` di [index.html](file:///c:/Users/akbar/Desktop/akbaralfaidah/index.html).
  - `vite-plugin-sitemap` di [vite.config.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/vite.config.js#L9-L19) (membuat `sitemap.xml` statis untuk `/projects` + 4 slug saja).
  - Pipeline CI/CD ([.github/workflows/deploy.yml](file:///c:/Users/akbar/Desktop/akbaralfaidah/.github/workflows/deploy.yml)): push ke `main` → Docker multi-stage build ([Dockerfile](file:///c:/Users/akbar/Desktop/akbaralfaidah/Dockerfile) `node:22-alpine` → `nginx:alpine` dengan [nginx.conf](file:///c:/Users/akbar/Desktop/akbaralfaidah/nginx.conf)) dengan build-args `VITE_*` → push GHCR → webhook deploy ke Coolify. Ada juga [.github/workflows/keep-alive.yml](file:///c:/Users/akbar/Desktop/akbaralfaidah/.github/workflows/keep-alive.yml) yang ping Supabase tiap 5 hari.

### 1.4 Catatan Design System Saat Ini

- **Palet Warna ([src/index.css](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/index.css#L38-L50), [tailwind.config.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/tailwind.config.js#L10-L15)):**
  - Token `:root` (Light): `--color-paper: #FAFAFA`, `--color-charcoal: #2C2E32`, `--color-brass: #9E7A3C`, `--color-mist: #F0F0F0`.
  - Token `.dark`: `--color-paper: #1A1A1C`, `--color-charcoal: #F2F0E8` (nama variabel `charcoal` berubah menjadi warna terang!), `--color-brass: #C9983F`, `--color-mist: #3A3C41`.
  - **Ketidakkonsistenan:** PRD/Design doc menyebut Paper `#FAF8ED` (warm cream) dan Brass `#A9762E`, sedangkan kode mencampur `#FAFAFA`, `#FAF8ED`, `#F7F5EE`, `#2C2E32`, `#2D2E32`, `#A9762E`, `#B5915F`, `#222428`, `#2A2C30`, `#111113`, plus biru/ungu/merah/hijau acak di ikon badge & wireframe.
- **Tipografi:**
  - `tailwind.config.js` mendeklarasikan `sans: ['Poppins', 'Outfit', ...]`, `display: ['Outfit', ...]`, `mono: ['JetBrains Mono', ...]`.
  - Di kode, hanya `Poppins` (400–700) yang di-host lokal (`/fonts/poppins-*.woff2`), sementara `Outfit` & `JetBrains Mono` dari Google Fonts gagal aktif di browser karena bug CSP.
- **Spacing, Radius, Shadow & Motion:** Tidak ada spacing/radius/elevation scale terpusat; card memakai campuran `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-[2rem]`, `rounded-[2.5rem]`; motion mencampur CSS `@keyframes`, `requestAnimationFrame` manual (`OrbitColumn`, `MobileCarousel`), Framer Motion (`whileInView`, `useScroll`, `useAnimationFrame`), GSAP `ScrollTrigger` pin, dan Lenis rAF loop.

### 1.5 Daftar Asumsi Eksplisit

1. **Positioning Brand:** Prompt menyebut `"freelance developer / Akbar Alfaidah - Tech Agency"`, sedangkan seluruh copy saat ini berbicara sebagai individu (`"Saya"`, `"Mari Diskusi"`, `"Tentang Saya"`). Diasumsikan Anda ingin memposisikan brand secara konsisten-baik sebagai **Agency/Studio yang dipimpin Akbar Alfaidah** maupun **Solo Senior Developer dengan standar agency**-dan tidak lagi mencampur keduanya secara ambigu.
2. **Keabsahan Data Proyek & Link Live:** URL pada proyek seperti `https://bosdepot.com`, `https://chattask.app`, `https://jokipro.com`, dan `https://siabsen.univ.edu` tidak dibuka/diverifikasi satu per satu; `siabsen.univ.edu` tampak seperti URL placeholder (domain `.univ.edu` tidak lazim untuk universitas Indonesia). Diasumsikan Anda perlu memverifikasi mana proyek yang punya live URL valid dan mana yang seharusnya bertipe internal/offline system.
3. **Database Supabase Production (`public_projects_view` & RLS):** Saya tidak memiliki akses admin ke Supabase Studio sehingga struktur RLS `page_views`, `projects`, dan implementasi SQL RPC `get_project_progress` di server production bersifat **tidak terverifikasi**.

---

## FASE 2 - Ringkasan Audit Live via Playwright MCP

_(Skill yang digunakan: `ui-ux-pro-max`, `design-taste-frontend`, `code-review-excellence`, `banner-design`)_

Audit dilakukan langsung pada `https://akbaralfaidah.com` di 3 viewport: **Desktop (`1440×900`)**, **Tablet (`768×1024`)**, dan **Mobile (`375×812`)**, dalam mode **Light & Dark**, bahasa **ID & EN**, serta pengujian rute `/projects`, `/project/bosdepot`, `/project/caterly`, `/project/invalid-token-audit-check`, dan `/halaman-tidak-ada-404`. _(Tidak membuka `work.akbaralfaidah.com`, tidak men-submit form ke production, tidak melewati Turnstile.)_

### Fakta Terukur dari Browser Production:

- **Console Errors & Warnings:**
  - Error pertama tepat saat load di `https://akbaralfaidah.com/:42`: `Refused to execute inline event handler because it violates the following Content Security Policy directive: "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com"` (memblokir `onload="this.media='all'"` Google Fonts).
  - Error/warning tambahan berasal dari widget pihak ketiga Cloudflare Turnstile (`postMessage` target origin warning, WebGL adapter warning, `data:,` CSP log internal iframe Turnstile).
- **Font Loading:** `document.fonts` hanya berisi `Poppins` (400, 500, 600, 700). **`Outfit` dan `JetBrains Mono` statusnya tidak dimuat sama sekali**, sehingga seluruh heading `H1–H4` jatuh ke `system-ui` (`Segoe UI` di Windows).
- **Network & Asset Payload:**
  - `unbackground.svg` berukuran **181.470 bytes** (`132.636 B` transfer) di-request **2×** (favicon + `<img>`) memakan durasi hingga **1.222 ms**.
  - 4 proyek unggulan di `#projects` masih menarik file `.svg` dari Supabase Storage dengan ukuran terukur: `1786517225519.svg` (**2.936.838 B / 2,87 MB**), `1786517312437.svg` (**1.351.061 B / 1,32 MB**), `1786517236603.svg` (**853.277 B / 833 KB**), dan `1786517260076.svg` (**845.455 B / 826 KB**) - total **5.986.631 bytes (~5,99 MB)** untuk tampilan card `468×293 px`.
- **Performance & Layout Metrics (`1440×900`):**
  - `CLS` awal = `0`, `LCP` = `232 ms` (`/img/bosdepot.webp` di Hero).
  - Total `scrollHeight` halaman utama = **13.304 px** (~14,8 layar desktop), di mana `#about` baru dimulai pada `y = 4.902 px` karena `YouCanScroll` membentang `y = 810..4902 px` (**4.092 px**!).
- **HTTP Headers Live:**
  - Dokumen HTML `/` punya `x-frame-options: SAMEORIGIN`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, **tetapi tidak memiliki HTTP `Content-Security-Policy`, `Strict-Transport-Security`, maupun `Permissions-Policy`**.
  - Aset statis (`/fonts/poppins-400.woff2`) hanya memiliki `cache-control: public, max-age=31536000, immutable` - **seluruh security header hilang** di response aset statis.
- **Kontras Warna Terukur (WCAG 2.1 AA butuh ≥ 4.5:1 teks normal, ≥ 3.0:1 teks besar):**
  - `white` di `#22C55E` (toggle WA aktif): **2.28:1** ❌
  - `charcoal/40` di `#FAFAFA`: **2.27:1** ❌
  - `charcoal/50` di `#FAFAFA`: **2.91:1** ❌
  - `#B5915F` di `#FFFFFF`: **2.92:1** ❌
  - `brass (#9E7A3C)` di `#FAFAFA`: **3.79:1** ❌ (gagal untuk teks kecil `12px–16px`)
  - `charcoal/60` di `#FAFAFA`: **3.80:1** ❌
  - `white` di `#A9762E` (`AnimatedButton` brass): **3.95:1** ❌
  - `cream/40` di `#1A1A1C` (dark mode): **3.50:1** ❌
  - `charcoal` di `#FAFAFA` (`13.03:1`), `charcoal/70` (`5.11:1`), `cream/70` di `#1A1A1C` (`8.00:1`), `brassDark #C9983F` di `#1A1A1C` (`6.66:1`) ✅
- **Interaktivitas, Keyboard, Viewport & Route Lain:**
  - `Tab` keyboard: Link navbar (`Tentang Saya`, `Projek`, `Pengalaman`) dan seluruh `AnimatedButton` (`Hubungi`, `Mari Diskusi`, `Lihat Portofolio`) **tidak menampilkan focus ring sama sekali**.
  - `prefers-reduced-motion: reduce`: Orbit Hero (`orbitMovedUnderReducedMotion: true`) dan `MeshGradient` (`animationName: "mesh-float-1"`) **tetap bergerak**.
  - Klik link di Mobile Menu: halaman melompat ke `#about` di `top: 0`, **tertutup navbar setinggi 90 px**.
  - Mobile `375×812`: **20 target sentuh < 44 px** (termasuk tombol hamburger `36×36 px`), `YouCanScroll` terpotong kanan, kartu testimoni ke-5 terpotong kanan, wireframe Services bertabrakan dengan teks.
  - Tablet `768×1024`: Link `"Tentang Saya"` terlipat 2 baris, Orbit Hero terpotong di tepi kanan, `YouCanScroll` mengintip di bagian bawah Hero, `+` di Services menumpuk huruf judul/isi, kartu testimoni ke-5 terpotong kanan.
  - Validasi Form Kontak: Klik submit dengan form kosong memunculkan toast error di `top-6` yang **menutupi floating navbar dan tembus pandang menabrak teks navbar**.
  - `/project/caterly`: terdeteksi `meta[name="robots"] = "noindex,nofollow"` dan `meta[name="referrer"] = "no-referrer"`.
  - `/halaman-tidak-ada-404`: layar kosong tanpa konten (`bodyText: ""`).
- **Hal yang Tidak Terverifikasi:**
  - Pengiriman aktual EmailJS & verifikasi token Turnstile di sisi server (dilarang submit ke production & tidak ada akses ke backend/dashboard EmailJS/Cloudflare).
  - Konfigurasi RLS & definisi RPC `get_project_progress` serta tabel `page_views` aktual di database Supabase production.
  - Autentikasi atau tampilan `work.akbaralfaidah.com` (dilarang dibuka sesuai instruksi).

---

## FASE 3 - Daftar Temuan Kekurangan (Critical → High → Medium → Low)

### CRITICAL

#### `[C-01]` CSP Memblokir Font Google (`Outfit` & `JetBrains Mono`) sehingga Font Display Gagal Dimuat Total

- **Skill Acuan:** `code-review-excellence`, `ui-ux-pro-max`, `design-system`
- **Lokasi:** [index.html](file:///c:/Users/akbar/Desktop/akbaralfaidah/index.html#L18-L26) & [index.html](file:///c:/Users/akbar/Desktop/akbaralfaidah/index.html#L40-L42); [tailwind.config.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/tailwind.config.js#L16-L20)
- **Masalah:** `<link ... media="print" onload="this.media='all'">` memakai inline JavaScript event handler `onload`, sementara CSP pada baris 19 melarang inline script (`script-src 'self' ...` tanpa `'unsafe-inline'` atau hash).
- **Bukti:** Error console live di browser pada `https://akbaralfaidah.com/:42`: `Refused to execute inline event handler because it violates Content Security Policy...`. Pengecekan `document.fonts` membuktikan hanya `Poppins` yang termuat; `Outfit` dan `JetBrains Mono` tidak pernah diunduh sehingga semua `H1` dan tag `font-mono` turun ke font default OS (`Segoe UI` / monospace bawaan).
- **Dampak:** Tipografi identitas utama situs mati total di production, membuat kesan visual jauh lebih generik dan memicu ketidakcocokan metrik karakter vs fallback font.
- **Solusi yang Disarankan:** Self-host `Outfit` (atau pengganti seperti Plus Jakarta Sans / Fraunces / Instrument Sans) dan `JetBrains Mono` dalam format `.woff2` di `public/fonts/` lewat `@font-face` di [src/index.css](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/index.css) (atau pakai `<link rel="stylesheet">` standar tanpa `onload` inline handler), sekaligus bersihkan `Poppins` yang disebut sudah dihapus di komentar baris 31.
- **Estimasi Effort:** **S**

#### `[C-02]` Runtime Crash `ReferenceError: fallbackProjects is not defined` Saat Supabase Gagal/Timeout di `fetchProjects()`

- **Skill Acuan:** `code-review-excellence`
- **Lokasi:** [src/data/projects.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/data/projects.js#L1) & [L59-L71](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/data/projects.js#L59-L71)
- **Masalah:** Fungsi `fetchProjects()` meng-assign `cachedProjects = fallbackProjects` saat hasil Supabase kosong (baris 60) maupun saat timeout 3 detik / error di blok `catch` (baris 69), namun `fallbackProjects` **tidak pernah di-import** di file tersebut (hanya di-dynamic-import pada baris 103 di dalam `fetchProjectBySlug()`).
- **Bukti:** Pembacaan langsung [src/data/projects.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/data/projects.js#L1-L75) dan [split.cjs](file:///c:/Users/akbar/Desktop/akbaralfaidah/split.cjs) yang tertinggal setengah jalan.
- **Dampak:** Jika instance Supabase free-tier mengalami cold start > 3 detik, paused, atau diblokir jaringan klien, halaman `/projects` terjebak selamanya di skeleton loader dan section `#projects` di `/` kosong tanpa kartu proyek akibat unhandled promise rejection.
- **Solusi yang Disarankan:** Tambahkan `const { fallbackProjects } = await import('./fallbackProjects');` pada kedua cabang fallback di `fetchProjects()` (baris 60 dan 69), serta tambahkan state error/empty handling di komponen pemanggil.
- **Estimasi Effort:** **S**

#### `[C-03]` Bug SEO Kritis: Halaman Proyek Baru (`caterly`, dll.) Terkena `noindex,nofollow` & Route 404 Layar Kosong

- **Skill Acuan:** `code-review-excellence`, `design-taste-frontend`
- **Lokasi:** [src/App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L21-L23), [L67-L76](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L67-L76), [L120-L124](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L120-L124); [src/pages/ProjectProgress.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectProgress.jsx#L128-L160) & [L263-L265](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectProgress.jsx#L263-L265)
- **Masalah:** Semua slug proyek baru di luar 8 slug statis (misal `caterly`, `minum-vr9`) diarahkan `ProjectRoute` ke `<ProjectProgress fallbackComponent={<ProjectDetail />} />`. `ProjectProgress` menyuntikkan `<meta name="robots" content="noindex,nofollow">` dan `referrer="no-referrer"`, lalu ketika token bukan client-tracker (`shouldFallback === true`), `ProjectProgress` tetap ter-mount dan langsung me-return `fallbackComponent` sehingga cleanup `useEffect` tidak pernah berjalan. Selain itu, `<Routes>` tidak punya `<Route path="*">`.
- **Bukti:** Live audit Playwright di `https://akbaralfaidah.com/project/caterly` mengembalikan `robotsMeta: "noindex,nofollow"`. Live audit `https://akbaralfaidah.com/halaman-tidak-ada-404` mengembalikan `bodyText: ""` (layar putih kosong).
- **Dampak:** Setiap proyek baru yang ditambahkan lewat dashboard admin tidak bisa diindeks Google (`noindex`), memicu 1 request RPC sia-sia sebelum render detail, dan typo URL membuat pengunjung melihat halaman kosong tanpa navigasi kembali.
- **Solusi yang Disarankan:** Pisahkan rute secara tegas (misalnya `/track/:token` untuk tracker privat atau cek status `projectData` sebelum menyuntikkan `noindex,nofollow`, dan hapus meta `noindex` saat `shouldFallback` aktif); tambahkan halaman 404 khusus pada `<Route path="*">`.
- **Estimasi Effort:** **S**

#### `[C-04]` Payload Aset Terlalu Berat: 5,99 MB SVG Proyek dari Supabase & 181 KB Logo SVG Berisi PNG Base64

- **Skill Acuan:** `code-review-excellence`, `banner-design`, `design-taste-frontend`
- **Lokasi:** Live Supabase `public_projects_view` (`gambar_url`); [public/img/unbackground.svg](file:///c:/Users/akbar/Desktop/akbaralfaidah/public/img/unbackground.svg#L1), `public/img/withbackground.svg`, `public/on_development.gif`
- **Masalah:** Meskipun file `/img/*.webp` (13–26 KB) sudah dibuat dan dipakai di Hero, baris `gambar_url` di Supabase untuk 4 proyek unggulan masih mengarah ke `.svg` lama di Supabase Storage. Selain itu, logo `/img/unbackground.svg` (dipakai di Navbar, Footer, Client Portal, dan `<link rel="icon">`) sebenarnya adalah 2 file raster PNG `1536×1024` yang di-embed base64 di dalam tag `<svg>`.
- **Bukti:** Pengukuran jaringan Playwright di `/`: `1786517225519.svg` (**2.936.838 B**), `1786517312437.svg` (**1.351.061 B**), `1786517236603.svg` (**853.277 B**), `1786517260076.svg` (**845.455 B**). `unbackground.svg` berukuran **181.470 B** dan di-fetch 2× saat load pertama (1.222 ms). `public/img/withbackground.svg` (`1.167.237 B`) dan `public/on_development.gif` (`834.423 B`) juga sangat gemuk.
- **Dampak:** Halaman `/` menarik hampir 6 MB aset grafis tidak perlu hanya untuk 4 thumbnail berukuran `468×293 px`, memperlambat koneksi seluler/3G–4G di Indonesia secara drastis dan merusak skor LCP/Speed Index.
- **Solusi yang Disarankan:** Ganti logo `AF` menjadi vektor SVG murni (~1–2 KB, bukan raster base64 dalam SVG!), perbarui `gambar_url` proyek lama di Supabase ke `.webp` atau file terkompresi di Storage, ganti `on_development.gif` dengan placeholder vektor/CSS atau video MP4/WebP animasi ringan, dan hapus aset tidak terpakai (`withbackground.svg`, `hero-section.webp`, dll.) dari `public/`.
- **Estimasi Effort:** **S–M** (aset lokal S; update Storage URL via admin dashboard M)

#### `[C-05]` Kegagalan Kontras Warna WCAG 2.1 AA di Banyak Elemen Utama

- **Skill Acuan:** `ui-ux-pro-max`, `design-system`, `ui-styling`
- **Lokasi:** [src/index.css](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/index.css#L38-L50), [src/components/ui/AnimatedButton.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/AnimatedButton.jsx#L9), [src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L413), [src/pages/Projects.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/Projects.jsx#L139), [src/components/Hero.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Hero.jsx#L363)
- **Masalah:** Banyak teks penting dan tombol CTA menggunakan aksen brass atau teks opacity `40%`–`60%` yang kontrasnya di bawah syarat minimum **4.5:1**.
- **Bukti (Terukur di Browser):**
  - `white` di `#22C55E` (`bg-green-500`, tab WhatsApp aktif di Contact): **2.28:1**
  - `charcoal/40` di `#FAFAFA` (tahun proyek, catatan Turnstile, placeholder deadline): **2.27:1**
  - `charcoal/50` di `#FAFAFA` (placeholder form, label deadline, role di ProjectDetail): **2.91:1**
  - `#B5915F` di `#FFFFFF` (label kategori `11px` di `/projects`): **2.92:1**
  - `brass (#9E7A3C)` di `#FAFAFA` (teks `"Kota Jambi"`, tag kategori, periode karir, `"Buka Maps"`): **3.79:1**
  - `charcoal/60` di `#FAFAFA` (deskripsi Hero `19.2px`, subheading Projects, nama perusahaan, tech pills): **3.80:1**
  - `white` di `#A9762E` (tombol CTA `"Lihat Portofolio"`, `"Kirim Pesan"`, `"Contact"`): **3.95:1**
  - `cream/40` di `#1A1A1C` (mode dark): **3.50:1**
- **Dampak:** Teks sulit dibaca di layar dengan kecerahan rendah, luar ruangan (mobile), maupun bagi pengguna dengan gangguan penglihatan ringan.
- **Solusi yang Disarankan:** Gelapkan token brass untuk teks/tombol di Light Mode (misal `#7D5D24` / `#785820` → ~5.3:1 terhadap `#FAFAFA` dan putih di atasnya), ganti `bg-green-500` dengan `bg-emerald-700` (`#047857`, kontras putih `5.47:1`), dan naikkan opacity teks sekunder minimal ke `75%`–`80%` (atau gunakan token `--color-ink-muted` yang terkalibrasi ≥ 4.6:1 di Light & Dark).
- **Estimasi Effort:** **S**

---

### HIGH

#### `[H-01]` Anti-Spam Turnstile & Rate Limit Hanya Client-Side (Mudah Dilewati)

- **Skill Acuan:** `code-review-excellence`
- **Lokasi:** [src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L21-L40), [L163-L225](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L163-L225), [L269-L300](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L269-L300), [L624-L629](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L624-L629)
- **Masalah:** Pengecekan Turnstile hanya memeriksa `if (!turnstileToken)` di browser tanpa verifikasi token ke endpoint `siteverify` di backend; rate limit hanya disimpan di `localStorage` dengan encoding `btoa` + reverse string; dan `ALLOWED_ORIGINS` hanya dicek di browser.
- **Bukti:** Komentar kode di `Contact.jsx:624-629` sendiri mengakui bahwa Turnstile secret verification belum ada; kredensial `VITE_EMAILJS_*` berada di bundle klien dan `emailjs.send` dipanggil langsung dari browser.
- **Dampak:** Bot dapat memanggil API EmailJS atau membombardir template email tanpa melewati Turnstile/rate limit jika Allowed Origins / Captcha verification di dashboard EmailJS belum aktif, dan `ALLOWED_ORIGINS` di frontend justru memblokir testing di preview domain atau `127.0.0.1`.
- **Solusi yang Disarankan:** Gunakan **Supabase Edge Function** (atau Cloudflare Worker ringan) sebagai endpoint `/api/contact` untuk memverifikasi `TURNSTILE_SECRET_KEY` via `siteverify`, menegakkan rate limit berbasis IP, lalu meneruskan pesan ke EmailJS/SMTP/notifikasi Telegram/WA dari sisi server.
- **Estimasi Effort:** **M**

#### `[H-02]` Scroll-Jacking Ekstrem 4.092 px di `YouCanScroll.jsx`, Teks Terpotong di Mobile, & Konflik ScrollTrigger vs Lenis

- **Skill Acuan:** `design-taste-frontend`, `ui-ux-pro-max`, `code-review-excellence`
- **Lokasi:** [src/components/ui/YouCanScroll.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/YouCanScroll.jsx#L23-L74), [L105-L138](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/YouCanScroll.jsx#L105-L138); [src/context/LenisContext.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/context/LenisContext.jsx#L22-L50); [src/pages/HomePage.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/HomePage.jsx#L28-L48)
- **Masalah:** `YouCanScroll` mengunci scroll (`pin: true, end: '+=400%', snap`) sepanjang **4.092 px** hanya untuk menggulir daftar klise `"saya bisa [membuat website, membuat aplikasi mobile, ...]"`. Selain itu: (1) `Lenis` tidak disinkronkan dengan `ScrollTrigger.update` dan memakai opsi usang Lenis v0 (`direction`, `gestureDirection`, `smooth`); (2) daftar item menggunakan `w-max` sehingga terpotong keluar di layar `375px`; (3) tiap section di `HomePage` di-lazy-load terpisah di bawah `YouCanScroll` sehingga tinggi dokumen berubah setelah `ScrollTrigger` diinisialisasi; (4) memakai warna ungu/violet (`rgba(139, 92, 246, 0.15)`) sebagai highlight marker di baris 115.
- **Bukti:** Screenshot `mobile-03-youcanscroll.png` menampilkan `"membuat aplikasi mobil[e]"` dan `"membuat kecerdasan bu[atan]"` terpotong di tepi kanan; `sections` telemetry menunjukkan `#about` baru muncul di `y = 4902 px`.
- **Dampak:** Pengunjung harus menggulir lebih dari 4 layar penuh hanya untuk melewati satu kalimat filler sebelum melihat siapa Anda atau proyek Anda-membunuh momentum konversi dan membuat navigasi scroll terasa berat/tersentak.
- **Solusi yang Disarankan:** Hapus `YouCanScroll` seluruhnya (atau ganti menjadi blok layanan/keunggulan ringkas setinggi 1 layar tanpa scroll-pinning), sehingga library `gsap` (115 KB) dan `lenis` bisa dipangkas atau disederhanakan drastis, langsung memotong panjang halaman dari `13.304 px` menjadi lebih padat dan fokus.
- **Estimasi Effort:** **S**

#### `[H-03]` Anti-Slop & Branding: Hero Tidak Menyebut Jasa di H1, Ambiguitas Freelancer vs Agency, dan Typo Fatal (ID & EN)

- **Skill Acuan:** `brand`, `design-taste-frontend`, `banner-design`
- **Lokasi:** [src/components/Hero.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Hero.jsx#L346-L367); [src/i18n/locales/id.json](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/i18n/locales/id.json#L9-L25), [L102](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/i18n/locales/id.json#L102); [src/i18n/locales/en.json](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/i18n/locales/en.json#L31)
- **Masalah:**
  1. **Value proposition hilang di H1:** H1 hanya `"Akbar Alfaidah"`. Pengunjung baru dalam 5 detik pertama tidak langsung tahu ini jasa Website, Mobile App, & AI Development / Tech Agency - padahal key `hero.tagline` (`"Jasa Pembuatan Website, Aplikasi Mobile & AI Engineer"`) sudah ada di JSON tetapi **tidak pernah dirender** di `Hero.jsx`!
  2. **Copy klise & repetitif:** Dua kalimat lead di Hero (`"Ide jadi produk. Presisi di setiap baris kode. / Solusi digital yang presisi, rapi, dan berkelas."`) mengulang kata `"Presisi"` berturut-turut dan terasa seperti kalimat generator AI generik (dapat ditempel ke portfolio developer mana pun).
  3. **Ambiguitas identitas:** Nama brand di prompt adalah `"freelance developer / Akbar Alfaidah - Tech Agency"`, namun copy mencampur `"Saya menyediakan..."`, `"Ikuti Saya"`, `"Studio & Lokasi Fisik"`, dan `"Client Portal"` tanpa narasi jelas apakah klien menyewa solo freelancer berpengalaman atau studio/agency.
  4. **Typo fatal di production:** `en.json:31` menulis `"services for businesses, small enterprises, and weddings in Jambi"` (**"weddings"** muncul di deskripsi Web Development bisnis!); `id.json:21` menulis `"Terpecaya"` (seharusnya `"Terpercaya"`); `id.json:102` menulis `"Aplikasi mu?"` (seharusnya `"Aplikasimu?"`); istilah `"Projek"` vs `"Proyek"` vs `"Project"` tidak konsisten.
- **Bukti:** Screenshot `desktop-01-hero.png`, `desktop-dark-en-services.png` (`"...and weddings in Jambi"`), `mobile-04-about.png` (`"Terpecaya"`), `desktop-09-contact.png` (`"Aplikasi mu?"`).
- **Dampak:** Menurunkan kredibilitas profesional secara instan di mata klien korporat/UMKM yang membaca versi Inggris maupun Indonesia.
- **Solusi yang Disarankan:** Jadikan H1 menjelaskan kategori layanan + posisi brand secara tegas (misal `"Web, Mobile & AI Engineering Studio - Jambi & Remote"` dengan nama brand `"Akbar Alfaidah"` di eyebrow/kicker, atau `"Akbar Alfaidah - Jasa Web, Aplikasi Mobile & AI"`), terapkan satu Voice Card yang konsisten (`brand` + `copy-voice.md`), dan perbaiki seluruh typo ID/EN.
- **Estimasi Effort:** **S**

#### `[H-04]` Anti-Slop: Bento `Services.jsx` Pakai Wireframe Dummy yang Menabrak Teks & `text-justify` Rusak

- **Skill Acuan:** `design-taste-frontend`, `design`, `ui-styling`
- **Lokasi:** [src/components/Services.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Services.jsx#L41-L249)
- **Masalah:**
  1. Tiga kartu layanan berisi ilustrasi generik ala template AI: jendela browser dengan 3 titik merah-kuning-hijau + balok abu-abu yang `animate-bounce`/`animate-pulse`, radar SVG berputar tanpa makna nyata, dan frame iPhone dengan notch kosong.
  2. Dekorasi simbol `+` diposisikan absolut (`top-8 right-8`, `top-1/4 right-8`, `bottom-1/4 left-8`) sehingga di desktop, tablet (`768px`), dan mobile (`375px`) **menimpa teks langsung** (`"Buatan+"`, `"Jambi,+"`, `"tailored+"`, `"+disesuaikan"`).
  3. Di mobile (`375px`), wireframe browser posisinya naik ke belakang paragraf `"Web Development"` sehingga titik merah-kuning-hijau bertabrakan langsung dengan kata `"page sederhana"`.
  4. Semua paragraf menggunakan `text-justify hyphens-auto` di kolom sempit, menghasilkan celah antar-kata yang sangat lebar dan bolong-bolong (`"desain       antarmuka"`, `"Saya    menyediakan    jasa"`).
  5. Ketiga tombol CTA memakai label `t('projects.cta')` (`"Lihat Detail"` / `"View Details"`) padahal aksinya melompat ke `#contact`!
- **Bukti:** Screenshot `desktop-04-services.png`, `desktop-dark-en-services.png`, `tablet-03-services.png`, dan `mobile-05-services.png`.
- **Dampak:** Kartu layanan terlihat seperti template AI yang belum selesai, teks sulit dibaca di mobile karena bertabrakan dengan gambar latar & spasi justify yang pecah, dan CTA menyesatkan ekspektasi pengguna.
- **Solusi yang Disarankan:** Hapus `text-justify` (pakai `text-left`), buang simbol `+` dekoratif serta wireframe dummy, ganti visual masing-masing layanan dengan **cuplikan produk/UI nyata** dari proyek Anda (atau spesifikasi layanan terstruktur: deliverables konkret, estimasi timeline, contoh kasus terkait) dan ubah CTA menjadi verba aksi yang jelas (`"Konsultasi Web →"`, `"Konsultasi Mobile →"`, `"Konsultasi AI →"`).
- **Estimasi Effort:** **M**

#### `[H-05]` Anti-Slop & Kepercayaan: Testimoni Berbentuk Fake X/Twitter Cards yang Tak Terbaca & Terpotong

- **Skill Acuan:** `design-taste-frontend`, `brand`, `ui-ux-pro-max`
- **Lokasi:** [src/components/TestimonialsSection.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/TestimonialsSection.jsx#L12-L41); [src/components/ui/twitter-testimonial-cards.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/twitter-testimonial-cards.jsx#L60-L163); [src/i18n/locales/id.json](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/i18n/locales/id.json#L160-L199)
- **Masalah:**
  1. Ulasan klien (yang sebagian jelas kutipan chat WhatsApp seperti `"Okee kk,,,, Maaf sebelumnya..."`) dibungkus menjadi **post X/Twitter palsu** dengan logo X, centang biru `verified`, avatar kartun DiceBear, handle fiktif (`@klien_siabsen`, `@klien_company`), serta angka likes/retweets artifisial (`89 likes, 34 retweets`). Ini menabrak prinsip `design-taste-frontend` & `brand` (bukti sosial buatan yang meruntuhkan otentisitas).
  2. Kartu dimiringkan (`-skew-y-[4deg]`) dan ditumpuk (`grid-area:stack` dengan `translate-x-32 translate-y-24` sampai `!translate-x-72` saat hover), membuat kartu 1–4 saling menutupi dan **tidak terbaca** tanpa mengarahkan kursor satu per satu.
  3. Di Tablet `768px` dan Mobile `375px`, kartu terdepan (`S*** A*****h`) **terpotong keluar layar kanan** (`280px + 128px = 408px > 375px`).
  4. Komponen berupa `<div>` dengan `onClick`, bukan `<button>` atau elemen fokus - tidak dapat dioperasikan via keyboard (`Tab`/`Enter`).
- **Bukti:** Screenshot `desktop-08-testimonials.png`, `tablet-04-testimonials.png`, `mobile-08-testimonials.png`, dan JSON `id.json:160-199`.
- **Dampak:** Pengunjung mobile/tablet melihat card testimoni terpotong dan 4 testimoni di belakangnya hampir tidak terbaca; centang biru & retweet palsu pada nama tersensor (`M*****n`) memberi kesan testimoni rekayasa.
- **Solusi yang Disarankan:** Tampilkan ulasan asli dalam layout editorial grid/row yang bersih dan mudah dibaca semua sekaligus (atau switcher berbasis tombol yang aksesibel), hilangkan atribut X/Twitter palsu (centang biru, likes, retweets, avatar DiceBear), dan cantumkan konteks nyata proyeknya (misal `"Klien Proyek Sistem Absensi - Universitas"` atau tautan ke case study terkait).
- **Estimasi Effort:** **M**

#### `[H-06]` Kegagalan Aksesibilitas Kritis: Tanpa `prefers-reduced-motion`, Focus Ring Hilang, Label Tombol Ganda, & 100 Ikon Sampah di Accessibility Tree

- **Skill Acuan:** `ui-ux-pro-max`, `ui-styling`, `design-taste-frontend`
- **Lokasi:** [src/components/Hero.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Hero.jsx#L64-L291), [src/components/ui/AnimatedButton.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/AnimatedButton.jsx#L16-L30), [src/components/Navbar.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Navbar.jsx#L147,L158,L181), [src/components/ui/TechLogoMarquee.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/TechLogoMarquee.jsx#L96), [src/index.css](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/index.css#L64-L80)
- **Masalah & Bukti Live:**
  1. **`prefers-reduced-motion` diabaikan:** Saat browser di-set `reducedMotion: 'reduce'`, `OrbitColumn` terus bergerak (`orbitMovedUnderReducedMotion: true`), `MeshGradient` tetap beranimasi (`mesh-float-1`), `About` badge tetap naik-turun, dan `TechLogoMarquee` + `Lenis` tetap berjalan terus tanpa tombol pause.
  2. **Focus Ring tidak terlihat saat Tab:** Pada `desktop-focus-check.png` dan `freshTabs` Playwright, `Tentang Saya`, `Projek`, `Pengalaman`, `Hubungi`, `Mari Diskusi`, `Lihat Portofolio` memiliki `outline: 0px` dan `boxShadow: rgba(0,0,0,0)` (ditambah `clipPath: inset(0 round 9999px)` di `AnimatedButton` yang memotong ring luar!).
  3. **Duplikasi teks di `AnimatedButton`:** Accessibility snapshot membaca tombol sebagai `link "Hubungi Hubungi"` dan `Mari Diskusi / Mari Diskusi` karena `{children}` dirender 2× tanpa `aria-hidden="true"` pada lapisan duplikat.
  4. **Spam Accessibility Tree:** `TechLogoMarquee` merender `4 × 25 = 100` SVG yang semuanya memiliki `aria-label="Technology Icon"` (seharusnya `aria-hidden="true"` karena dekoratif/duplikat).
  5. **Tombol Logo tanpa `aria-label`:** Tombol logo di `Navbar.jsx:147` hanya berisi `<img>` tanpa teks/label yang jelas untuk aksi ("Kembali ke atas"), dan tombol menu mobile tidak memiliki `aria-expanded`.
- **Dampak:** Situs tidak layak pakai bagi pengguna keyboard-only, pengguna screen reader, maupun pengguna dengan gangguan vestibular (motion sensitivity).
- **Solusi yang Disarankan:** Tambah `aria-hidden="true"` pada layer duplikat `AnimatedButton` dan ikon marquee; ganti mekanisme `:focus-visible` dengan `outline: 2px solid var(--color-brass); outline-offset: 3px` tanpa `clipPath` yang memotong fokus; hormati `useReducedMotion()` / `@media (prefers-reduced-motion: reduce)` pada semua rAF, CSS animasi, GSAP, dan Lenis; tambah tombol pause atau ubah marquee/orbit menjadi interaktif tanpa loop paksa.
- **Estimasi Effort:** **M**

#### `[H-07]` Kerusakan Layout Mobile & Tablet + 20 Target Sentuh di Bawah 44 px

- **Skill Acuan:** `ui-ux-pro-max`, `design-taste-frontend`, `ui-styling`
- **Lokasi:** [src/components/Hero.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Hero.jsx#L408), [src/components/About.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/About.jsx#L46-L105), [src/components/Navbar.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Navbar.jsx#L181,L203-L213), [src/components/Services.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Services.jsx#L105), [src/components/Projects.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Projects.jsx#L74), [src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L412)
- **Masalah & Bukti:**
  1. Di Tablet `768×1024` (`tablet-01-hero.png`), `OrbitColumn` tampil dengan lebar card `460px` dan offset `x = 500*(1-cos)` di dalam grid 2 kolom sehingga kartu proyek terpotong setengah di tepi kanan, `"Tentang Saya"` di navbar terlipat 2 baris, dan `"saya bisa"` mengintip di dasar hero.
  2. Di Mobile `375×812` (`mobile-04-about.png`), 4 floating badge di foto `About` (`-left-4`, `-right-6`, `-right-12`) menutupi area foto secara acak dan nyaris keluar tepi layar.
  3. Link di Mobile Menu (`Navbar.jsx:203-212`) hanya memanggil `setIsMobileMenuOpen(false)` tanpa `handleNavClick`, sehingga hasil pengujian Playwright menunjukkan `#about` mendarat di `secTop: 0` di belakang navbar (`navBottom: 90`).
  4. **20 elemen interaktif < 44 px** di mobile (`Open menu` `36×36px`, toggle bahasa/tema `h: 32px`, CTA Services `h: 42px`, CTA Projects `h: 40px`, mode WA/Email `h: 40px`, link Footer `h: 20px`, `Buka Maps` `h: 16px`).
- **Dampak:** Pengalaman pengguna mobile & tablet terasa sempit, berantakan, dan rawan salah sentuh (fat-finger errors).
- **Solusi yang Disarankan:** Ubah breakpoint Orbit Hero ke `lg:` (atau ganti komposisi Hero menjadi showcase grid/preview interaktif yang muat bersih di `768px` dan `375px`), pindahkan/hilangkan floating badges dari foto About menjadi metrik/fakta rapi di luar foto, gunakan `handleNavClick` + `scroll-margin-top` pada semua section (`scroll-mt-28`), dan pastikan semua kontrol interaktif memiliki tinggi/area sentuh minimal `44×44px` di mobile.
- **Estimasi Effort:** **M**

#### `[H-08]` Konfigurasi Security Headers Nginx Pincang & Static Asset Tanpa Header Keamanan

- **Skill Acuan:** `code-review-excellence`
- **Lokasi:** [nginx.conf](file:///c:/Users/akbar/Desktop/akbaralfaidah/nginx.conf#L15-L30); [index.html](file:///c:/Users/akbar/Desktop/akbaralfaidah/index.html#L18-L29)
- **Masalah:** Di `nginx.conf`, blok `location ~* \.(js|css|...|svg|...)$` mendeklarasikan `add_header Cache-Control "public, immutable";`. Dalam aturan Nginx, **`add_header` di dalam `location` membatalkan seluruh `add_header` dari level `server`**. Selain itu: (1) `X-Content-Type-Options` & `Permissions-Policy` ditulis sebagai `<meta http-equiv>` di `index.html` padahal browser mengabaikan keduanya dalam tag meta; (2) CSP hanya ada di meta tag (bukan HTTP header, dan tidak mendukung `frame-ancestors`); (3) tidak ada `Strict-Transport-Security` (HSTS) atau `Cache-Control: no-cache` eksplisit untuk `/index.html`.
- **Bukti:** Inspection header Playwright pada `/fonts/poppins-400.woff2` hanya mengembalikan `cache-control`, tanpa `x-frame-options`, `x-content-type-options`, maupun `referrer-policy`; sedangkan `/` sendiri tidak memiliki HTTP header `content-security-policy` maupun `permissions-policy`.
- **Dampak:** Aset `.svg` atau dokumen statis tidak dilindungi header `nosniff` / `X-Frame-Options`, dan deploy baru berpotensi men-cache `index.html` di client jika proxy/browser meng-cache secara agresif.
- **Solusi yang Disarankan:** Pindahkan semua security header (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options` / `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`) ke file snippet Nginx yang di-include di setiap `location` (atau `server` tanpa menimpa di `location` kecuali mengulang header keamanan), tambah `location = /index.html { add_header Cache-Control "no-cache, no-store, must-revalidate"; ... }`, dan hapus meta tag header HTTP yang tidak valid di `index.html`.
- **Estimasi Effort:** **S**

---

### MEDIUM

#### `[M-01]` Design System Tidak Konsisten: Token Terbalik di Dark Mode, Sisa Poppins, 3 Library Ikon, dan Variasi Tombol/Radius Acak

- **Skill Acuan:** `design-system`, `ui-styling`, `ui-ux-pro-max`
- **Lokasi:** [src/index.css](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/index.css#L5-L50), [tailwind.config.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/tailwind.config.js#L10-L20), [src/components/About.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/About.jsx#L42), [src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L3-L5), [src/pages/Projects.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/Projects.jsx#L139,L171), [src/pages/ProjectDetail.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectDetail.jsx#L180)
- **Masalah:**
  1. Token `--color-charcoal` berubah menjadi warna krem terang `#F2F0E8` pada `.dark`, menyebabkan bug visual nyata seperti `border-paper dark:border-charcoal` di [About.jsx:42](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/About.jsx#L42) yang menjadi **garis tepi putih terang di mode gelap** (`desktop-dark-en-about.png`).
  2. `index.html:31` berkomentar `"removed Poppins"`, namun `index.html:36` masih preloading `poppins-400.woff2`, `index.css:5-35` masih `@font-face` Poppins, dan `tailwind.config.js:17` masih memakai Poppins sebagai font `sans` utama.
  3. Tiga library ikon (`react-icons/fi`, `react-icons/fa`, `lucide-react`) dipakai bergantian dengan ketebalan garis tidak seragam, ditambah emoji bintang (`⭐⭐⭐⭐⭐`) di `About.jsx:90` dan pin (`📍`) di `Footer.jsx:26`.
  4. Tombol CTA dan radius card berubah gaya di setiap halaman: `AnimatedButton` (Home), pil hitam/brass (`pages/Projects`), pil outline (`ProjectDetail`), `rounded-2xl` (`ProjectProgress`), dan tombol transparan (`Services`).
- **Dampak:** Tampilan antar-halaman terasa seperti gabungan beberapa proyek berbeda, bukan satu sistem produk yang matang.
- **Solusi yang Disarankan:** Terapkan arsitektur token 3-layer (`primitive → semantic → component` sesuai skill `design-system`, misal `--bg-canvas`, `--bg-surface`, `--text-primary`, `--text-muted`, `--accent-primary`, `--border-subtle`), satukan seluruh ikon ke satu keluarga (`lucide-react` untuk UI + SVG/SimpleIcons khusus logo teknologi), dan buat komponen `<Button>` dan `<Card>` tunggal yang konsisten di seluruh route.
- **Estimasi Effort:** **M**

#### `[M-02]` Hierarki Heading & Type Scale Tidak Terstruktur + Skip Heading Level `H2 → H4`

- **Skill Acuan:** `design-system`, `ui-ux-pro-max`, `design-taste-frontend`
- **Lokasi:** [src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L319,L377), [src/components/Footer.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Footer.jsx#L32,L41), dan heading section Home
- **Masalah:** Ukuran `H2` berubah-ubah tanpa skala jelas (`48px` di About/Services/Experience, `50.4px` di YouCanScroll, `60px` di Projects, `64px` di Testimonials, `72px` di Contact-hampir sebesar H1 `88px`). Di `#contact`, struktur melompat dari `<h2>` (`72px`) langsung ke `<h4>` (`14px` di kartu Google Maps) tanpa `<h3>`, sementara di `Footer` dua `<h3>` (`Navigasi`, `Connect`) berukuran `12px` (`text-xs`).
- **Dampak:** Ritme visual terasa tidak rapi dan struktur dokumen melanggar urutan heading aksesibilitas (`heading-order`).
- **Solusi yang Disarankan:** Kunci satu type scale yang konsisten (misal `H1` hero, semua `H2` section seragam `clamp(2rem, 4vw, 3rem)`, `H3` sub-card `20px–24px`), perbaiki `<h4>` di kartu Maps Contact menjadi `<h3>`, dan naikkan label Footer ke minimal `13px–14px`.
- **Estimasi Effort:** **S**

#### `[M-03]` UX Navigasi Antar-Halaman Putus: Sub-Halaman Tanpa Navbar & Link Footer Mati

- **Skill Acuan:** `ui-ux-pro-max`, `design-taste-frontend`
- **Lokasi:** [src/App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L120-L124), [src/pages/Projects.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/Projects.jsx), [src/pages/ProjectDetail.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectDetail.jsx#L56), [src/components/Footer.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Footer.jsx#L33-L36)
- **Masalah:** `<Navbar />` hanya dirender di `HomePage`, bukan di `Projects` maupun `ProjectDetail`. Akibatnya di `/projects` dan `/project/:slug`, pengunjung tidak bisa mengganti bahasa (ID/EN), mengganti tema (Light/Dark), maupun langsung menuju Kontak. Link di `Footer` (`href="#about"`, `#projects`, `#experience`, `#contact`) **mati** jika diklik dari `/projects` atau `/project/:slug`. Selain itu, tombol `"Back to Portfolio"` di `ProjectDetail` selalu melempar user ke `/` bahkan ketika user datang dari `/projects`.
- **Dampak:** Alur eksplorasi portfolio ke konversi terputus di halaman detail proyek (justru saat ketertarikan calon klien paling tinggi).
- **Solusi yang Disarankan:** Pasang `<Navbar />` di seluruh halaman publik (dengan link `#...` otomatis mengarah ke `/#...` bila tidak sedang di `/`), perbaiki link Footer menjadi `/#about`, dll., arahkan tombol kembali di `ProjectDetail` ke `/projects` (atau `navigate(-1)` jika berasal dari internal), dan tambahkan blok CTA `"Tertarik membuat proyek serupa?"` di bawah `ProjectDetail`.
- **Estimasi Effort:** **S–M**

#### `[M-04]` UX & Aksesibilitas Form Kontak: Toast Menutupi Navbar, Dropdown Tanpa Keyboard/ARIA Listbox, Label Bahasa Campur

- **Skill Acuan:** `ui-ux-pro-max`, `ui-styling`, `design-taste-frontend`
- **Lokasi:** [src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L304-L310), [L332-L382](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L332-L382), [L478](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L478), [L486-L583](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L486-L583), [src/components/ui/Toast.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/Toast.jsx#L30)
- **Masalah:**
  1. Validasi error hanya muncul sebagai `Toast` di `top-6` yang menutupi floating navbar dan tulisannya bertabrakan dengan navbar di belakangnya (`desktop-dark-en-validation-toast.png`), tanpa pesan error inline di bawah masing-masing field (`aria-invalid`, `aria-describedby`).
  2. Custom deadline dropdown (`Contact.jsx:488`) memakai `aria-haspopup="listbox"` pada `<button>`, tetapi kontainer pilihannya hanyalah `<div>` berisi `<button>` tanpa `role="listbox"`, `role="option"`, `aria-selected`, maupun navigasi tombol panah Atas/Bawah.
  3. Di mode bahasa Inggris, teks `"STUDIO & LOKASI FISIK"`, `"Buka Maps"`, `"Jasa Pembuatan Website & Aplikasi di Jambi"`, `"Dilindungi oleh Cloudflare Turnstile"` tetap berbahasa Indonesia. Sebaliknya di mode Indonesia, label `"Location"` tetap berbahasa Inggris.
  4. Placeholder email memakai `"akbar@example.com"`, Turnstile `theme: 'auto'` tetap putih terang di dark mode, dan `"Pengen Buat Apa?"` terlalu kasual dibanding nada kalimat sekitarnya.
- **Dampak:** Pengguna screen reader dan keyboard kesulitan memilih timeline; pengguna yang salah mengisi form tidak tahu persis field mana yang keliru setelah toast hilang dalam 4 detik.
- **Solusi yang Disarankan:** Tampilkan error validasi langsung di bawah tiap input yang bermasalah + fokuskan ke field error pertama saat submit; implementasikan ARIA `listbox`/`option` + arrow-key navigation (atau pakai `<select>` native yang di-style rapi); terjemahkan semua teks kartu Maps & Turnstile ke `id.json`/`en.json`; sinkronkan `theme` Turnstile dengan `useTheme()`.
- **Estimasi Effort:** **M**

#### `[M-05]` SEO & Metadata Tidak Lengkap: Missing OG/Twitter Image, `sitemap.xml` Kotor & Tidak Sinkron, Schema Minim

- **Skill Acuan:** `banner-design`, `design-taste-frontend`, `code-review-excellence`
- **Lokasi:** [index.html](file:///c:/Users/akbar/Desktop/akbaralfaidah/index.html#L9-L63), [vite.config.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/vite.config.js#L9-L19), [public/llms.txt](file:///c:/Users/akbar/Desktop/akbaralfaidah/public/llms.txt)
- **Masalah:**
  1. `<head>` tidak memiliki `og:image`, `og:url`, `twitter:card` (`summary_large_image`), `twitter:image`, dan `<link rel="canonical">`. Saat link `akbaralfaidah.com` dibagikan di WhatsApp/LinkedIn/X, preview tampil polos tanpa banner visual.
  2. `sitemap.xml` di production mencantumkan `https://akbaralfaidah.com/google8c2a8f60a27d8865` (file verifikasi HTML Google Search Console!) sebagai URL berprioritas `1.0`, dan hanya mendaftarkan 4 dari 10 proyek yang ada (`mpp`, `jokipro`, `siskamling`, `simppk`, `caterly`, `minum-vr9` hilang).
  3. `<title>`, `meta[name="description"]`, dan `<html lang>` tidak pernah diupdate saat pindah route (`/projects`, `/project/:slug`) atau saat toggle bahasa ID/EN (`langAfterEnToggle.htmlLang` tetap `"id"`). (`react-helmet-async` sudah diinstall di `package.json` tetapi tidak dipakai sama sekali!)
  4. `llms.txt` tidak memuat daftar proyek, layanan, maupun endpoint publik utama; `fallbackProjects.js:61` dan database mencantumkan URL mencurigakan `https://siabsen.univ.edu`.
- **Dampak:** Share preview di WhatsApp/sosial media tidak menarik klik, SEO multi-bahasa & halaman detail proyek lemah, dan crawler mengindeks halaman verifikasi Google.
- **Solusi yang Disarankan:** Desain OG Banner resmi `1200×630 px` (JPG/WebP) beridentitas "Akbar Alfaidah - Web, Mobile & AI Development Studio" dan pasang tag `og:image`, `og:url`, `twitter:card`, dan `canonical`; kecualikan `google8c2a8f60a27d8865` dari `vite-plugin-sitemap` & lengkapi semua slug atau hasilkan sitemap dinamis; perbarui `document.title`, `meta description`, dan `document.documentElement.lang` per route & bahasa; perkaya JSON-LD dengan `Person` / `ProfessionalService` + `sameAs` + `makesOffer`.
- **Estimasi Effort:** **S–M**

#### `[M-06]` Arsitektur Loading & Overflow Visual: Bundle Supabase Eager, 7 Lazy Section Waterfall, Scrollbar GitHub Chart, Maps Eager Iframe

- **Skill Acuan:** `code-review-excellence`, `ui-ux-pro-max`, `design-taste-frontend`
- **Lokasi:** [src/App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L7), [src/pages/HomePage.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/HomePage.jsx#L7-L48), [src/components/Experience.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Experience.jsx#L238-L250), [src/components/Contact.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Contact.jsx#L387)
- **Masalah:**
  1. `App.jsx` mengimpor `supabase` (`208 KB`) secara sinkron demi `PageTracker`, dan `HomePage.jsx` membungkus 7 section dengan `React.lazy()` + `<Suspense>` padahal browser sudah mem-preload semua chunk-nya via `<link rel="modulepreload">` - menambah waterfall dan menggeser posisi trigger animasi GSAP/Framer Motion saat resolve.
  2. Grafik `ghchart.rshah.org/akbaralfaidah` diberi `min-w-[700px]` di dalam kartu `max-w-2xl` (`672px`), sehingga **selalu memunculkan scrollbar horizontal jelek dan memotong sisi kiri/kanan grafik bahkan di desktop 1440px** (`desktop-07-github.png`).
  3. Google Maps `<iframe>` langsung dimuat bersama script pihak ketiganya, padahal tersedia tombol `"Buka Maps"` dan kartu lokasi bisa menggunakan facade statis ringan sampai diklik ("Load interactive map") atau link eksternal sesuai pedoman `design-taste-frontend`.
- **Dampak:** First-load JS lebih gemuk, interaksi kartu GitHub terlihat terpotong di desktop, dan Maps menyumbang request pihak ketiga yang memperlambat idle network.
- **Solusi yang Disarankan:** Jadikan section utama di `HomePage` bundle terpadu (kecuali komponen berat opsional) dan tunda/ganti `PageTracker` ke Cloudflare Web Analytics yang sudah aktif (atau lazy-import `supabase` setelah idle); ubah container GitHub chart agar `w-full h-auto` responsif tanpa `min-w-[700px]`; ubah Google Maps embed menjadi kartu alamat/peta klik-untuk-muat (facade) atau tautan langsung.
- **Estimasi Effort:** **S–M**

#### `[M-07]` Kualitas Konten Case Study: Tanda `*Markdown*` Mentah, Key Details Boilerplate, dan Data Supabase Belum Terkurasi

- **Skill Acuan:** `brand`, `design-taste-frontend`, `code-review-excellence`
- **Lokasi:** [src/pages/ProjectDetail.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectDetail.jsx#L109-L138), [src/data/fallbackProjects.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/data/fallbackProjects.js#L22,L32,L43,L55), dan data live Supabase (`caterly`, `minum-vr9`)
- **Masalah:**
  1. Deskripsi proyek di `fallbackProjects.js` dan Supabase berisi tanda bintang markdown mentah (`(*schedule*)`, `(*Non-Disclosure Agreement*)`, `*human error*`, `*mood tracker*`) yang dirender apa adanya sebagai teks polos `*...*`.
  2. Bagian `Key Details` di `ProjectDetail.jsx:128-136` memakai 3 kotak hijau generik yang teksnya **identik di setiap proyek** (`"Dibangun secara spesifik untuk klien {client}"`, `"Menjawab tantangan utama dengan pendekatan modern..."`, `"Fokus pada performa, aksesibilitas..."`).
  3. Di data live Supabase, proyek `caterly` memiliki judul huruf kecil `"caterly"` dan pill `"Tailwind CSS 4."` bertitik; `Minum VR9` berisi deskripsi super singkat `"Perombakan website yang sudah ada "` dan typo `"Penyesuaian dengna design klien"`.
  4. Di `ProjectDetail.jsx:182`, tombol `"Visit Live Site"` memakai ikon `FiInfo` padahal `FiExternalLink` sudah di-import di baris 4 namun tidak dipakai.
- **Dampak:** Mengurangi kesan rekayasa mendalam saat calon klien atau recruiter memeriksa halaman detail proyek.
- **Solusi yang Disarankan:** Bersihkan karakter `*` markdown dan rapikan data proyek di Supabase (`caterly` → `Caterly`, perbaiki `"dengna"`, tambah metrik/hasil konkret per proyek); ganti `Key Details` generik dengan **fitur kunci / arsitektur / hasil terukur nyata** dari masing-masing proyek (dari field database atau fallback terstruktur); pakai `FiExternalLink` di tombol Live Site; tambah dukungan terjemahan EN/ID pada UI `ProjectDetail` dan filter `/projects`.
- **Estimasi Effort:** **M**

---

### LOW

#### `[L-01]` Dead Code, Unused Dependencies, & 25 Warning `oxlint`

- **Skill Acuan:** `code-review-excellence`
- **Lokasi:** [package.json](file:///c:/Users/akbar/Desktop/akbaralfaidah/package.json), [src/components/Experience.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Experience.jsx#L11-L163), [src/components/ProjectCard.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ProjectCard.jsx), [src/components/ui/FluidDropdown.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/FluidDropdown.jsx), [src/components/ui/ScrollExpandMedia.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/ui/ScrollExpandMedia.jsx), [src/pages/Sandbox.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/Sandbox.jsx), [src/App.css](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.css)
- **Masalah:** `three`, `@react-three/fiber`, `@react-three/drei`, `react-helmet-async`, dan `class-variance-authority` ada di `package.json` tetapi tidak digunakan di bundle aplikasi. `Experience.jsx` menyimpan >100 baris kode mati (`EXPERIENCES`, `TECH_CATEGORIES`, `renderTechCard` lengkap dengan `<style>` di dalam fungsi) serta 23 import ikon `react-icons/si` tidak terpakai. Menjalankan `npm run lint` memunculkan 25 warning.
- **Dampak:** Memperberat `npm install` di CI/Docker, membingungkan pemeliharaan kode, dan berisiko membuat developer salah mengedit komponen yang ternyata mati (`FluidDropdown`, `ProjectCard`).
- **Solusi yang Disarankan:** Hapus file mati, bersihkan seluruh dead code & unused imports hingga `oxlint` 0 warning, dan uninstall package yang tidak dipakai (atau gunakan `react-helmet-async` jika dipilih untuk SEO dinamis).
- **Estimasi Effort:** **S**

#### `[L-02]` Kebersihan Repo, File Sampah di Build Context Docker, & Favicon Default Vite Ungu

- **Skill Acuan:** `code-review-excellence`, `banner-design`, `design-taste-frontend`
- **Lokasi:** Folder `Users/` di root repo, `img/` (~18 MB), `lighthouse-*.json` (~2.3 MB), `output.css`, `split.cjs`, `download.cjs`, `screenshot.js`, [public/favicon.svg](file:///c:/Users/akbar/Desktop/akbaralfaidah/public/favicon.svg), [public/icons.svg](file:///c:/Users/akbar/Desktop/akbaralfaidah/public/icons.svg), [.dockerignore](file:///c:/Users/akbar/Desktop/akbaralfaidah/.dockerignore), [Dockerfile](file:///c:/Users/akbar/Desktop/akbaralfaidah/Dockerfile#L30)
- **Masalah:** Direktori `Users\akbar\Desktop\akbaralfaidah\.agents\...` (salinan tidak sengaja dari path absolut) ada di root repo dan tidak di-ignore oleh `.gitignore`/`.dockerignore`; file mentah `img/` (18 MB) dan report `lighthouse-*.json` (2,3 MB) ikut terkirim ke Docker build context; `public/favicon.svg` & `public/icons.svg` masih berupa ikon petir/sosial ungu bawaan template Vite; `Dockerfile` memakai `npm install` alih-alih `npm ci`.
- **Dampak:** Konteks build Docker di GitHub Actions membengkak puluhan MB tanpa alasan dan berisiko memicu inkonsistensi lockfile.
- **Solusi yang Disarankan:** Hapus `Users/`, `output.css`, `split.cjs`, `download.cjs`, `screenshot.js`, `lighthouse-*.json`, `public/icons.svg`, dan `public/favicon.svg` (ganti favicon dengan monogram `AF` vektor resmi); pindahkan/hapus `img/` mentah dari build context lewat `.dockerignore`; ubah `Dockerfile` ke `npm ci`.
- **Estimasi Effort:** **S**

#### `[L-03]` `useTheme()` Bukan React Context & Kontras Border Dark Mode di `About.jsx`

- **Skill Acuan:** `code-review-excellence`, `ui-styling`
- **Lokasi:** [src/hooks/useTheme.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/hooks/useTheme.js), [src/components/Footer.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Footer.jsx#L5), [src/components/About.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/About.jsx#L42)
- **Masalah:** `useTheme` membuat state lokal terpisah di setiap komponen yang memanggilnya (`Navbar`, `Footer`, `ProjectProgress`) alih-alih Context global, sehingga state `theme` antar komponen tidak tersinkronisasi di memori React. Selain itu `border-paper dark:border-charcoal` di foto About memunculkan border putih terang di mode gelap karena `--color-charcoal` berubah ke `#F2F0E8`.
- **Dampak:** Visual dark mode pada kartu foto About tampak tajam/mengganggu dan komponen lain tidak bereaksi otomatis saat theme berubah.
- **Solusi yang Disarankan:** Bungkus aplikasi dengan `ThemeProvider` Context dan perbaiki border foto About menjadi `border-paper dark:border-[#1A1A1C]`.
- **Estimasi Effort:** **S**

#### `[L-04]` Mutasi DOM Langsung di `Experience.jsx` & Pelacakan `userAgent` Mentah di `PageTracker`

- **Skill Acuan:** `code-review-excellence`
- **Lokasi:** [src/components/Experience.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/components/Experience.jsx#L244-L247), [src/App.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/App.jsx#L96-L100), [src/pages/ProjectProgress.jsx](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/pages/ProjectProgress.jsx#L267)
- **Masalah:** Handler `onError` pada gambar GitHub chart langsung menimpa `e.target.parentElement.innerHTML = '...'` (anti-pattern di React yang bisa memicu error reconciliation); `PageTracker` mengirim `navigator.userAgent` penuh ke Supabase di setiap kunjungan tanpa status state atau opsi fallback jika analytics sudah ditangani Cloudflare Web Analytics.
- **Dampak:** Berisiko error DOM jika React me-re-render komponen, serta duplikasi beban analytics karena Cloudflare Web Analytics (`beacon.min.js`) sudah terpasang.
- **Solusi yang Disarankan:** Gunakan React state `const [chartError, setChartError] = useState(false)` di `Experience.jsx`, dan evaluasi apakah `PageTracker` Supabase masih dibutuhkan mengingat Cloudflare Web Analytics sudah aktif.
- **Estimasi Effort:** **S**

---

## Quick Wins (< 1 Jam) vs Perubahan Besar

### Quick Wins (Bisa Diselesaikan < 1 Jam per Item)

1. **Fix `C-02` (`fetchProjects` crash):** Import `fallbackProjects` di [src/data/projects.js](file:///c:/Users/akbar/Desktop/akbaralfaidah/src/data/projects.js) agar halaman proyek tidak pernah crash saat Supabase cold start.
2. **Fix `C-01` (Font Google gagal load):** Hapus `media="print" onload="this.media='all'"` di [index.html](file:///c:/Users/akbar/Desktop/akbaralfaidah/index.html#L40-L42) atau host `Outfit` & `JetBrains Mono` di `public/fonts/`, dan bersihkan sisa preloading `Poppins`.
3. **Fix `C-03` (`noindex` bocor & 404 kosong):** Pisahkan logika `noindex` di `ProjectProgress.jsx` agar hanya terpasang saat statusnya benar-benar tracker privat, serta tambahkan `<Route path="*">` 404 page di `App.jsx`.
4. **Fix Typo Fatal Copy (`H-03`):** Perbaiki `"and weddings in Jambi"` (`en.json:31`), `"Terpecaya"` (`id.json:21`), `"Aplikasi mu?"` (`id.json:102`), `"dengna"` & `"caterly"` di Supabase, serta hapus `*markdown*` di `fallbackProjects.js`.
5. **Fix `H-07` Mobile Menu Scroll Offset & `Services` Justification:** Gunakan `handleNavClick` di mobile menu (`Navbar.jsx:203-212`), hapus `text-justify` di `Services.jsx`, dan hapus dekorasi `+` yang menabrak teks.
6. **Fix `M-05` Sitemap & OG Meta Dasar:** Kecualikan `google8c2a8f60a27d8865` dari `sitemap.xml`, tambah semua slug proyek, dan tambah `og:image` + `twitter:card` + `canonical` di `index.html`.
7. **Fix `L-01` & `L-02` Kebersihan Repo:** Bersihkan 25 warning `oxlint`, hapus file sampah (`Users/`, `split.cjs`, `download.cjs`, `screenshot.js`, `output.css`, `App.css`, `Sandbox.jsx`, `FluidDropdown.jsx`, `ScrollExpandMedia.jsx`, `ProjectCard.jsx`), update `.dockerignore` & `Dockerfile` (`npm ci`).

### Perubahan Besar (Terencana & Arsitektural)

1. **Redesain Hero & Eliminasi Scroll-Jacking (`H-02`, `H-03`, `H-07`):** Merancang ulang Hero agar langsung menjual value proposition dalam 5 detik pertama di desktop, tablet (`768px`), dan mobile (`375px`), serta mengganti `YouCanScroll` 4.092 px dengan section kapabilitas yang fokus.
2. **Sistem Token & Penyatuan Komponen UI (`C-05`, `M-01`, `M-02`, `M-03`, `H-06`):** Menata ulang 3-layer design token yang lulus WCAG AA (Light & Dark), menyatukan `Navbar` + `Button` + `Card` + 1 family ikon di seluruh route (`/` + `/projects` + `/project/:slug`), dan membereskan `prefers-reduced-motion` + focus ring.
3. **Transformasi Anti-Slop pada `About`, `Services`, `Projects`, & `Testimonials` (`H-04`, `H-05`, `M-07`):** Mengganti wireframe palsu, floating pills di foto, dan fake X/Twitter cards dengan visual karya nyata, case study terstruktur, dan testimoni autentik.
4. **Migrasi Aset Gambar & Server-Side Contact Verification (`C-04`, `H-01`, `H-08`):** Mengubah logo `AF` ke vektor SVG murni (< 3 KB), mengonversi semua gambar proyek di Supabase Storage ke WebP ringan, mengamankan Nginx headers untuk static assets, dan memindahkan verifikasi Turnstile + EmailJS/notifikasi ke Supabase Edge Function.

---

## Ide Upgrade UI/UX yang Spesifik & Berani

_(Skill yang digunakan: `design-taste-frontend`, `design`, `brand`, `banner-design`, `ui-ux-pro-max`)_

Alih-alih saran klise seperti _"perbaiki spacing"_, berikut 5 upgrade spesifik yang dirancang agar situs terasa milik **Akbar Alfaidah (Engineering Studio / Tech Agency di Jambi)**-bukan template developer yang bisa ditukar ke orang lain:

### 1. Hero Baru: "Interactive Product Stage + Plain Engineering Promise" (Bukan Orbit Klise & Marquee 100 Ikon)

- **Kenapa cocok dengan identitas Anda:** Klien UMKM, perusahaan, dan instansi di Jambi datang dengan satu pertanyaan: _"Mas Akbar bisa bikin sistem seperti apa, dan sudah pernah bikin apa yang terbukti jalan?"_ Mereka tidak peduli 25 ikon logo teknologi berputar tanpa henti.
- **Konsep Spesifik:**
  - **Kiri:** Kicker `Web • Mobile • AI Studio - Jambi & Remote`, **H1 yang menyebut produk & pembeli** (_"Sistem Web, Aplikasi Mobile & AI untuk Bisnis Anda."_), sub-line ringkas berisi bukti konkret (_"Dari POS toko bangunan hingga portal instansi pemerintahan-dirancang dari nol hingga live di server produksi."_), **2 CTA tegas** (`Konsultasi Proyek →` dan `Lihat Studi Kasus`), plus strip 3 fakta terukur nyata (bukan angka ngarang, misalnya jumlah sistem live, cakupan layanan Web/Mobile/AI, domisili tatap muka Jambi / remote).
  - **Kanan (Dealt Product Stage):** Mengganti Orbit 3D yang terpotong menjadi **1 Interactive Project Switcher Frame** bergaya editorial bersih: menampilkan mockup nyata _BosDepot_, _ChatTask_, _MPP Digital_, dan _Caterly_ dengan tab klik-manual (1 klik langsung pindah preview + 1 kalimat metrik hasil + link langsung ke `/project/:slug`). Tidak perlu rAF loop berat, tetap responsif sempurna di `768px` dan `375px`.

### 2. Ganti `YouCanScroll` 4.092 px dengan "Capabilities Matrix / Interactive Architecture Preview"

- **Kenapa cocok dengan identitas Anda:** Sebagai Full-Stack & AI Engineer yang menangani hingga Docker/CI-CD/Coolify, kekuatan Anda adalah kemampuan **end-to-end** (dari UI hingga server/hardware).
- **Konsep Spesifik:** Alih-alih mengunci layar scroll pengguna 4.092 px hanya untuk membaca `"saya bisa membuat website"`, buat satu section compact (`1 layar`) berjudul **"Dari Alur Kerja Manual ke Sistem Produksi"** dengan 3 tab interaktif (_Web & Portal Instansi_, _Aplikasi Mobile & Hardware_, _Otomasi & AI_) yang langsung memperlihatkan diagram alur/arsitektur sederhana + contoh sistem nyata yang pernah Anda bangun (_MPP Digital_, _BosDepot_, _ChatTask/PEKA_).

### 3. Perombakan `Services`: Hapus Wireframe Dummy, Pakai "Scope, Deliverables & Realistic Timeline Cards"

- **Kenapa cocok dengan identitas Anda:** Calon klien SME/UMKM sering bingung apa yang sebenarnya mereka dapat saat menyewa developer/agency.
- **Konsep Spesifik:** Gunakan layout asimetris Editorial Paper & Charcoal yang tegas (sesuai palet hangat `Paper` + `Charcoal` + `Brass` berkarakter): setiap kartu layanan (`Web Systems`, `Mobile Apps`, `AI & Automation`) menampilkan: (a) masalah bisnis yang diselesaikan, (b) **daftar deliverable nyata** (misal _"UI/UX, Backend API, Deploy Server & Dokumentasi"_), (c) estimasi durasi realistis (_"2–8 Minggu"_), dan (d) 1 thumbnail mikro/tautan langsung ke proyek referensi terkait (`Contoh: BosDepot →`), bukan kotak abu-abu dengan 3 titik merah-kuning-hijau.

### 4. Redesain `Testimonials` Menjadi "Verified Client Notes & Project Outcomes" (Tinggalkan Fake Tweets)

- **Kenapa cocok dengan identitas Anda:** Testimoni asli Anda justru berasal dari pesan WhatsApp jujur klien Indonesia (`"Okee kk..."`, `"akbar gg, kerja selesai cepat, data tepat dan akurat"`). Memaksakannya ke dalam kartu X/Twitter dengan centang biru & 89 likes merusak kejujuran itu.
- **Konsep Spesifik:** Ubah menjadi **2–3 kartu kutipan editorial grid 12-kolom yang seluruhnya langsung terbaca** (tanpa miring/bertumpuk), lengkap dengan konteks proyek (`"Proyek: Sistem Absensi Geofencing (SiAbsen)"`, `"Proyek: Rekapitulasi Pegawai (SimPPK)"`), kutipan bersih tanpa watermark ikon sosial palsu, dan CTA ke detail proyeknya. (Buang 2 testimoni generik yang terkesan buatan jika belum terverifikasi dari klien nyata, atau ganti dengan kutipan asli proyek _BosDepot_/_Caterly_/_Balai Gakkum_ bila ada izin.)

### 5. `About` dengan Foto Manusiawi & Identitas Studio/Agency yang Tegas + Custom OG Banner (`1200×630`)

- **Kenapa cocok dengan identitas Anda:** Foto siluet gelap di kafe tidak memperlihatkan wajah orang yang akan diajak kerja sama oleh klien di Jambi. Di sisi lain, Anda membawa brand `"Akbar Alfaidah"` dan `"Tech Agency"`.
- **Konsep Spesifik:** Gunakan potret wajah yang jelas/terang (atau foto saat bekerja di depan workstation/diskusi) tanpa stiker melayang beranimasi yang menutupi wajah/sudut foto; pindahkan 3–4 fakta kredensial nyata (pengalaman instansi/UMKM/Telkomsel/PLN/Balai Gakkum) ke tipografi grid rapi di sebelah copy. Sekaligus buat **OG Banner Image (`public/og-banner.jpg`)** bernuansa Paper/Charcoal/Brass dengan monogram vektor `AF` murni untuk share link profesional di WhatsApp & LinkedIn.

---

## Urutan Eksekusi yang Disarankan (Per Batch Kecil & Aman)

Agar pemeliharaan aman, mudah di-review, dan tidak mengganggu website live di Coolify sebelum siap, jalankan dalam **5 batch bertahap**:

### Batch 1 - Hotfix Kritis Produksi & Kebersihan Repo (Effort: S)

_Fokus: Menutup crash bug, CSP font block, SEO `noindex` bocor, typo fatal, dan sampah repo tanpa mengubah layout besar._

- [ ] Perbaiki import `fallbackProjects` di `src/data/projects.js` (`C-02`).
- [ ] Perbaiki pemuatan font `Outfit` & `JetBrains Mono` agar tidak diblokir CSP, dan selaraskan `@font-face` di `index.html`, `index.css`, dan `tailwind.config.js` (`C-01`).
- [ ] Pisahkan/perbaiki logika `noindex,nofollow` di `ProjectProgress.jsx` / `App.jsx` agar slug baru seperti `caterly` tidak terkena `noindex`, serta tambah halaman 404 `<Route path="*">` (`C-03`).
- [ ] Perbaiki typo copy di `id.json` (`"Terpecaya"` → `"Terpercaya"`, `"Aplikasi mu?"` → `"Aplikasimu?"`) dan `en.json` (`"and weddings in Jambi"` → `"and companies in Jambi"`), serta bersihkan `*markdown*` di `fallbackProjects.js` (`H-03`, `M-07`).
- [ ] Bersihkan 25 warning `oxlint`, dead code (`Experience.jsx`, file yatim), perbarui `.dockerignore`, hapus folder `Users/`, dan ganti `npm install` → `npm ci` di `Dockerfile` (`L-01`, `L-02`).

### Batch 2 - Performa Aset, Security Headers & SEO Dasar (Effort: S–M)

_Fokus: Memangkas ukuran halaman ~6 MB menjadi ratusan KB dan memperkuat header Nginx + SEO._

- [ ] Ganti `public/img/unbackground.svg` (181 KB base64 PNG) & `public/favicon.svg` (ikon ungu Vite) dengan logo vektor `AF` murni (< 3 KB) (`C-04`, `L-02`).
- [ ] Migrasi/upload versi `.webp` ringan untuk 4 proyek unggulan di Supabase Storage (dan perbarui URL di admin dashboard `work.akbaralfaidah.com`) serta kompresi/ganti `on_development.gif` (`C-04`).
- [ ] Perbaiki `nginx.conf` agar semua security headers ikut terkirim di static assets + tambah `no-cache` untuk `index.html` + pindahkan `Permissions-Policy`/`CSP` ke HTTP header (`H-08`).
- [ ] Buat `og-banner.jpg` (`1200×630`), lengkapi `og:image`, `twitter:card`, `canonical`, dinamis `title`/`html[lang]` per route & bahasa, serta bersihkan `sitemap.xml` dari file verifikasi Google (`M-05`).

### Batch 3 - Design System Tokens, Aksesibilitas & Unified Navigation (Effort: M)

_Fokus: Menyelaraskan token warna lulus WCAG AA, keyboard/reduced-motion a11y, dan navigasi antar-halaman._

- [ ] Refaktor token CSS 3-layer di `index.css` & `tailwind.config.js` agar kontras Light & Dark seluruh elemen minimal `4.5:1` dan buang bug `dark:border-charcoal` (`C-05`, `M-01`, `L-03`).
- [ ] Buat `ThemeContext` terpusat dan samakan 1 library ikon (`lucide-react` + ikon brand teknologi seperlunya) (`M-01`, `L-03`).
- [ ] Pasang `Navbar` + `Footer` konsisten di semua route (`/`, `/projects`, `/project/:slug`), perbaiki link Footer `/#...` dan tombol kembali di `ProjectDetail` (`M-03`).
- [ ] Perbaiki semua temuan a11y: dukungan `prefers-reduced-motion`, focus ring terlihat di `Navbar` & `Button`, hapus duplikasi DOM di `AnimatedButton`, `aria-hidden` di ikon marquee, fix heading order `H2 → H3` di Contact & type scale terstruktur, mobile tap targets ≥ `44px`, dan perbaiki `handleNavClick` di Mobile Menu (`H-06`, `H-07`, `M-02`).

### Batch 4 - Redesain Section Anti-Slop, Hero & UX Konversi (Effort: L)

_Fokus: Mengubah wajah portfolio dari "template AI" menjadi "Akbar Alfaidah Engineering Studio" yang kuat di semua viewport._

- [ ] Hapus/ganti `YouCanScroll.jsx` (4.092 px scroll-jacking) dan eval kebutuhan `gsap`/`lenis` (`H-02`).
- [ ] Redesain `Hero` dengan H1 yang jelas menjual jasa + lokasi/jangkauan serta Interactive Project Stage yang tidak terpotong di `768px` dan `375px` (`H-03`, `H-07`).
- [ ] Redesain `About` (foto jelas tanpa 4 badge melayang), `Services` (hilangkan wireframe dummy, `+` tabrakan, dan `text-justify`), `Experience` (GitHub chart responsif tanpa scrollbar), dan `Testimonials` (kartu editorial autentik non-Twitter yang terbaca di semua ukuran layar) (`H-04`, `H-05`, `M-06`).
- [ ] Tingkatkan `ProjectDetail` dengan studi kasus terstruktur (masalah, arsitektur/fitur kunci spesifik, hasil) dan CTA konversi menuju Contact (`M-07`).

### Batch 5 - Harden Contact Form & Server-Side Turnstile (Effort: M)

_Fokus: Validasi form inline yang ramah pengguna + keamanan anti-spam server-side._

- [ ] Ganti Toast-only validation menjadi error inline per field + auto-focus field error, ARIA `listbox` pada dropdown timeline, facade klik-untuk-muat pada Google Maps, terjemahan penuh ID/EN, dan sinkronisasi theme Turnstile (`M-04`, `M-06`).
- [ ] Implementasikan Supabase Edge Function untuk verifikasi server-side Turnstile (`siteverify`), rate limiting berbasis server, dan pengiriman email aman (`H-01`).

---

**Status Saat Ini:** Laporan disimpan di [AUDIT-REPORT.md](file:///c:/Users/akbar/Desktop/akbaralfaidah/AUDIT-REPORT.md). Tidak ada file kode atau konfigurasi proyek yang dimodifikasi. Silakan pilih temuan atau batch mana yang ingin Anda kerjakan terlebih dahulu.
