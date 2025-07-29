import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full p-4 bg-black bg-opacity-30 text-center text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} DJ Wacko. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <a href="https://twitter.com/djwacko" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <a href="https://instagram.com/djwacko" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <a href="tel:+5215512345678" target="_blank" rel="noopener noreferrer">
              <Phone className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="/terms" className="hover:text-purple-400 transition-colors">Términos de Servicio</a>
          <a href="/privacy" className="hover:text-purple-400 transition-colors">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  );
};
