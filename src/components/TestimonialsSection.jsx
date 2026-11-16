import { useTranslation } from 'react-i18next';
import { Quote, ShieldCheck } from 'lucide-react';

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const cards = t('testimonials.cards', { returnObjects: true }) || [];

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 px-6 bg-paper text-ink border-b border-line"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
            {t('testimonials.eyebrow')}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-3">
            {t('testimonials.heading')}
          </h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            {t('testimonials.subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(cards) &&
            cards.map((card) => (
              <figure
                key={`${card.projectName}-${card.date}`}
                className="rounded-2xl bg-surface border border-line p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="w-9 h-9 rounded-lg bg-mist border border-line flex items-center justify-center text-brass">
                      <Quote size={16} aria-hidden="true" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium px-2.5 py-1 rounded-md bg-mist text-ink border border-line">
                      <ShieldCheck size={13} className="text-brass" aria-hidden="true" />
                      <span>{t('testimonials.verified_label')}</span>
                    </span>
                  </div>

                  <blockquote className="text-sm sm:text-base text-ink leading-relaxed">
                    “{card.quote}”
                  </blockquote>
                </div>

                <figcaption className="pt-4 border-t border-line flex items-end justify-between gap-2">
                  <div>
                    <div className="font-display text-sm font-bold text-ink">
                      {card.clientRole}
                    </div>
                    <div className="font-mono text-xs text-brass mt-0.5">
                      {card.projectName}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-ink-muted shrink-0">
                    {card.date}
                  </span>
                </figcaption>
              </figure>
            ))}
        </div>
      </div>
    </section>
  );
}
