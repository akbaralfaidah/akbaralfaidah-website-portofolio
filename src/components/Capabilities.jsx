import { useTranslation } from 'react-i18next';
import TechLogoMarquee from './ui/TechLogoMarquee';

export default function Capabilities() {
  const { t } = useTranslation();
  const pillars = t('capabilities.pillars', { returnObjects: true }) || [];

  return (
    <section className="py-16 sm:py-24 px-6 bg-paper text-ink border-b border-line">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
            {t('capabilities.eyebrow')}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-ink mb-4">
            {t('capabilities.heading')}
          </h2>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            {t('capabilities.subtitle')}
          </p>
        </div>

        {/* 4-Step Engineering Index Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {Array.isArray(pillars) &&
            pillars.map((item) => (
              <div
                key={item.step}
                className="rounded-xl bg-surface border border-line p-6 flex flex-col justify-between gap-4 hover:border-brass/60 transition-colors"
              >
                <div>
                  <span className="inline-block font-mono text-xs font-bold tracking-widest text-brass mb-4">
                    {item.step}
                  </span>
                  <h3 className="font-display text-lg font-bold text-ink leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Daily Stack Marquee */}
        <div className="pt-8 border-t border-line">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted mb-4">
            {t('capabilities.stack_eyebrow')}
          </p>
          <TechLogoMarquee />
        </div>
      </div>
    </section>
  );
}
