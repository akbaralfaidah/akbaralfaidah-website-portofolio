import { useTranslation } from 'react-i18next';
import { Globe, Smartphone, Sparkles, Check, ArrowRight } from 'lucide-react';
import { FadeUp, StaggerGroup, StaggerItem } from './ui/MotionPrimitives';
import SpotlightCard from './ui/SpotlightCard';

const SERVICE_ICONS = {
  web: Globe,
  mobile: Smartphone,
  ai: Sparkles
};

export default function Services() {
  const { t } = useTranslation();
  const items = t('services.items', { returnObjects: true }) || [];

  return (
    <section id="services" className="relative py-20 sm:py-24 px-6 bg-paper text-ink border-b border-line overflow-hidden">
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeUp className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08] text-ink mb-4">
            {t('services.heading')}
          </h2>
          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
            {t('services.subheading')}
          </p>
        </FadeUp>

        <StaggerGroup className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.isArray(items) &&
            items.map((service) => {
              const Icon = SERVICE_ICONS[service.id] || Globe;
              return (
                <StaggerItem key={service.id} className="flex">
                  <SpotlightCard tilt className="w-full p-7 sm:p-8">
                    <div className="h-full flex flex-col justify-between gap-7">
                      <div>
                      <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                          <Icon size={22} aria-hidden="true" />
                        </div>
                        <span className="font-mono text-sm font-medium px-3.5 py-1.5 rounded-lg bg-mist text-ink border border-line">
                          {service.timeline}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-bold text-ink tracking-tight mb-3">
                        {service.title}
                      </h3>

                      <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed mb-6">
                        {service.desc}
                      </p>

                      <div className="pt-5 border-t border-line">
                        <p className="text-sm font-semibold text-ink mb-3">
                          {t('services.deliverables_label')}
                        </p>
                        <ul className="space-y-3">
                          {Array.isArray(service.deliverables) &&
                            service.deliverables.map((line) => (
                              <li key={line} className="flex items-start gap-2.5 text-base text-ink">
                                <Check
                                  size={17}
                                  className="text-accent shrink-0 mt-1"
                                  aria-hidden="true"
                                />
                                <span>{line}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-line">
                      <a
                        href="#contact"
                        className="group w-full min-h-[48px] px-5 py-3 rounded-xl bg-accent-solid text-on-accent hover:bg-accent-hover shadow-sm shadow-accent/15 text-[15px] font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <span>{t('services.book_cta')}</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
        </StaggerGroup>
      </div>
    </section>
  );
}
