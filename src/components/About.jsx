import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { FiCheckCircle, FiStar, FiLayers, FiCpu, FiUsers } from 'react-icons/fi';

// Floating animations
const floatAnimation1 = {
  y: [-8, 8, -8],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
};
const floatAnimation2 = {
  y: [6, -6, 6],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
};
const floatAnimation3 = {
  y: [-5, 5, -5],
  transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }
};
const floatAnimation4 = {
  y: [7, -7, 7],
  transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
};

export default function About() {
  const { t } = useTranslation();
  
  return (
    <section id="about" className="py-12 md:py-16 lg:py-20 px-6 relative z-10 dark:bg-[#1A1A1C]">

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">

        {/* Left Side: Photo with Floating Elements */}
        <motion.div className="w-full md:w-1/2 relative group mt-10 md:mt-0">
          <div className="absolute top-6 left-6 w-full h-full bg-charcoal dark:bg-[#2A2C30] rounded-2xl transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>

          {/* Main Image */}
          <img
            src="/img/akbar-4.jpg"
            alt="Akbar Alfaidah - Profile"
            className="relative z-10 w-full aspect-[4/5] object-cover rounded-2xl shadow-lg border-2 border-paper dark:border-charcoal"
          />

          {/* Floating Element 1: Verified (Top Left) */}
          <motion.div
            animate={floatAnimation1}
            className="absolute z-20 top-8 -left-4 md:-left-12 bg-white/95 dark:bg-[#2C2E32]/95 backdrop-blur-md px-5 py-3 rounded-full shadow-md flex items-center gap-3"
          >
            <div className="bg-blue-500 text-white rounded-full p-1 shadow-inner">
              <FiCheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-charcoal dark:text-[#F2F0E8] leading-tight tracking-tight">{t('about.trust_highly_trusted')}</p>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating Element 2: Full-Stack Dev (Bottom Right) */}
          <motion.div
            animate={floatAnimation2}
            className="absolute z-20 bottom-24 -right-4 md:-right-10 bg-white/95 dark:bg-[#2C2E32]/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-md flex items-center gap-3.5"
          >
            <div className="bg-indigo-500/10 text-indigo-500 p-2.5 rounded-xl">
              <FiLayers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-extrabold text-charcoal dark:text-[#F2F0E8] leading-tight">{t('about.trust_full_stack')}</p>
              <p className="text-[10px] text-charcoal/60 dark:text-[#F2F0E8]/60 font-medium tracking-wide mt-0.5">{t('about.trust_web_mobile')}</p>
            </div>
          </motion.div>

          {/* Floating Element 3: 10+ Client Card (Bottom Left) */}
          <motion.div
            animate={floatAnimation3}
            className="absolute z-20 -bottom-4 md:-bottom-8 left-2 md:left-8 bg-white/95 dark:bg-[#2C2E32]/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-md flex items-center gap-3.5"
          >
            <div className="bg-emerald-500/10 text-emerald-500 p-2.5 rounded-xl">
              <FiUsers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-extrabold text-charcoal dark:text-[#F2F0E8] leading-tight">{t('about.trust_clients')}</p>
              <p className="text-[10px] text-charcoal/60 dark:text-[#F2F0E8]/60 font-medium tracking-wide mt-0.5">⭐⭐⭐⭐⭐</p>
            </div>
          </motion.div>

          {/* Floating Element 4: AI Integrated (Top Right) */}
          <motion.div
            animate={floatAnimation4}
            className="absolute z-20 top-40 -right-6 md:-right-12 bg-white/95 dark:bg-[#2C2E32]/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-md flex items-center gap-3"
          >
            <div className="bg-amber-500/15 text-amber-600 dark:text-amber-400 p-1.5 rounded-full">
              <FiCpu className="w-4 h-4" />
            </div>
            <p className="text-[12px] font-extrabold text-charcoal dark:text-[#F2F0E8] pr-1">{t('about.trust_ai')}</p>
          </motion.div>
        </motion.div>
        
        <motion.div className="w-full md:w-1/2">
          {/* Heading with background reveal animation */}
          <motion.h2 
            className="text-4xl md:text-5xl font-display font-bold text-charcoal dark:text-[#F2F0E8] mb-8 relative inline-block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated background highlight */}
            <motion.span
              className="absolute inset-0 -inset-x-3 -inset-y-1 bg-brass/10 dark:bg-brass/15 rounded-xl -z-10"
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
            {t('about.heading')}
          </motion.h2>

          <div className="space-y-6 text-lg text-charcoal/80 dark:text-[#F2F0E8]/80 leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Trans 
                i18nKey="about.desc_1"
                components={[
                  <strong key="0" className="text-charcoal dark:text-[#F2F0E8] font-semibold" />,
                  <span key="1" className="text-brass font-medium" />
                ]}
              />
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              {t('about.desc_2')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('about.desc_3')}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
