import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full p-4 bg-black bg-opacity-30 text-center text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} DJ Wacko. Todos los derechos reservados.</p>
        <div className="text-sm">
          <span className="font-semibold">Contacto:</span>
          <a href="mailto:djappsrepopupport@outlook.es" className="ml-2 hover:text-purple-400 transition-colors">
            djappsrepopupport@outlook.es
          </a>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="/terms" className="hover:text-purple-400 transition-colors">Términos de Servicio</a>
          <a href="/privacy" className="hover:text-purple-400 transition-colors">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  );
};
