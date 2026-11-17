export const fallbackProjects = [
  {
    id: 'bosdepot',
    slug: 'bosdepot',
    name: 'BosDepot',
    src: '/img/banners/bosdepot.webp',
    client: 'Depot Kayu & Toko Bangunan Esa',
    year: '2026',
    role: 'Mobile Developer',
    url: 'https://bosdepot.com',
    categories: ['Mobile Apps'],
    shortDescription:
      'Aplikasi POS & Manajemen Gudang terintegrasi hardware (Scanner Barcode, Thermal Printer, Biometrik).',
    shortDescriptionEn:
      'Hardware-integrated POS & warehouse management mobile app with barcode scanning, thermal receipt printing, and biometric auth.',
    techStack: ['Flutter', 'Firebase', 'GetX', 'SQLite', 'FL Chart'],
    status: 'selesai',
    challenge:
      'Membangun aplikasi terintegrasi untuk POS (Point of Sale) kasir, manajemen gudang, dan sistem operasional harian yang mampu menangani ribuan transaksi material bangunan tanpa lag.',
    challengeEn:
      'Building a unified POS cashier, warehouse inventory, and daily operations app capable of processing high-volume building supply transactions smoothly.',
    solution:
      'Merancang arsitektur UI yang intuitif agar karyawan toko bangunan yang kurang terbiasa dengan teknologi dapat langsung memproses penjualan, mengecek stok gudang, dan mencetak struk dalam satu alur kerja.',
    solutionEn:
      'Designed an intuitive offline-first workflow backed by local SQLite persistence, Firebase sync, and direct hardware integration for barcode scanners and thermal printers.',
    highlights: [
      'Koneksi langsung Scanner Barcode & Thermal Printer Bluetooth',
      'Penyimpanan lokal SQLite agar kasir tetap jalan saat jaringan tidak stabil',
      'Otentikasi biometrik perangkat untuk keamanan otorisasi kasir'
    ],
    highlightsEn: [
      'Direct Bluetooth thermal printer and barcode scanner hardware bridge',
      'Offline-resilient SQLite persistence synced to Firebase',
      'Device biometric authentication for cashier authorization'
    ]
  },
  {
    id: 'chattask',
    slug: 'chattask',
    name: 'ChatTask',
    src: '/img/banners/chattask.webp',
    client: 'Internal Product',
    year: '2026',
    role: 'Fullstack Developer',
    url: 'https://chattask.app',
    categories: ['Website', 'Machine Learning'],
    shortDescription:
      'Manajemen tugas cerdas untuk merapikan dan menjadwalkan instruksi dari chat WhatsApp menggunakan NLP.',
    shortDescriptionEn:
      'Intelligent task manager that parses, structures, and schedules action items directly from WhatsApp threads using NLP.',
    techStack: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'NLP'],
    status: 'selesai',
    challenge:
      'Banyak pekerja dan tim kewalahan melacak tugas yang menumpuk di chat WhatsApp, sehingga instruksi penting dan tenggat waktu sering terlewat.',
    challengeEn:
      'Teams frequently lose critical action items and deadlines buried inside fast-moving WhatsApp group threads.',
    solution:
      'Membangun platform manajemen tugas cerdas yang merapikan, mencatat, dan menjadwalkan setiap instruksi yang masuk melalui pesan WhatsApp secara real-time.',
    solutionEn:
      'Engineered an NLP parsing pipeline paired with real-time Socket.io task boards and PostgreSQL/Prisma scheduling.',
    highlights: [
      'Ekstraksi instruksi dan tenggat waktu otomatis berbasis NLP',
      'Pembaruan board real-time via Socket.io antar anggota tim',
      'Skema database relasional PostgreSQL + Prisma ORM'
    ],
    highlightsEn: [
      'Automated instruction and deadline extraction powered by NLP',
      'Real-time collaborative board synchronization over Socket.io',
      'Strongly typed PostgreSQL + Prisma relational data layer'
    ]
  },
  {
    id: 'jokipro',
    slug: 'jokipro',
    name: 'JokiPro',
    src: '/img/banners/jokipro.webp',
    client: 'Confidential Client (NDA)',
    year: '2026',
    role: 'UI/UX Designer & Frontend',
    url: 'https://jokipro.com',
    categories: ['Website'],
    shortDescription:
      'Landing page profil layanan digital modern dan interaktif dengan identitas disamarkan (NDA).',
    shortDescriptionEn:
      'Modern interactive company profile & service landing platform delivered under a strict Non-Disclosure Agreement.',
    techStack: ['Vue.js', 'SCSS', 'GSAP'],
    status: 'selesai',
    challenge:
      'Merancang landing page profil perusahaan yang profesional dan ekspresif dengan syarat menjaga kerahasiaan identitas asli klien sesuai Non-Disclosure Agreement.',
    challengeEn:
      'Designing an expressive commercial landing page while strictly preserving client identity confidentiality under NDA.',
    solution:
      'Membuat halaman interaktif berbasis Vue.js dan SCSS dengan transisi presisi, sementara identitas klien disamarkan menjadi JokiPro pada etalase portofolio publik.',
    solutionEn:
      'Delivered a modular Vue.js + SCSS architecture with choreographed scroll transitions, anonymized cleanly for public showcase.',
    highlights: [
      'Arsitektur komponen Vue.js yang ringan dan modular',
      'Micro-interaction terukur menggunakan timeline SCSS & GSAP',
      'Kepatuhan penuh terhadap perjanjian kerahasiaan klien (NDA)'
    ],
    highlightsEn: [
      'Lightweight, modular Vue.js component architecture',
      'Choreographed viewport transitions styled with custom SCSS',
      'Strict adherence to client Non-Disclosure Agreement'
    ]
  },
  {
    id: 'mpp',
    slug: 'mpp',
    name: 'MPP Digital',
    src: '/img/banners/mpp.webp',
    client: 'Instansi Pemerintah Daerah',
    year: '2026',
    role: 'Frontend Architect',
    categories: ['Website'],
    shortDescription:
      'Digitalisasi survei penilaian Mal Pelayanan Publik (MPP) untuk mengotomatiskan rekapitulasi data masyarakat.',
    shortDescriptionEn:
      'Digitized public service satisfaction survey & automated real-time analytics dashboard for a Regional Public Service Mall.',
    techStack: ['React', 'Material UI', 'TypeScript'],
    status: 'selesai',
    challenge:
      'Sistem evaluasi Mal Pelayanan Publik sebelumnya menggunakan survei kertas dan rekap manual yang lambat serta rentan human error.',
    challengeEn:
      'Legacy paper-based citizen satisfaction evaluations slowed reporting cycles and introduced manual tallying errors.',
    solution:
      'Mendigitalisasi seluruh alur survei penilaian ke aplikasi web terintegrasi sehingga rekapitulasi data dan skor indeks kepuasan masyarakat terhitung otomatis secara real-time.',
    solutionEn:
      'Built a React + TypeScript web application automating citizen survey submission, aggregation, and public service index scoring in real time.',
    highlights: [
      'Otomatisasi kalkulasi Indeks Kepuasan Masyarakat secara real-time',
      'Antarmuka kuesioner cepat untuk penggunaan di loket maupun perangkat warga',
      'Type-safety menyeluruh dengan TypeScript untuk keandalan data instansi'
    ],
    highlightsEn: [
      'Automated real-time Public Satisfaction Index computation',
      'Fast kiosk-friendly questionnaire interface for on-site citizens',
      'End-to-end TypeScript safety for public sector reporting accuracy'
    ]
  },
  {
    id: 'peka',
    slug: 'peka',
    name: 'PEKA',
    src: '/img/banners/peka.webp',
    client: 'Top 33 Indonesia Next',
    year: '2026',
    role: 'Fullstack Developer',
    categories: ['Website', 'Machine Learning'],
    shortDescription:
      'Platform cerdas dengan integrasi Gemini API untuk pelacakan mood, refleksi emosional, dan ekspor ringkasan visual.',
    shortDescriptionEn:
      'AI-assisted mood reflection & emotional tracking platform powered by Gemini API with visual summary export.',
    techStack: ['React', 'Supabase', 'Gemini API', 'Tailwind CSS', 'Framer Motion'],
    status: 'selesai',
    challenge:
      'Banyak pengguna membutuhkan ruang aman yang privat dan mudah diakses untuk mencatat kondisi mental harian sekaligus memperoleh refleksi yang suportif.',
    challengeEn:
      'Individuals needed a private, accessible space to track daily emotional trends and receive structured, supportive AI feedback.',
    solution:
      'Membangun PEKA sebagai platform web mood tracker interaktif berbasis Supabase dan Gemini API dengan pelacakan tren emosional serta ekspor ringkasan visual.',
    solutionEn:
      'Engineered an interactive mood tracking web app combining Supabase auth/storage with Gemini API reflection prompts and exportable summaries.',
    highlights: [
      'Integrasi Gemini API untuk umpan balik reflektif yang kontekstual',
      'Pencatatan dan riwayat mood harian tersinkronisasi lewat Supabase',
      'Ekspor ringkasan kartu visual yang rapi langsung dari browser'
    ],
    highlightsEn: [
      'Contextual reflection workflows integrated with the Gemini API',
      'Private daily mood timeline synchronized via Supabase',
      'Client-side visual summary card generation and export'
    ]
  },
  {
    id: 'siabsen',
    slug: 'siabsen',
    name: 'SiAbsen',
    src: '/img/banners/siabsen.webp',
    client: 'Perguruan Tinggi Daerah',
    year: '2026',
    role: 'Mobile Developer',
    categories: ['Mobile Apps'],
    shortDescription:
      'Sistem absensi mahasiswa berbasis Geofencing radius kelas untuk mencegah kecurangan presensi.',
    shortDescriptionEn:
      'Geofencing-verified university student attendance mobile app preventing remote proxy check-ins.',
    techStack: ['Flutter', 'Firebase', 'Geofencing'],
    status: 'selesai',
    challenge:
      'Proses absensi perkuliahan konvensional rawan manipulasi atau titip absen ketika verifikasi lokasi tidak diterapkan.',
    challengeEn:
      'Conventional classroom attendance methods were vulnerable to proxy check-ins without coordinate verification.',
    solution:
      'Mengimplementasikan validasi Geofencing radius 50 meter dari titik koordinat ruang kelas di aplikasi Flutter agar presensi hanya sah ketika mahasiswa berada di lokasi.',
    solutionEn:
      'Implemented strict 50-meter GPS geofence validation inside Flutter backed by real-time Firebase attendance logs.',
    highlights: [
      'Validasi koordinat GPS real-time dalam radius 50 meter ruang kelas',
      'Sinkronisasi kehadiran langsung ke dashboard dosen lewat Firebase',
      'Mencegah manipulasi lokasi dasar dan mempercepat rekap kelas'
    ],
    highlightsEn: [
      'Real-time GPS coordinate enforcement within a 50-meter classroom radius',
      'Instant attendance logging synchronized via Firebase',
      'Streamlined lecturer roster verification and export'
    ]
  },
  {
    id: 'simppk',
    slug: 'simppk',
    name: 'SimPPK',
    src: '/img/banners/simppk.webp',
    client: 'Instansi Kepegawaian Daerah',
    year: '2026',
    role: 'Frontend Engineer',
    categories: ['Website'],
    shortDescription:
      'Sistem Informasi Pemerintahan untuk manajemen berkas dan rekapitulasi data pegawai PPPK.',
    shortDescriptionEn:
      'Government personnel information system for managing and auditing PPPK civil servant records at scale.',
    techStack: ['Next.js', 'Chakra UI', 'GraphQL'],
    status: 'selesai',
    challenge:
      'Instansi membutuhkan platform terstruktur dan cepat untuk menampung, memverifikasi, serta merekap data kepegawaian PPPK berskala besar.',
    challengeEn:
      'Agencies needed a structured, responsive web portal to store, filter, and audit large-scale PPPK personnel directories.',
    solution:
      'Mengembangkan Sistem Informasi Kepegawaian berbasis Next.js dan GraphQL agar pencarian data, paginasi besar, dan rekap administrasi berjalan responsif.',
    solutionEn:
      'Built a Next.js + GraphQL portal optimized for fast filtered lookups, document verification, and administrative summaries.',
    highlights: [
      'Query data terstruktur & efisien melalui endpoint GraphQL',
      'Arsitektur Next.js untuk waktu muat cepat pada tabel data besar',
      'Alur verifikasi dan rekapitulasi berkas kepegawaian terpusat'
    ],
    highlightsEn: [
      'Efficient typed queries and pagination through GraphQL',
      'Fast SSR/CSR table rendering powered by Next.js',
      'Centralized personnel record audit and reporting workflow'
    ]
  },
  {
    id: 'siskamling',
    slug: 'siskamling',
    name: 'Siskamling App',
    src: '/img/banners/siskamling.webp',
    client: 'Sistem Operasional Warga',
    year: '2026',
    role: 'Web Developer',
    categories: ['Website'],
    shortDescription:
      'Aplikasi pengelolaan jadwal ronda dan presensi kehadiran petugas berbasis Geolocation pos keamanan.',
    shortDescriptionEn:
      'Community neighborhood watch scheduling and geolocation check-in web platform.',
    techStack: ['React', 'Geolocation API', 'Node.js'],
    status: 'selesai',
    challenge:
      'Pengaturan jadwal ronda malam dan pemantauan kehadiran kerap tidak terdata rapi ketika hanya mengandalkan grup chat.',
    challengeEn:
      'Rotating night-watch rosters and attendance tracking were fragmented across manual whiteboards and chat groups.',
    solution:
      'Mengembangkan aplikasi web jadwal ronda otomatis dengan verifikasi Geolocation API di titik pos keamanan agar pencatatan kehadiran akurat.',
    solutionEn:
      'Developed an automated roster web app paired with browser Geolocation API check-ins anchored to security post coordinates.',
    highlights: [
      'Penjadwalan giliran jaga otomatis berbasis rotasi kelompok',
      'Verifikasi titik pos ronda langsung melalui browser Geolocation API',
      'Riwayat kehadiran petugas tersimpan rapi di backend Node.js'
    ],
    highlightsEn: [
      'Automated group shift rotation and schedule visibility',
      'Direct security post verification via browser Geolocation API',
      'Persistent check-in ledger backed by Node.js'
    ]
  }
];
