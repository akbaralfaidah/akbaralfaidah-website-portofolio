import { Trans, useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FadeUp, StaggerGroup, StaggerItem } from './ui/MotionPrimitives';
import { STUDIO_EASE } from '../lib/motion';
import SpotlightCard from './ui/SpotlightCard';

export default function About() {
  const { t } = useTranslation();
  const facts = t('about.facts', { returnObjects: true }) || [];

  return (
    <section id="about" className="py-20 sm:py-24 px-6 bg-paper text-ink border-b border-line">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Portrait Frame */}
        <FadeUp className="lg:col-span-5">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: STUDIO_EASE }}
            className="max-w-md mx-auto lg:max-w-none rounded-2xl bg-surface border border-line hover:border-accent/45 p-3.5 shadow-lg shadow-ink/[0.04] dark:shadow-black/30 transition-colors"
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-mist group">
              <img
                src="/img/akbar-2.webp"
                alt="Akbar Alfaidah — Principal Software Engineer"
                width={640}
                height={800}
                decoding="async"
                className="w-full h-full object-cover object-[50%_10%] scale-[1.06] transition-transform duration-500 group-hover:scale-[1.09]"
              />
            </div>
            <div className="pt-3.5 px-1 flex items-center justify-between text-sm text-ink-muted">
              <span className="font-semibold text-ink">Akbar Alfaidah</span>
              <span className="text-accent font-semibold">Jambi, Indonesia</span>
            </div>
          </motion.div>
        </FadeUp>

        {/* Bio & Credential Cards */}
        <div className="lg:col-span-7 space-y-6">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.1rem] font-bold tracking-tight leading-[1.08] text-ink">
              {t('about.heading')}
            </h2>
          </FadeUp>

          <FadeUp delay={0.08} className="space-y-4 text-lg sm:text-xl text-ink-muted leading-relaxed">
            <p>
              <Trans
                i18nKey="about.desc_1"
                components={[
                  <strong key="name" className="font-semibold text-ink" />,
                  <strong key="agency" className="font-semibold text-accent" />
                ]}
              />
            </p>
            <p>{t('about.desc_2')}</p>
            <p>{t('about.desc_3')}</p>
          </FadeUp>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <StaggerItem key={fact.label}>
                  <SpotlightCard className="p-5">
                    <dl>
                      <dt className="text-sm font-medium text-ink-muted mb-1">
                        {fact.label}
                      </dt>
                      <dd className="font-display text-lg sm:text-xl font-bold text-ink">
                        {fact.value}
                      </dd>
                    </dl>
                  </SpotlightCard>
                </StaggerItem>
              ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
