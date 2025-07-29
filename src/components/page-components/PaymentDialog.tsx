import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentUrl: string | null;
}

export const PaymentDialog = ({ isOpen, onClose, paymentUrl }: PaymentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-green-500">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400">¡Solicitud Recibida!</DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            Tu solicitud ha sido enviada. Para completarla, por favor realiza el pago a través del siguiente enlace.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          {paymentUrl ? (
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-600 hover:bg-green-700">Ir a Pagar</Button>
            </a>
          ) : (
            <p className="text-center text-yellow-400">Generando enlace de pago...</p>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center">
           <Badge variant="secondary">Serás redirigido a Stripe</Badge>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
