import { supabase } from '../lib/supabase';

// ============================================
// Fallback data (digunakan jika Supabase gagal)
// ============================================

/**
 * Mapping dari nama kolom Supabase ke nama properti yang sudah digunakan di seluruh komponen React.
 * Ini memastikan kita tidak perlu mengubah satu pun komponen UI yang sudah ada.
 */
function mapSupabaseRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.judul,
    src: `/img/${row.slug}-opt.webp`,  // WebP optimized (hemat ~97% vs SVG)
    client: row.client,
    year: row.year,
    role: row.role,
    url: row.link_live || row.link_playstore || null,
    status: 'selesai',  // View sudah filter WHERE status = 'selesai'
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
    const { fallbackProjects } = await import('./fallbackProjects');
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
}

// ============================================
// Ekspor yang tetap kompatibel dengan kode lama
// (Untuk komponen yang masih import { projects })
// ============================================




export const heroProjects = [
  { name: 'BosDepot', src: '/img/bosdepot-opt.webp' },
  { name: 'ChatTask', src: '/img/chattask-opt.webp' },
  { name: 'SiAbsen', src: '/img/siabsen-opt.webp' },
  { name: 'MPP Digital', src: '/img/mpp-opt.webp' },
  { name: 'JokiPro', src: '/img/jokipro-opt.webp' },
  { name: 'PEKA', src: '/img/peka-opt.webp' },
  { name: 'Siskamling App', src: '/img/siskamling-opt.webp' },
  { name: 'SimPPK', src: '/img/simppk-opt.webp' }
];
