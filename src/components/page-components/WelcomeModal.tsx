import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Music, MicVocal, PartyPopper, Gift, X } from 'lucide-react';
import logo from '@/assets/dj-wacko-main-logo.gif';
import { motion, Variants } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-md w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-gray-900 text-white border-purple-500/20 shadow-lg rounded-2xl p-0 overflow-hidden"
        >
          <DialogHeader className="p-6">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="DJ Wacko Logo" className="h-12 w-12 rounded-full border-2 border-purple-500" />
                <DialogTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  ¡Bienvenido a la Experiencia!
                </DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-700">
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          </DialogHeader>
          
          <div className="px-6 pb-6 text-sm text-gray-300 space-y-4">
            <DialogDescription asChild>
              <div>
                <motion.p variants={itemVariants} className="mb-4">
                  ¡Prepárate para ser el alma de la fiesta! Sigue estos pasos:
                </motion.p>
                <motion.ul variants={itemVariants} className="space-y-3">
                  <li className="flex items-start"><Music className="h-5 w-5 mr-3 mt-1 text-purple-400 flex-shrink-0" /> <span><strong>Pide tu Canción:</strong> Usa el formulario para buscar tu tema y artista favorito.</span></li>
                  <li className="flex items-start"><MicVocal className="h-5 w-5 mr-3 mt-1 text-pink-400 flex-shrink-0" /> <span><strong>Dedícala (Opcional):</strong> Escribe tu nombre para que te mande un saludo al aire.</span></li>
                  <li className="flex items-start"><PartyPopper className="h-5 w-5 mr-3 mt-1 text-yellow-400 flex-shrink-0" /> <span><strong>¡Sube el Volumen!</strong> Tu canción sonará pronto. ¡A disfrutar!</span></li>
                </motion.ul>
                <motion.div variants={itemVariants} className="mt-6 p-3 bg-gray-800/50 rounded-lg flex items-center">
                   <Gift className="h-5 w-5 mr-3 text-green-400 flex-shrink-0" />
                   <span><strong>¿Te gusta mi trabajo?</strong> ¡Apóyame con una propina! El botón está en la esquina inferior derecha.</span>
                </motion.div>
              </div>
            </DialogDescription>
          </div>

          <DialogFooter className="p-6 bg-gray-800/50 rounded-b-2xl">
            <motion.div variants={itemVariants} className="w-full">
              <Button 
                onClick={onClose} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                ¡Entendido, vamos a la Fiesta!
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
