import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function YouCanScroll() {
  const { t, i18n } = useTranslation();
  const items = t('scroll_section.items', { returnObjects: true });
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const stickyRef = useRef(null);

  useLayoutEffect(() => {
    if (!listRef.current || !containerRef.current || items.length === 0) return;

    const totalItems = items.length;
    const listItems = gsap.utils.toArray('.ycs-item', listRef.current);

    if (listItems.length < 2) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 25%',
        end: 'bottom 90%',
        scrub: 1,
        snap: {
          snapTo: "labelsDirectional",
          duration: 0.2,
          delay: 0,
          ease: "back.out(1.5)"
        }
      }
    });

    const containerHeight = listItems[0].offsetHeight;

    listItems.forEach((item, i) => {
      tl.addLabel(`word-${i}`, i);
      const bg = item.querySelector('.ycs-bg');

      // Step-by-step dynamic translation to support multi-line wrapping items!
      if (i > 0) {
        const offset = item.offsetTop + (item.offsetHeight / 2) - (containerHeight / 2);
        tl.to(listRef.current, { y: -offset, duration: 1, ease: 'none' }, i - 1);
      }

      if (i === 0) {
        gsap.set(item, { opacity: 1 });
        gsap.set(bg, { scaleX: 1 });
        tl.to(item, { opacity: 0.35, duration: 1 }, 0);
        tl.to(bg, { scaleX: 0, duration: 1 }, 0);
      } else {
        gsap.set(item, { opacity: 0.35 });
        gsap.set(bg, { scaleX: 0 });
        tl.to(item, { opacity: 1, duration: 1 }, i - 1);
        tl.to(bg, { scaleX: 1, duration: 1 }, i - 1);

        if (i !== totalItems - 1) {
          tl.to(item, { opacity: 0.35, duration: 1 }, i);
          tl.to(bg, { scaleX: 0, duration: 1 }, i);
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === containerRef.current) t.kill();
      });
    };
  }, [items, i18n.language]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#FAF8ED] h-[70vh] min-h-[400px] z-10"
    >

      {/* Native Sticky Container - Zero Jitter */}
      <div
        ref={stickyRef}
        className="sticky top-[15vh] h-[40vh] min-h-[200px] max-h-[300px] w-full flex flex-col justify-center items-center relative"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-center relative">

          {/* Side-by-side flex layout */}
          <div className="flex w-full items-start max-w-[1200px] mx-auto">

            {/* Left side fixed text */}
            <div className="w-[35%] flex justify-end pr-3 md:pr-6">
              <h2 className="text-[clamp(1.2rem,3.5vw,4rem)] font-display font-extrabold leading-none whitespace-nowrap m-0 p-0">
                {t('scroll_section.title_1')}
              </h2>
            </div>

            {/* Right side scrolling list */}
            <div className="w-[65%] relative h-[1em] m-0 p-0 text-[clamp(1.2rem,3.5vw,4rem)]">
              <ul
                ref={listRef}
                className="absolute top-0 left-0 md:left-2 flex flex-col items-start gap-6 md:gap-10 m-0 p-0 font-display font-extrabold leading-[1.1] md:leading-none whitespace-normal md:whitespace-nowrap w-full"
              >
                {items.map((text, i) => {
                  const colors = [
                    'rgba(158, 122, 60, 0.2)',  // Brass
                    'rgba(59, 130, 246, 0.15)', // Blue
                    'rgba(16, 185, 129, 0.15)', // Emerald
                    'rgba(245, 158, 11, 0.15)', // Amber
                    'rgba(139, 92, 246, 0.15)', // Violet
                  ];
                  const bgColor = colors[i % colors.length];

                  return (
                    <li
                      key={i}
                      className="ycs-item m-0 p-0 relative w-max"
                      style={{
                        color: 'inherit'
                      }}
                    >
                      <div
                        className="ycs-bg absolute -z-10 rounded-xl"
                        style={{
                          backgroundColor: bgColor,
                          top: '-15%', bottom: '-5%', left: '-15px', right: '-15px',
                          transformOrigin: 'left', transform: 'scaleX(0)'
                        }}
                      ></div>
                      {text}
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
