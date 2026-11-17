import { supabase } from '../lib/supabase';
import { fallbackProjects } from './fallbackProjects';

const SLUG_TO_BANNER = {
  bosdepot: '/img/banners/bosdepot.webp',
  'bos-depot': '/img/banners/bosdepot.webp',
  chattask: '/img/banners/chattask.webp',
  'chat-task': '/img/banners/chattask.webp',
  siabsen: '/img/banners/siabsen.webp',
  'si-absen': '/img/banners/siabsen.webp',
  mpp: '/img/banners/mpp.webp',
  'mpp-digital': '/img/banners/mpp.webp',
  jokipro: '/img/banners/jokipro.webp',
  'joki-pro': '/img/banners/jokipro.webp',
  peka: '/img/banners/peka.webp',
  siskamling: '/img/banners/siskamling.webp',
  simppk: '/img/banners/simppk.webp',
  'sim-ppk': '/img/banners/simppk.webp',
  caterly: '/img/banners/caterly.webp',
  'minum-vr9': '/img/banners/minumvr9.webp',
  minumvr9: '/img/banners/minumvr9.webp',
  vr9: '/img/banners/minumvr9.webp'
};

function resolveProjectBanner(slug, title, remoteUrl) {
  const s = String(slug || '').toLowerCase().trim();
  if (SLUG_TO_BANNER[s]) return SLUG_TO_BANNER[s];

  const t = String(title || '').toLowerCase();
  if (t.includes('bos') && t.includes('depot')) return '/img/banners/bosdepot.webp';
  if (t.includes('chattask') || t.includes('chat task')) return '/img/banners/chattask.webp';
  if (t.includes('siabsen') || t.includes('si absen')) return '/img/banners/siabsen.webp';
  if (t.includes('mpp') || t.includes('pelayanan')) return '/img/banners/mpp.webp';
  if (t.includes('joki')) return '/img/banners/jokipro.webp';
  if (t.includes('peka')) return '/img/banners/peka.webp';
  if (t.includes('siskamling')) return '/img/banners/siskamling.webp';
  if (t.includes('sim') && t.includes('ppk')) return '/img/banners/simppk.webp';
  if (t.includes('caterly')) return '/img/banners/caterly.webp';
  if (t.includes('vr9') || t.includes('minum')) return '/img/banners/minumvr9.webp';

  return remoteUrl || `/img/${s}.webp`;
}

const FALLBACK_BY_SLUG = new Map(fallbackProjects.map((p) => [p.slug, p]));

function cleanText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/\bdengna\b/gi, 'dengan')
    .trim();
}

function normalizeTitle(title, slug) {
  const clean = cleanText(title);
  if (!clean) return slug;
  if (clean === clean.toLowerCase()) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return clean;
}

function normalizeClient(client, fallback) {
  const raw = cleanText(client);
  if (!raw) return fallback?.client || 'Private Client';
  if (/\*{2,}/.test(raw)) {
    return fallback?.client || 'Confidential Client (NDA)';
  }
  return raw;
}

function normalizeUrl(url) {
  const raw = cleanText(url);
  if (!raw) return null;
  if (raw.includes('siabsen.univ.edu')) return null;
  return raw;
}

function normalizeTechStack(stack) {
  if (!Array.isArray(stack)) return [];
  return stack
    .map((item) => cleanText(item).replace(/\.+$/, ''))
    .filter(Boolean);
}

