export const projects = [
  { 
    id: 'bosdepot',
    slug: 'bosdepot',
    name: 'BosDepot', 
    src: '/img/Katalog- Proyek/bosdepot.svg',
    client: 'PT BosDepot Indonesia',
    year: '2026',
    role: 'Lead Frontend Developer',
    url: 'https://bosdepot.com',
    techStack: ['React', 'TailwindCSS', 'Redux', 'Framer Motion'],
    challenge: 'Membangun platform supply chain material bangunan yang mampu menangani ribuan transaksi harian tanpa lag. Tantangan utamanya adalah membuat UI yang kompleks menjadi sangat sederhana dan intuitif bagi pengguna lapangan.',
    solution: 'Kami merancang arsitektur micro-frontend dan mengimplementasikan virtualisasi list untuk memastikan performa tetap maksimal meski memuat ribuan baris data katalog. UI dibuat dengan pendekatan "Mobile-First" yang sangat bersahabat untuk layar sentuh.'
  },
  { 
    id: 'chattask',
    slug: 'chattask',
    name: 'ChatTask', 
    src: '/img/Katalog- Proyek/chattask.svg',
    client: 'Internal Product',
    year: '2026',
    role: 'Fullstack Developer',
    url: 'https://chattask.app',
    techStack: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma'],
    challenge: 'ChatTask membutuhkan sistem real-time yang bisa mensinkronkan pesan chat sekaligus manajemen tugas (to-do list) antar puluhan anggota tim secara instan tanpa delay atau konflik data.',
    solution: 'Menggunakan WebSockets (Socket.io) untuk sinkronisasi dua arah yang instan, ditambah optimistic UI updates di sisi frontend agar aplikasi terasa sangat cepat.'
  },
  { 
    id: 'jokipro',
    slug: 'jokipro',
    name: 'JokiPro', 
    src: '/img/Katalog- Proyek/jokipro.svg',
    client: 'Startup JokiPro',
    year: '2026',
    role: 'UI/UX Designer & Frontend',
    url: 'https://jokipro.com',
    techStack: ['Vue.js', 'SCSS', 'GSAP'],
    challenge: 'Mendesain ulang platform yang sebelumnya terlihat membosankan menjadi platform yang energik dan disukai oleh target pasar anak muda / Gen Z.',
    solution: 'Memasukkan elemen desain brutalist modern dengan animasi GSAP yang playful, serta skema warna yang berani untuk memikat perhatian langsung dari detik pertama.'
  },
  { 
    id: 'mpp',
    slug: 'mpp',
    name: 'MPP Digital', 
    src: '/img/Katalog- Proyek/mpp.svg',
    client: 'Pemerintah Daerah',
    year: '2026',
    role: 'Frontend Architect',
    techStack: ['React', 'Material UI', 'TypeScript'],
    challenge: 'Mendigitalisasi Mal Pelayanan Publik (MPP) ke dalam aplikasi web. Aplikasi ini harus mematuhi standar aksesibilitas (WCAG) yang sangat ketat karena digunakan oleh seluruh lapisan masyarakat.',
    solution: 'Membangun sistem komponen yang sepenuhnya dapat diakses via keyboard dan screen-reader, serta menggunakan rasio kontras warna tinggi untuk memastikan keterbacaan yang maksimal.'
  },
  { 
    id: 'peka',
    slug: 'peka',
    name: 'PEKA', 
    src: '/img/Katalog- Proyek/peka.svg',
    client: 'NGO Peduli Kucing',
    year: '2026',
    role: 'Mobile Developer',
    techStack: ['React Native', 'Firebase'],
    challenge: 'Membuat aplikasi pelaporan hewan terlantar yang bisa digunakan dengan kondisi sinyal internet yang sangat minim di jalanan.',
    solution: 'Mengimplementasikan arsitektur Offline-First. Pengguna bisa membuat laporan tanpa internet, dan laporan akan terkirim otomatis di background saat mereka kembali mendapat sinyal.'
  },
  { 
    id: 'siabsen',
    slug: 'siabsen',
    name: 'SiAbsen', 
    src: '/img/Katalog- Proyek/siabsen.svg',
    client: 'Universitas Lokal',
    year: '2026',
    role: 'Frontend Developer',
    url: 'https://siabsen.univ.edu',
    techStack: ['React', 'Vite', 'TailwindCSS'],
    challenge: 'Menggantikan sistem absensi fingerprint lama dengan sistem absensi berbasis lokasi (Geofencing) dan deteksi wajah ringan via browser web.',
    solution: 'Memanfaatkan HTML5 Geolocation API dan library face-api.js versi teringan untuk memverifikasi kehadiran mahasiswa secara real-time langsung dari smartphone mereka tanpa perlu instalasi aplikasi.'
  },
  { 
    id: 'simppk',
    slug: 'simppk',
    name: 'SimPPK', 
    src: '/img/Katalog- Proyek/simppk.svg',
    client: 'Dinas Kesehatan',
    year: '2026',
    role: 'Frontend Engineer',
    techStack: ['Next.js', 'Chakra UI', 'GraphQL'],
    challenge: 'Mengolah dan memvisualisasikan ribuan data laporan kesehatan dari berbagai puskesmas secara real-time ke dalam dashboard interaktif.',
    solution: 'Membangun dashboard dinamis dengan Recharts dan D3.js. Data diambil menggunakan GraphQL agar request payload sangat kecil, sehingga dashboard bisa dimuat dalam waktu kurang dari 1 detik.'
  },
  { 
    id: 'siskamling',
    slug: 'siskamling',
    name: 'Siskamling App', 
    src: '/img/Katalog- Proyek/siskamling.svg',
    client: 'Komunitas Warga',
    year: '2026',
    role: 'Mobile UI Developer',
    techStack: ['Flutter', 'Dart'],
    challenge: 'Membuat aplikasi ronda digital yang super simpel agar bisa dipahami seketika oleh bapak-bapak pos ronda yang mayoritas gaptek.',
    solution: 'Menghilangkan semua fitur kompleks. Hanya menyisakan 3 tombol utama berukuran raksasa: "Lapor Aman", "Ada Tamu", dan "Peringatan Darurat" (Tombol Panik).'
  }
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
