import { motion } from 'framer-motion';

export default function MeshGradient() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-paper transition-colors duration-500">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-brass/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:mix-blend-screen dark:bg-brass/10"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 right-20 w-[30rem] h-[30rem] bg-charcoal/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:mix-blend-screen dark:bg-paper/5"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 20, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-20 left-1/3 w-[40rem] h-[40rem] bg-mist/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 dark:mix-blend-screen dark:bg-mist/10"
      />
    </div>
  );
}
