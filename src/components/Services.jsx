import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';

export default function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-16 md:py-24 px-6 relative z-10 bg-paper dark:bg-[#1A1A1C] overflow-hidden">
      
      {/* Decorative background grid for the whole section */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-display font-bold text-charcoal dark:text-[#F2F0E8] mb-6 relative inline-block"
          >
            <motion.span
              className="absolute inset-0 -inset-x-3 -inset-y-1 bg-brass/10 dark:bg-brass/15 rounded-xl -z-10"
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
            {t('services.heading')}
          </motion.h2>
          <p className="text-lg text-charcoal/70 dark:text-[#F2F0E8]/70 max-w-2xl mx-auto mt-4">
            {t('services.subheading')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:min-h-[640px]">
          
          {/* Left Column (Web & AI) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Web Development */}
            <motion.div
              className="flex-1 bg-white dark:bg-[#2A2C30] border border-black/5 dark:border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group min-h-[480px] md:min-h-[350px]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: {}
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(202,138,4,0.08)_0%,transparent_50%)] pointer-events-none" />
              
              {/* Decorative elements */}
              <div className="hidden md:block absolute top-8 right-8 text-brass/20 text-xl font-bold pointer-events-none">+</div>
              <div className="hidden md:block absolute bottom-8 left-1/2 text-brass/20 text-xl font-bold pointer-events-none">+</div>
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-brass/5 rounded-full blur-3xl pointer-events-none" />

              {/* Graphic: Browser Window */}
              <motion.div 
                className="absolute bottom-[-10%] md:top-1/2 right-[-5%] md:right-8 md:-translate-y-1/2 w-72 md:w-80 h-56 md:h-60 bg-paper/90 dark:bg-[#1A1A1C]/90 backdrop-blur-xl rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl transition-transform duration-700 md:group-hover:-translate-x-4 md:group-hover:-translate-y-2 md:group-hover:rotate-2 opacity-90 md:opacity-100 pointer-events-none flex flex-col z-0"
                variants={{
                  hidden: { opacity: 0, x: 50, rotate: -5 },
                  visible: { opacity: 0.9, x: 0, rotate: 0, transition: { duration: 0.8, delay: 0.3 } }
                }}
              >
                {/* Floating Widget Box */}
                <div className="absolute -left-12 top-10 w-24 h-16 bg-white dark:bg-[#2A2C30] rounded-xl shadow-lg border border-black/5 dark:border-white/5 p-3 flex flex-col gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-full h-2 bg-brass/20 rounded-full" />
                  <div className="w-2/3 h-2 bg-black/10 dark:bg-white/10 rounded-full" />
                </div>

                <div className="flex items-center gap-1.5 p-4 border-b border-black/5 dark:border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-400/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/90" />
                  <div className="w-3 h-3 rounded-full bg-green-400/90" />
                  <div className="ml-2 w-1/2 h-3 bg-black/5 dark:bg-white/5 rounded-full" />
                </div>
                <div className="p-5 space-y-4 flex-1">
                  <div className="w-1/3 h-4 bg-black/5 dark:bg-white/5 rounded-md" />
                  <div className="w-full h-20 bg-brass/10 dark:bg-brass/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brass/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                     <div className="w-12 h-12 rounded-full bg-brass/30 animate-pulse" />
                  </div>
                  <div className="w-2/3 h-4 bg-black/5 dark:bg-white/5 rounded-md" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="relative z-10 max-w-sm h-full flex flex-col justify-start md:justify-between pointer-events-none">
                <div className="pointer-events-auto">
                  <h3 className="text-3xl font-bold text-charcoal dark:text-[#F2F0E8] mb-4 drop-shadow-sm">
                    {t('services.web_dev_title')}
                  </h3>
                  <p className="text-charcoal/70 dark:text-[#F2F0E8]/70 leading-relaxed mb-8 text-justify hyphens-auto">
                    {t('services.web_dev_desc')}
                  </p>
                </div>
                <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-brass hover:text-white dark:hover:bg-brass dark:hover:text-white text-charcoal dark:text-white transition-all border border-black/5 dark:border-white/5 backdrop-blur-md w-fit pointer-events-auto mt-4 md:mt-0">
                  {t('projects.cta')} <FiArrowRight />
                </a>
              </div>
            </motion.div>

            {/* AI Development */}
            <motion.div
              className="flex-1 bg-white dark:bg-[#2A2C30] border border-black/5 dark:border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group min-h-[480px] md:min-h-[350px]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: {}
              }}
            >
              <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,rgba(202,138,4,0.08)_0%,transparent_50%)] pointer-events-none" />
              
              {/* Decorative elements */}
              <div className="hidden md:block absolute top-1/2 left-8 text-brass/20 text-xl font-bold pointer-events-none">+</div>
              <div className="hidden md:block absolute top-8 right-1/2 text-brass/20 text-xl font-bold pointer-events-none">+</div>

              {/* Graphic: Radar / Node Network */}
              <motion.div 
                className="absolute bottom-[-10%] md:-bottom-32 right-[-10%] md:-right-10 w-80 md:w-96 h-80 md:h-96 opacity-80 md:opacity-100 pointer-events-none transition-transform duration-1000 md:group-hover:scale-110 md:group-hover:-translate-x-4 z-0"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 0.8, scale: 1, transition: { duration: 0.8, delay: 0.4 } }
                }}
              >
                <div className="absolute inset-0 border border-brass/30 dark:border-brass/20 rounded-full scale-[0.2]" />
                <div className="absolute inset-0 border border-brass/20 dark:border-brass/20 rounded-full scale-[0.4]" />
                <div className="absolute inset-0 border border-brass/10 dark:border-brass/10 rounded-full scale-[0.6]" />
                <div className="absolute inset-0 border border-brass/5 dark:border-brass/5 rounded-full scale-[0.8]" />
                
                {/* Glowing Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-brass/30 blur-xl rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brass rounded-full shadow-[0_0_15px_rgba(202,138,4,0.8)]" />
                
                {/* Orbiting Nodes with paths */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] opacity-50" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" className="text-brass/20" strokeDasharray="2 4" />
                   <circle cx="70" cy="50" r="1.5" fill="#ca8a04" className="shadow-[0_0_10px_rgba(202,138,4,1)]" />
                </svg>

                <svg className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite_reverse] opacity-70" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" className="text-brass/20" strokeDasharray="2 6" />
                   <circle cx="50" cy="80" r="2" fill="#ca8a04" className="shadow-[0_0_10px_rgba(202,138,4,1)]" />
                </svg>

                <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite] opacity-30" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-brass/20" strokeDasharray="1 8" />
                   <circle cx="10" cy="50" r="1" fill="#ca8a04" className="shadow-[0_0_10px_rgba(202,138,4,1)]" />
                </svg>
              </motion.div>

              {/* Content */}
              <div className="relative z-10 max-w-sm h-full flex flex-col justify-start md:justify-between pointer-events-none">
                <div className="pointer-events-auto">
                  <h3 className="text-3xl font-bold text-charcoal dark:text-[#F2F0E8] mb-4 drop-shadow-sm">
                    {t('services.ai_dev_title')}
                  </h3>
                  <p className="text-charcoal/70 dark:text-[#F2F0E8]/70 leading-relaxed mb-8 text-justify hyphens-auto">
                    {t('services.ai_dev_desc')}
                  </p>
                </div>
                <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-brass hover:text-white dark:hover:bg-brass dark:hover:text-white text-charcoal dark:text-white transition-all border border-black/5 dark:border-white/5 backdrop-blur-md w-fit pointer-events-auto mt-4 md:mt-0">
                  {t('projects.cta')} <FiArrowRight />
                </a>
              </div>
            </motion.div>

          </div>

          {/* Right Column (Mobile) */}
          <div className="lg:col-span-1 flex">
            <motion.div
              className="flex-1 bg-white dark:bg-[#2A2C30] border border-black/5 dark:border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group min-h-[550px] lg:min-h-full flex flex-col"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: {}
              }}
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(202,138,4,0.08)_0%,transparent_50%)] pointer-events-none" />
              
              {/* Decorative elements */}
              <div className="hidden md:block absolute top-1/4 right-8 text-brass/20 text-xl font-bold pointer-events-none">+</div>
              <div className="hidden md:block absolute bottom-1/4 left-8 text-brass/20 text-xl font-bold pointer-events-none">+</div>
              
              {/* Graphic: Mobile Phone */}
              <motion.div 
                className="absolute bottom-[-10%] md:-bottom-16 left-1/2 -translate-x-1/2 w-60 md:w-64 h-[380px] md:h-[420px] bg-paper/90 dark:bg-[#151618]/90 backdrop-blur-xl rounded-[2.5rem] border-[6px] border-white dark:border-[#3A3C40] shadow-2xl transition-transform duration-700 md:group-hover:-translate-y-6 md:group-hover:rotate-2 opacity-90 md:opacity-100 pointer-events-none z-0"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 0.9, y: 0, transition: { duration: 0.8, delay: 0.5 } }
                }}
              >
                {/* Floating Notification */}
                <div className="absolute -right-8 top-20 w-24 h-12 bg-white dark:bg-[#2A2C30] rounded-xl shadow-lg border border-black/5 dark:border-white/5 p-2 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3.5s' }}>
                   <div className="w-6 h-6 rounded-full bg-brass/20" />
                   <div className="flex-1 space-y-1">
                      <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
                      <div className="w-2/3 h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
                   </div>
                </div>

                {/* Screen content */}
                <div className="w-full h-full bg-black/5 dark:bg-white/5 rounded-[2rem] relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-white dark:bg-[#3A3C40] rounded-b-2xl z-10" />
                  <div className="pt-10 px-4 space-y-4">
                    <div className="w-full h-28 bg-brass/10 dark:bg-brass/20 rounded-2xl relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-brass/20" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/2 h-20 bg-black/5 dark:bg-white/5 rounded-2xl" />
                      <div className="w-1/2 h-20 bg-black/5 dark:bg-white/5 rounded-2xl" />
                    </div>
                    <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-xl" />
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col pointer-events-none">
                <div className="pointer-events-auto">
                  <h3 className="text-3xl font-bold text-charcoal dark:text-[#F2F0E8] mb-4 drop-shadow-sm">
                    {t('services.mobile_dev_title')}
                  </h3>
                  <p className="text-charcoal/70 dark:text-[#F2F0E8]/70 leading-relaxed mb-8 text-justify hyphens-auto">
                    {t('services.mobile_dev_desc')}
                  </p>
                </div>
                <div className="pointer-events-auto">
                  <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-brass hover:text-white dark:hover:bg-brass dark:hover:text-white text-charcoal dark:text-white transition-all border border-black/5 dark:border-white/5 backdrop-blur-md w-fit mt-2">
                    {t('projects.cta')} <FiArrowRight />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
