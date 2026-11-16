import { motion } from 'framer-motion';
import { STUDIO_EASE } from '../../lib/motion';

export function FadeUp({
  children,
  delay = 0,
  y = 18,
  duration = 0.5,
  className = '',
  as = 'div'
}) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0.96, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration, delay, ease: STUDIO_EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerGroup({ children, className = '', delayChildren = 0.02, staggerChildren = 0.06 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.01 }}
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

export function StaggerItem({ children, className = '', y = 18 }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0.96, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: STUDIO_EASE }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
