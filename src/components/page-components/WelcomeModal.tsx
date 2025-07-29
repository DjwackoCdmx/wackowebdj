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
          <DialogTitle className="text-2xl font-bold text-purple-400">¡Bienvenido a la Experiencia Musical!</DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            Aquí puedes solicitar tus canciones favoritas y ser parte del show. Todas las solicitudes se procesan a través de una pequeña propina para el DJ.
            <br /><br />
            <strong>¡Disfruta de la música!</strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">¡Entendido!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
