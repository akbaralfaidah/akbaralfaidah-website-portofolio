import { useTranslation } from 'react-i18next';
import { Quote, ShieldCheck } from 'lucide-react';
import { FadeUp, StaggerGroup, StaggerItem } from './ui/MotionPrimitives';
import SpotlightCard from './ui/SpotlightCard';

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const cards = t('testimonials.cards', { returnObjects: true }) || [];

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 px-6 bg-paper text-ink border-b border-line"
    >
      <div className="max-w-6xl mx-auto">
        <FadeUp className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08] text-ink mb-4">
            {t('testimonials.heading')}
          </h2>
          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
            {t('testimonials.subheading')}
          </p>
        </FadeUp>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(cards) &&
            cards.map((card) => (
              <StaggerItem key={`${card.projectName}-${card.date}`} className="flex">
                <SpotlightCard
                  as="figure"
                  className="w-full p-7 sm:p-8 flex flex-col justify-between gap-7"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <Quote size={18} aria-hidden="true" />
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-lg bg-mist text-ink border border-line">
                        <ShieldCheck size={15} className="text-accent" aria-hidden="true" />
                        <span>{t('testimonials.verified_label')}</span>
                      </span>
                    </div>

                    <blockquote className="text-base sm:text-lg text-ink leading-relaxed">
                      “{card.quote}”
                    </blockquote>
                  </div>

                  <figcaption className="pt-5 border-t border-line flex items-end justify-between gap-2">
                    <div>
                      <div className="font-display text-base font-bold text-ink">
                        {card.clientRole}
                      </div>
                      <div className="text-sm font-medium text-accent mt-0.5">
                        {card.projectName}
                      </div>
                    </div>
                    <span className="text-sm text-ink-muted shrink-0">
                      {card.date}
                    </span>
                  </figcaption>
                </SpotlightCard>
              </StaggerItem>
            ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
