import { useTranslation } from 'react-i18next';
import { Testimonials } from './ui/twitter-testimonial-cards';

export default function TestimonialsSection() {
  const { t } = useTranslation();

  // We fetch the cards from our translations (returns an array of objects)
  const cards = t('testimonials.cards', { returnObjects: true });

  // Add avatars to each card. 
  // We'll use DiceBear avatars generated via seed based on the username for consistency.
  const cardsWithAvatars = cards.map((card) => {
    // Generate a consistent pseudo-random avatar seed
    const seed = card.username.replace(/[^a-zA-Z]/g, '') || "fallback";
    return {
      ...card,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      verified: true, // all testimonials are verified clients
    };
  });

  return (
    <section id="testimonials" className="py-12 md:py-16 lg:py-20 px-6 relative z-10 bg-paper dark:bg-[#1A1A1C] text-charcoal dark:text-[#F2F0E8] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-4 md:mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-[#F2F0E8]/70 text-xs font-medium tracking-wider uppercase mb-6">
            <span>{t('testimonials.eyebrow')}</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-display font-extrabold leading-[1.1] tracking-tight mb-6">
            {t('testimonials.heading')}
          </h2>
          <p className="text-lg md:text-xl text-charcoal/70 dark:text-[#F2F0E8]/70 max-w-2xl font-light">
            {t('testimonials.subheading')}
          </p>
        </div>

        <div className="w-full flex items-center justify-center">
          <Testimonials cards={cardsWithAvatars} />
        </div>
      </div>
    </section>
  );
}
