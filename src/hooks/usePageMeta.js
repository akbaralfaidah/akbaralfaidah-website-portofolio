import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const BASE_URL = 'https://akbaralfaidah.com';

function upsertMeta(selector, attrName, attrVal, content) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

export function usePageMeta({ title, description, path = '/', robots = 'index,follow' } = {}) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';

  useEffect(() => {
    document.documentElement.lang = lang;

    if (title) {
      document.title = title;
      upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
      upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    }

    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description);
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    const canonicalUrl = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', lang === 'en' ? 'en_US' : 'id_ID');

    if (robots) {
      upsertMeta('meta[name="robots"]', 'name', 'robots', robots);
    }
  }, [lang, title, description, path, robots]);
}
