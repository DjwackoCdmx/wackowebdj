import { motion } from 'framer-motion';
import logo from '@/assets/dj-wacko-main-logo.gif';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img
        src={logo}
        alt="Loading..."
        className="w-48 h-48"
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
