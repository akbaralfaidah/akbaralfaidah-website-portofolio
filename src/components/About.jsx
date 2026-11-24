import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { FadeUp, ParallaxLayer, ParallaxWatermark } from './ui/MotionPrimitives';
import { useIsDesktop } from '../hooks/useIsDesktop';

export default function About() {
  const { t, i18n } = useTranslation();
  const facts = t('about.facts', { returnObjects: true }) || [];
  const isEn = i18n.language === 'en';
  const prefersReduced = useReducedMotion();
  const isDesktop = useIsDesktop(1024);

  const photoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ['start end', 'end start']
  });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 105, damping: 22, restDelta: 0.0005 });
  const photoY = useTransform(smoothScroll, [0, 1], [-96, 96]);

  return (
    <section
      id="about"
      className="relative py-14 sm:py-28 px-4 sm:px-6 bg-paper text-ink border-b border-line overflow-hidden"
    >
      <ParallaxWatermark text="ENGINEER" direction={-1} className="mb-4" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Multi-Depth Parallax Portrait Frame */}
        <FadeUp className="lg:col-span-5">
          <figure ref={photoRef} className="relative max-w-md mx-auto lg:max-w-none space-y-2.5 sm:space-y-3">
            {/* Background floating parallax architectural plate (desktop/tablet only) */}
            <ParallaxLayer
              yRange={[130, -130]}
              rotateRange={[-3, 3]}
              className="hidden sm:block pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-br from-sky-100/75 via-transparent to-emerald-100/65 dark:from-blue-500/10 dark:to-emerald-500/10 border border-accent/20 -z-10"
            />

            <div className="relative aspect-[4/4.2] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-mist border border-line shadow-[0_18px_45px_-16px_rgba(15,23,42,0.16)] sm:shadow-[0_24px_60px_-18px_rgba(37,99,235,0.18)]">
              <motion.img
                style={prefersReduced || !isDesktop ? undefined : { y: photoY }}
                src="/img/akbar-2.webp"
                alt="Akbar Alfaidah - Web, Mobile & AI Developer"
                width={640}
                height={800}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-[50%_15%] lg:scale-[1.28]"
              />

              {/* Mobile subtle bottom identity overlay inside portrait */}
              <div className="sm:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent pt-10 pb-3.5 px-4 flex items-end justify-between text-white">
                <div>
                  <p className="font-display text-sm font-semibold leading-tight">Akbar Alfaidah</p>
                  <p className="font-mono text-[11px] text-white/80 inline-flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-sky-300 shrink-0" aria-hidden="true" />
                    <span>Jambi, Indonesia</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 font-mono text-[10px] font-medium">
                  Web · Mobile · AI
                </span>
              </div>
            </div>

            {/* Opposing floating parallax glass chips */}
            <ParallaxLayer
              yRange={[115, -115]}
              xRange={[-16, 16]}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass-pill font-mono text-xs text-accent font-semibold absolute -left-5 top-10"
            >
              <span>Web · Mobile · AI</span>
            </ParallaxLayer>

            <ParallaxLayer
              yRange={[-95, 95]}
              xRange={[16, -16]}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass-pill font-mono text-xs text-ink absolute -right-4 bottom-14"
            >
              <MapPin size={14} className="text-accent shrink-0" aria-hidden="true" />
              <span>Jambi · 1.61° S</span>
            </ParallaxLayer>

            <figcaption className="hidden sm:flex items-center justify-between font-mono text-xs text-ink-muted pt-1">
              <span className="text-ink font-medium">Akbar Alfaidah</span>
              <span>Jambi, Indonesia</span>
            </figcaption>
          </figure>
        </FadeUp>

        {/* Bio & Hairline 2x2 Index gliding at distinct speed */}
        <ParallaxLayer yRange={[105, -105]} className="lg:col-span-7 space-y-5 sm:space-y-7">
          <FadeUp>
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-accent font-semibold mb-2 sm:mb-3">
              {isEn ? '03 / The Engineer' : '03 / Profil'}
            </p>
            <h2 className="font-display text-[1.75rem] sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-ink">
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
            className="space-y-3.5 sm:space-y-4 text-[15px] sm:text-lg text-ink-muted leading-relaxed"
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

          <dl className="grid grid-cols-2 border-t border-line pt-5 sm:pt-6 gap-3 sm:gap-5">
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <div
                  key={fact.label}
                  className="liquid-glass rounded-xl sm:rounded-2xl p-3.5 sm:p-5"
                >
                  <dt className="font-mono text-[11px] sm:text-xs text-ink-muted mb-1">{fact.label}</dt>
                  <dd className="font-display text-sm sm:text-lg font-semibold text-ink leading-snug">
                    {fact.value}
                  </dd>
                </div>
              ))}
          </dl>
        </ParallaxLayer>
      </div>
    </section>
  );
}
