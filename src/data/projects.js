import { supabase } from '../lib/supabase';

// ============================================
// Fallback data (digunakan jika Supabase gagal)
// ============================================
const fallbackProjects = [
  { 
    id: 'bosdepot', slug: 'bosdepot', name: 'BosDepot',
    src: '/img/Katalog- Proyek/bosdepot.svg',
    client: 'Depot Kayu & Toko Bangunan Esa', year: '2026', role: 'Mobile Developer',
    url: 'https://bosdepot.com', categories: ['Mobile Apps'],
    shortDescription: 'Aplikasi POS & Manajemen Gudang terintegrasi hardware (Scanner Barcode, Thermal Printer, Biometrik).',
    techStack: ['Flutter', 'Firebase', 'GetX', 'SQLite', 'FL Chart'],
    status: 'selesai',
    challenge: 'Membangun aplikasi terintegrasi untuk POS (Point of Sale) kasir, manajemen gudang, dan sistem operasional harian yang mampu menangani ribuan transaksi material bangunan tanpa lag.',
    solution: 'Merancang arsitektur UI yang intuitif agar karyawan toko bangunan yang mungkin kurang terbiasa dengan teknologi dapat dengan mudah memproses penjualan, mengecek stok gudang, dan memantau operasional toko dalam satu pintu.'
  },
  { 
    id: 'chattask', slug: 'chattask', name: 'ChatTask',
    src: '/img/Katalog- Proyek/chattask.svg',
    client: 'Personal Project', year: '2026', role: 'Fullstack Developer',
    url: 'https://chattask.app', categories: ['Website', 'Machine Learning'],
    shortDescription: 'Manajemen tugas cerdas untuk merapikan dan menjadwalkan instruksi dari chat WhatsApp menggunakan NLP.',
    techStack: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'NLP'],
    status: 'selesai',
    challenge: 'Banyak pekerja dan tim yang merasa kewalahan melacak tugas-tugas yang menumpuk di chat WhatsApp, sehingga banyak instruksi penting yang terlewat.',
    solution: 'Membangun platform manajemen tugas cerdas yang dirancang khusus untuk merapikan, mencatat, dan menjadwalkan (*schedule*) setiap tugas yang masuk melalui pesan WA agar pengguna dapat bekerja jauh lebih terstruktur.'
  },
  { 
    id: 'jokipro', slug: 'jokipro', name: 'JokiPro',
    src: '/img/Katalog- Proyek/jokipro.svg',
    client: 'Confidential Company', year: '2026', role: 'UI/UX Designer & Frontend',
    url: 'https://jokipro.com', categories: ['Website'],
    shortDescription: 'Landing page profil perusahaan modern dan interaktif dengan identitas anonim (Incognito).',
    techStack: ['Vue.js', 'SCSS', 'GSAP'],
    status: 'selesai',
    challenge: 'Merancang landing page profil perusahaan (Company Profile) yang profesional dan modern, namun dengan syarat menjaga kerahasiaan identitas asli klien (*Non-Disclosure Agreement*).',
    solution: 'Membuat halaman interaktif menggunakan animasi GSAP dan desain visual yang kuat. Identitas klien sengaja disamarkan menjadi "JokiPro" (Incognito) untuk mematuhi kesepakatan kerahasiaan pada portofolio ini.'
  },
  { 
    id: 'mpp', slug: 'mpp', name: 'MPP Digital',
    src: '/img/Katalog- Proyek/mpp.svg',
    client: 'M****a (Pemerintahan)', year: '2026', role: 'Frontend Architect',
    categories: ['Website'],
    shortDescription: 'Digitalisasi survei penilaian Mal Pelayanan Publik (MPP) untuk mengotomatiskan rekapitulasi data masyarakat.',
    techStack: ['React', 'Material UI', 'TypeScript'],
    status: 'selesai',
    challenge: 'Sistem evaluasi Mal Pelayanan Publik (MPP) suatu daerah sebelumnya menggunakan metode survei kertas dan perhitungan manual yang sangat memakan waktu dan rentan *human error*.',
    solution: 'Mendigitalisasi seluruh proses survei penilaian ke dalam bentuk aplikasi web terintegrasi. Hal ini mengotomatiskan rekapitulasi data dan perhitungan skor kepuasan masyarakat secara real-time.'
  },
  { 
    id: 'peka', slug: 'peka', name: 'PEKA',
    src: '/img/Katalog- Proyek/peka.svg',
    client: 'Top 33 Indonesia Next', year: '2026', role: 'Fullstack Developer',
    categories: ['Website', 'Machine Learning'],
    shortDescription: 'Platform cerdas dengan integrasi AI (Gemini API) untuk export gambar dan manajemen data dinamis terkait mood.',
    techStack: ['React', 'Supabase', 'Gemini API', 'Tailwind', 'Framer Motion'],
    status: 'selesai',
    challenge: 'Banyak individu merasa kesepian dan kesulitan melacak kondisi mental mereka sehari-hari. Dibutuhkan sebuah wadah aman untuk mencurahkan isi hati dan mendapatkan validasi emosional.',
    solution: 'PEKA lahir sebagai platform web *mood tracker* interaktif. Pengguna dapat menceritakan kondisi hati mereka, melacak jejak emosional (*tracking mood*), serta mendapatkan *feedback* dan validasi afirmatif agar mereka tidak pernah merasa sendirian.'
  },
  { 
    id: 'siabsen', slug: 'siabsen', name: 'SiAbsen',
    src: '/img/Katalog- Proyek/siabsen.svg',
    client: 'M****n (Universitas)', year: '2026', role: 'Mobile Developer',
    url: 'https://siabsen.univ.edu', categories: ['Mobile Apps'],
    shortDescription: 'Sistem absensi mahasiswa berbasis Geofencing untuk mencegah kecurangan presensi kelas.',
    techStack: ['Flutter', 'Firebase', 'Geofencing'],
    status: 'selesai',
    challenge: 'Proses absensi mahasiswa di mata kuliah rawan kecurangan (titip absen) jika hanya menggunakan metode konvensional.',
    solution: 'Mengimplementasikan teknologi Geofencing (Radius Lokasi) yang membatasi akses presensi. Mahasiswa mutlak tidak bisa melakukan absen jika mereka berada di luar radius 50 meter dari titik koordinat lokasi kelas yang ditetapkan.'
  },
  { 
    id: 'simppk', slug: 'simppk', name: 'SimPPK',
    src: '/img/Katalog- Proyek/simppk.svg',
    client: 'A****d (Pemerintahan)', year: '2026', role: 'Frontend Engineer',
    categories: ['Website'],
    shortDescription: 'Sistem Informasi Pemerintahan untuk manajemen dan rekapitulasi data pegawai PPPK.',
    techStack: ['Next.js', 'Chakra UI', 'GraphQL'],
    status: 'selesai',
    challenge: 'Membutuhkan platform yang terstruktur, aman, dan dapat diandalkan untuk menampung dan mengelola data kepegawaian pemerintahan yang berskala besar.',
    solution: 'Membangun Sistem Informasi Pemerintahan PPPK (Pegawai Pemerintah dengan Perjanjian Kerja) menggunakan arsitektur web modern yang menjamin kecepatan akses, keamanan data, dan kemudahan rekapitulasi administrasi.'
  },
  { 
    id: 'siskamling', slug: 'siskamling', name: 'Siskamling App',
    src: '/img/Katalog- Proyek/siskamling.svg',
    client: 'G*****n', year: '2026', role: 'Web Developer',
    categories: ['Website'],
    shortDescription: 'Aplikasi pengelolaan jadwal ronda dan presensi kehadiran warga berbasis Geofencing pos keamanan.',
    techStack: ['React', 'Geolocation API', 'Node.js'],
    status: 'selesai',
    challenge: 'Membuat jadwal pos ronda dan memantau kehadiran warga seringkali berantakan jika hanya menggunakan grup WhatsApp atau papan tulis manual.',
    solution: 'Mengembangkan aplikasi web khusus Siskamling yang mengatur pembagian jadwal secara otomatis dan menggunakan teknologi Geofencing untuk fitur absen ronda, memastikan warga benar-benar hadir di lokasi pos keamanan.'
  }
];

