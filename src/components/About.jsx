import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import { FadeUp } from './ui/MotionPrimitives';

export default function About() {
  const { t, i18n } = useTranslation();
  const facts = t('about.facts', { returnObjects: true }) || [];
  const isEn = i18n.language === 'en';

  const photoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ['start end', 'end start']
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  return (
    <section
      id="about"
      className="py-20 sm:py-28 px-5 sm:px-6 bg-paper text-ink border-b border-line"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Parallax Portrait Frame */}
        <FadeUp className="lg:col-span-5">
          <figure ref={photoRef} className="max-w-md mx-auto lg:max-w-none space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-mist border border-line">
              <motion.img
                style={{ y: photoY }}
                src="/img/akbar-2.webp"
                alt="Akbar Alfaidah — Web, Mobile & AI Developer"
                width={640}
                height={800}
                decoding="async"
                className="w-full h-full object-cover object-[50%_10%] scale-[1.1]"
              />
            </div>
            <figcaption className="flex items-center justify-between font-mono text-xs text-ink-muted">
              <span className="text-ink font-medium">Akbar Alfaidah</span>
              <span>Jambi, Indonesia</span>
            </figcaption>
          </figure>
        </FadeUp>

        {/* Bio & Hairline 2x2 Index */}
        <div className="lg:col-span-7 space-y-7">
          <FadeUp>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3">
              {isEn ? '03 / The Engineer' : '03 / Profil'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-ink">
              {isEn ? (
                <>
                  Digital Products{' '}
                  <span className="font-serif italic font-normal text-accent">Built with Care.</span>
                </>
              ) : (
                <>
                  Bikin Produk Digital yang{' '}
                  <span className="font-serif italic font-normal text-accent">Enak Dipakai.</span>
                </>
              )}
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
                <div
                  key={fact.label}
                  className="border-t border-line pt-3 first:border-t-0 sm:first:border-t sm:pt-3"
                >
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
