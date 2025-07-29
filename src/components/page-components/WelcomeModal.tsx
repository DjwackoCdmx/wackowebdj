import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-purple-500">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400">¡Bienvenido a la Plataforma de DJ Wacko!</DialogTitle>
          <DialogDescription asChild>
            <div className="text-gray-400 pt-2 text-left space-y-4">
              <p>
                Esta es la plataforma interactiva para solicitar canciones durante los sets en vivo.
              </p>
              <div>
                <h3 className="font-bold text-lg mb-2 text-purple-300">¿Cómo funciona?</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Rellena el formulario con tu canción favorita.</li>
                  <li>Apoya al artista con una propina (mínimo $2.00 USD) para enviar tu solicitud.</li>
                  <li>¡Disfruta de tu canción en el set!</li>
                </ol>
              </div>
              <p>
                Te recomendamos <strong>iniciar sesión</strong> para guardar tu historial y acceder a tus canciones favoritas rápidamente.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">¡Entendido!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
