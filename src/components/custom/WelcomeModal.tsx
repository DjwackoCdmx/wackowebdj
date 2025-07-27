import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Music, Gift, Rocket } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onAccept: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onAccept }) => {
  return (
    <Dialog open={open} onOpenChange={onAccept}>
      <DialogContent className="bg-black/80 backdrop-blur-sm border-purple-500/50 text-white sm:max-w-[480px] p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <DialogHeader className="p-6 text-center items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              ¡Bienvenido a la Experiencia Musical!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base mt-2">
              Esta es tu conexión directa para influir en el set. ¿Listo para ser el alma de la fiesta?
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-4 text-gray-200">
            <div className="flex items-start space-x-3">
              <Gift className="w-5 h-5 mt-1 text-purple-400 flex-shrink-0" />
              <p><span className="font-semibold">Solicita tu Canción:</span> Elige el tema que quieres escuchar y llena los detalles.</p>
            </div>
            <div className="flex items-start space-x-3">
              <Rocket className="w-5 h-5 mt-1 text-pink-500 flex-shrink-0" />
              <p><span className="font-semibold">Apoya con una Propina:</span> Tu contribución asegura que tu canción suene y me ayuda a seguir mezclando la mejor música para ti.</p>
            </div>
          </div>
          <div className="p-6 bg-black/30 rounded-b-lg">
            <Button 
              onClick={onAccept} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg h-12 hover:scale-105 transition-transform duration-300"
            >
              ¡Entendido, a rockear!
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