/**
 * Mapping dari nama kolom Supabase ke nama properti yang sudah digunakan di seluruh komponen React.
 * Ini memastikan kita tidak perlu mengubah satu pun komponen UI yang sudah ada.
 */
function mapSupabaseRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.judul,
    src: row.gambar_url,
    client: row.client,
    year: row.year,
    role: row.role,
    url: row.link_live || row.link_playstore || null,
    status: row.status,
    categories: row.categories || [],
    shortDescription: row.short_description,
    techStack: row.tech_stack || [],
    challenge: row.deskripsi,
    solution: row.solution,
    is_hidden: row.is_hidden || false,
  };
}

let cachedProjects = null;
let projectsFetchPromise = null;

/**
 * Fetch semua proyek dari Supabase.
 * Ditambah cache & timeout 3 detik. Jika Supabase cold start / lambat, 
 * langsung kembalikan fallback agar user tidak menunggu loading lama.
 */
export async function fetchProjects() {
  if (cachedProjects) return cachedProjects;
  if (projectsFetchPromise) return projectsFetchPromise;

  projectsFetchPromise = (async () => {
    try {
      // Supabase free tier bisa memakan waktu 10-15 detik untuk cold start.
      // Kita batasi maksimal 3 detik agar UI tidak stuck di skeleton loader.
      const fetchReq = supabase
        .from('public_projects_view')
        .select('*')
        .order('created_at', { ascending: true });
        
      const timeoutReq = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase request timeout')), 3000)
      );

      const { data, error } = await Promise.race([fetchReq, timeoutReq]);

      if (error) throw error;
      if (!data || data.length === 0) {
        cachedProjects = fallbackProjects;
        return cachedProjects;
      }

      cachedProjects = data.map(mapSupabaseRow).filter(p => !p.is_hidden);
      return cachedProjects;
    } catch (err) {
      console.warn('[projects] Supabase fetch failed/timeout, using fallback:', err.message);
      // Simpan di cache agar navigasi selanjutnya instan
      cachedProjects = fallbackProjects;
      return cachedProjects;
    }
  })();

  return projectsFetchPromise;
}

/**
 * Fetch satu proyek berdasarkan slug.
 */
export async function fetchProjectBySlug(slug) {
  // Gunakan cache jika data sudah di-fetch di halaman sebelumnya
  if (cachedProjects) {
    return cachedProjects.find((p) => p.slug === slug) || null;
  }

  try {
    const fetchReq = supabase
      .from('public_projects_view')
      .select('*')
      .eq('slug', slug)
      .single();

    const timeoutReq = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase request timeout')), 3000)
    );

    const { data, error } = await Promise.race([fetchReq, timeoutReq]);

    if (error) throw error;
    return mapSupabaseRow(data);
  } catch (err) {
    console.warn('[projects] Supabase fetch by slug failed, using fallback:', err.message);
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
}

// ============================================
// Ekspor yang tetap kompatibel dengan kode lama
// (Untuk komponen yang masih import { projects })
// ============================================
export const projects = fallbackProjects;

export function getProjectBySlug(slug) {
  return fallbackProjects.find((p) => p.slug === slug);
}
