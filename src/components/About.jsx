import { Trans, useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  const facts = t('about.facts', { returnObjects: true }) || [];

  return (
    <section id="about" className="py-16 sm:py-24 px-6 bg-paper text-ink border-b border-line">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Portrait Frame */}
        <div className="lg:col-span-5">
          <div className="max-w-md mx-auto lg:max-w-none rounded-2xl bg-surface border border-line p-3 shadow-sm">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-mist">
              <img
                src="/img/akbar-2.webp"
                alt="Akbar Alfaidah — Principal Software Engineer"
                width={640}
                height={800}
                decoding="async"
                className="w-full h-full object-cover object-[50%_10%] scale-[1.06]"
              />
            </div>
            <div className="pt-3 px-1 flex items-center justify-between text-xs font-mono text-ink-muted">
              <span>Akbar Alfaidah</span>
              <span className="text-brass font-semibold">Jambi, Indonesia</span>
            </div>
          </div>
        </div>

        {/* Bio & Facts */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass mb-3">
              {t('about.eyebrow')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-ink">
              {t('about.heading')}
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-ink-muted leading-relaxed">
            <p>
              <Trans
                i18nKey="about.desc_1"
                components={[
                  <strong key="name" className="font-semibold text-ink" />,
                  <strong key="agency" className="font-semibold text-brass" />
                ]}
              />
            </p>
            <p>{t('about.desc_2')}</p>
            <p>{t('about.desc_3')}</p>
          </div>

          <dl className="grid grid-cols-2 gap-4 pt-4">
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl bg-surface border border-line px-4 py-3.5"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted mb-1">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-sm sm:text-base font-bold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
