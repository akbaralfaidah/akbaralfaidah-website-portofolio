import { motion } from 'framer-motion';

export default function MeshGradient() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-paper transition-colors duration-500">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-brass/8 rounded-full mix-blend-multiply filter blur-3xl dark:mix-blend-screen dark:bg-brass/5"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 right-20 w-[30rem] h-[30rem] bg-charcoal/3 rounded-full mix-blend-multiply filter blur-3xl dark:mix-blend-screen dark:bg-paper/3"
      />
    </div>
  );
}
