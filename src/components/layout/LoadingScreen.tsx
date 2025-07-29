import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/dj-wacko-main-logo.gif';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LoadingScreen = () => {
  return (
    <motion.div
      key="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.img
        src={logo}
        alt="Cargando..."
        className="w-56 h-56"
        variants={itemVariants}
      />
      <motion.p
        className="mt-4 text-xl font-semibold text-white tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
        variants={itemVariants}
      >
        Cargando la experiencia...
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
