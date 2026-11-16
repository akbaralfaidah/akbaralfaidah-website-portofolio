import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Smartphone, Sparkles, Check, ArrowUpRight, ArrowRight } from 'lucide-react';

const SERVICE_ICONS = {
  web: Globe,
  mobile: Smartphone,
  ai: Sparkles
};

export default function Services() {
  const { t } = useTranslation();
  const items = t('services.items', { returnObjects: true }) || [];

  return (
    <section id="services" className="py-16 sm:py-24 px-6 bg-paper text-ink border-b border-line">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
            {t('services.eyebrow')}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4">
            {t('services.heading')}
          </h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            {t('services.subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.isArray(items) &&
            items.map((service) => {
              const Icon = SERVICE_ICONS[service.id] || Globe;
              return (
                <article
                  key={service.id}
                  className="rounded-2xl bg-surface border border-line p-6 sm:p-7 flex flex-col justify-between gap-6 hover:border-brass/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="w-11 h-11 rounded-xl bg-mist border border-line flex items-center justify-center text-brass shrink-0">
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <span className="font-mono text-xs font-medium px-3 py-1 rounded-md bg-mist text-ink border border-line">
                        {service.timeline}
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-3">
                      {service.title}
                    </h3>

                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed mb-6">
                      {service.desc}
                    </p>

                    <div className="pt-4 border-t border-line">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted mb-3">
                        {t('services.deliverables_label')}
                      </p>
                      <ul className="space-y-2.5">
                        {Array.isArray(service.deliverables) &&
                          service.deliverables.map((line) => (
                            <li key={line} className="flex items-start gap-2.5 text-sm text-ink">
                              <Check
                                size={15}
                                className="text-brass shrink-0 mt-1"
                                aria-hidden="true"
                              />
                              <span>{line}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                    <Link
                      to={`/project/${service.projectSlug}`}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-muted hover:text-brass transition-colors"
                    >
                      <span>{service.projectName}</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>

                    <a
                      href="#contact"
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-ink text-on-ink hover:bg-ink/90 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t('services.book_cta')}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
