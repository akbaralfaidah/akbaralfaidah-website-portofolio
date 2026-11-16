import { motion } from 'framer-motion';
import { STUDIO_EASE } from '../../lib/motion';

export function FadeUp({
  children,
  delay = 0,
  y = 18,
  duration = 0.52,
  className = '',
  as = 'div'
}) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration, delay, ease: STUDIO_EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerGroup({ children, className = '', delayChildren = 0.04, staggerChildren = 0.07 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren,
            staggerChildren
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', y = 16 }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.48, ease: STUDIO_EASE }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