function mapSupabaseRow(row) {
  const slug = row.slug;
  const fallback = FALLBACK_BY_SLUG.get(slug);
  const resolvedImage = resolveProjectBanner(slug, row.judul, row.gambar_url);

  return {
    id: row.id || slug,
    slug,
    name: normalizeTitle(row.judul, slug),
    src: resolvedImage,
    client: normalizeClient(row.client, fallback),
    year: row.year || fallback?.year || '2026',
    role: cleanText(row.role) || fallback?.role || 'Full-Stack Developer',
    url: normalizeUrl(row.link_live || row.link_playstore) || fallback?.url || null,
    status: 'selesai',
    categories: Array.isArray(row.categories) && row.categories.length > 0
      ? row.categories
      : fallback?.categories || ['Website'],
    shortDescription: cleanText(row.short_description) || fallback?.shortDescription || '',
    shortDescriptionEn: fallback?.shortDescriptionEn || '',
    techStack: normalizeTechStack(row.tech_stack).length > 0
      ? normalizeTechStack(row.tech_stack)
      : fallback?.techStack || [],
    challenge: cleanText(row.deskripsi) || fallback?.challenge || '',
    challengeEn: fallback?.challengeEn || '',
    solution: cleanText(row.solution) || fallback?.solution || '',
    solutionEn: fallback?.solutionEn || '',
    highlights: fallback?.highlights || [],
    highlightsEn: fallback?.highlightsEn || [],
    is_hidden: Boolean(row.is_hidden)
  };
}

let cachedProjects = null;
let projectsFetchPromise = null;

/**
 * Fetch all published portfolio projects from Supabase with 3s timeout and local fallback.
 */
export async function fetchProjects() {
  if (cachedProjects) return cachedProjects;
  if (projectsFetchPromise) return projectsFetchPromise;

  projectsFetchPromise = (async () => {
    if (!supabase) {
      cachedProjects = fallbackProjects;
      return cachedProjects;
    }

    try {
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

      cachedProjects = data.map(mapSupabaseRow).filter((p) => !p.is_hidden);
      return cachedProjects;
    } catch (err) {
      console.warn('[projects] Using fallback data:', err?.message || 'Fetch error');
      cachedProjects = fallbackProjects;
      return cachedProjects;
    } finally {
      projectsFetchPromise = null;
    }
  })();

  return projectsFetchPromise;
}

/**
 * Fetch a single public project by slug.
 */
export async function fetchProjectBySlug(slug) {
  if (!slug) return null;

  if (cachedProjects) {
    const match = cachedProjects.find((p) => p.slug === slug);
    if (match) return match;
  }

  if (!supabase) {
    return FALLBACK_BY_SLUG.get(slug) || null;
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
    console.warn('[projects] Fallback lookup for slug:', slug, err?.message || '');
    return FALLBACK_BY_SLUG.get(slug) || null;
  }
}

export const heroProjects = [
  {
    name: 'BosDepot',
    slug: 'bosdepot',
    category: 'Mobile POS',
    summary: 'Flutter POS, Barcode Scanner & Offline SQLite',
    stack: ['Flutter', 'Firebase', 'GetX', 'SQLite'],
    client: 'Depot Kayu & Toko Bangunan Esa',
    src: '/img/banners/bosdepot.webp'
  },
  {
    name: 'ChatTask',
    slug: 'chattask',
    category: 'Web & NLP',
    summary: 'Next.js, Socket.io & WhatsApp NLP Parser',
    stack: ['Next.js', 'Socket.io', 'PostgreSQL', 'NLP'],
    client: 'Internal Product',
    src: '/img/banners/chattask.webp'
  },
  {
    name: 'PEKA',
    slug: 'peka',
    category: 'Web & AI',
    summary: 'React, Supabase & Gemini AI Reflection',
    stack: ['React', 'Supabase', 'Gemini API', 'Tailwind CSS'],
    client: 'Top 33 Indonesia Next',
    src: '/img/banners/peka.webp'
  },
  {
    name: 'MPP',
    slug: 'mpp',
    category: 'GovTech Web',
    summary: 'TypeScript Real-Time Survey Index Engine',
    stack: ['React', 'TypeScript', 'Material UI'],
    client: 'Instansi Pemerintah Daerah',
    src: '/img/banners/mpp.webp'
  },
  {
    name: 'SiAbsen',
    slug: 'siabsen',
    category: 'Mobile App',
    summary: 'Flutter 50m GPS Geofencing Attendance',
    stack: ['Flutter', 'Firebase', 'Geofencing'],
    client: 'Perguruan Tinggi Daerah',
    src: '/img/banners/siabsen.webp'
  }
];
