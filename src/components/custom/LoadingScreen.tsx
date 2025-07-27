import { motion } from 'framer-motion';
import logoGif from '@/assets/dj-wacko-main-logo.gif';

const LoadingScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      <motion.img 
        src={logoGif}
        alt="DJ Wacko Logo"
        className="w-48 h-48 object-contain"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
      />
      <div className="mt-6 flex items-center space-x-2">
        <motion.span 
          className="sr-only"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Cargando...
        </motion.span>
        <motion.div 
          className="h-2 w-2 bg-purple-500 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.div 
          className="h-2 w-2 bg-pink-500 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        <motion.div 
          className="h-2 w-2 bg-purple-500 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
