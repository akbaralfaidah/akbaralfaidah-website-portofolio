import { Trans, useTranslation } from 'react-i18next';
import { FadeUp } from './ui/MotionPrimitives';

export default function About() {
  const { t } = useTranslation();
  const facts = t('about.facts', { returnObjects: true }) || [];

  return (
    <section
      id="about"
      className="py-20 sm:py-24 px-5 sm:px-6 bg-paper text-ink border-b border-line"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Clean Edge-Less Editorial Portrait */}
        <FadeUp className="lg:col-span-5">
          <figure className="max-w-md mx-auto lg:max-w-none space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-mist border border-line group">
              <img
                src="/img/akbar-2.webp"
                alt="Akbar Alfaidah — Web, Mobile & AI Developer"
                width={640}
                height={800}
                decoding="async"
                className="w-full h-full object-cover object-[50%_10%] scale-[1.06] transition-transform duration-500 group-hover:scale-[1.08]"
              />
            </div>
            <figcaption className="flex items-center justify-between text-sm text-ink-muted">
              <span className="font-medium text-ink">Akbar Alfaidah</span>
              <span className="font-mono text-xs">Jambi, Indonesia</span>
            </figcaption>
          </figure>
        </FadeUp>

        {/* Open Typography Bio & Hairline 2x2 Index */}
        <div className="lg:col-span-7 space-y-7">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-ink">
              {t('about.heading')}
            </h2>
          </FadeUp>

          <FadeUp
            delay={0.06}
            className="space-y-4 text-base sm:text-lg text-ink-muted leading-relaxed"
          >
            <p>
              <Trans
                i18nKey="about.desc_1"
                components={[
                  <strong key="name" className="font-semibold text-ink" />,
                  <strong key="agency" className="font-semibold text-ink" />
                ]}
              />
            </p>
            <p>{t('about.desc_2')}</p>
            <p>{t('about.desc_3')}</p>
          </FadeUp>

          <dl className="grid grid-cols-1 sm:grid-cols-2 border-t border-line pt-6 gap-x-8 gap-y-6">
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div key={fact.label} className="border-t border-line pt-3 first:border-t-0 sm:first:border-t sm:pt-3">
                  <dt className="font-mono text-xs text-ink-muted mb-1">{fact.label}</dt>
                  <dd className="font-display text-base sm:text-lg font-semibold text-ink">
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
