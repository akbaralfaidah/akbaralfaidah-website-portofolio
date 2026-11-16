import { supabase } from '../lib/supabase';
import { fallbackProjects } from './fallbackProjects';

const LOCAL_WEBP_SLUGS = new Set([
  'bosdepot',
  'chattask',
  'siabsen',
  'mpp',
  'jokipro',
  'peka',
  'siskamling',
  'simppk'
]);

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
  const hasRemoteSvg =
    typeof row.gambar_url === 'string' && /\.svg(\?|$)/i.test(row.gambar_url);
  const resolvedImage =
    !row.gambar_url || (hasRemoteSvg && LOCAL_WEBP_SLUGS.has(slug))
      ? LOCAL_WEBP_SLUGS.has(slug)
        ? `/img/${slug}.webp`
        : row.gambar_url
      : row.gambar_url;

  return {
    id: row.id || slug,
    slug,
    name: normalizeTitle(row.judul, slug),
    src: resolvedImage || `/img/${slug}.webp`,
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
    src: '/img/bosdepot.webp'
  },
  {
    name: 'ChatTask',
    slug: 'chattask',
    category: 'Web & NLP',
    summary: 'Next.js, Socket.io & WhatsApp NLP Parser',
    src: '/img/chattask.webp'
  },
  {
    name: 'PEKA',
    slug: 'peka',
    category: 'Web & AI',
    summary: 'React, Supabase & Gemini AI Reflection',
    src: '/img/peka.webp'
  },
  {
    name: 'MPP',
    slug: 'mpp',
    category: 'GovTech Web',
    summary: 'TypeScript Real-Time Survey Index Engine',
    src: '/img/mpp.webp'
  },
  {
    name: 'SiAbsen',
    slug: 'siabsen',
    category: 'Mobile App',
    summary: 'Flutter 50m GPS Geofencing Attendance',
    src: '/img/siabsen.webp'
  }
];
