import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Music, MicVocal, History, PartyPopper, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-purple-500/20 shadow-lg max-w-md w-full mx-auto rounded-2xl p-0">
        <DialogHeader className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/images/djwacko-logo.png" alt="DJ Wacko Logo" className="h-12 w-12 rounded-full border-2 border-purple-500" />
              <DialogTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                ¡Bienvenido a la Experiencia DJ Wacko!
              </DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-700">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 text-sm text-gray-300 space-y-4">
          <DialogDescription asChild>
            <div>
              <p className="mb-4">
                Estás a punto de formar parte de la fiesta. Aquí tienes un resumen de lo que puedes hacer:
              </p>
              <ul className="space-y-3 list-inside">
                <li className="flex items-center"><Music className="h-5 w-5 mr-3 text-purple-400" /> Solicita tus canciones favoritas en tiempo real.</li>
                <li className="flex items-center"><MicVocal className="h-5 w-5 mr-3 text-pink-400" /> Envía dedicatorias y mensajes especiales.</li>
                <li className="flex items-center"><History className="h-5 w-5 mr-3 text-blue-400" /> Consulta el historial de canciones y tus solicitudes.</li>
                <li className="flex items-center"><PartyPopper className="h-5 w-5 mr-3 text-yellow-400" /> ¡Prepárate para una noche inolvidable!</li>
              </ul>
            </div>
          </DialogDescription>
        </div>

        <DialogFooter className="p-6 bg-gray-800/50 rounded-b-2xl">
          <Button 
            onClick={onClose} 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            ¡Vamos a la Fiesta!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
