import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { History, LogOut, Music } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import djWackoMainLogo from '@/assets/dj-wacko-main-logo.gif';

interface HeaderProps {
  user: User | null;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Header = ({ user, isAdmin, onLogout }: HeaderProps) => {
  return (
    <header className="w-full p-4 bg-black bg-opacity-30 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={djWackoMainLogo} alt="DJ Wacko Logo" className="w-12 h-12 rounded-full object-cover border-2 border-primary/50" />
          <div>
            <h2 className="text-xl font-bold text-white tracking-wider">DJ Wacko</h2>
            <p className="text-sm text-gray-300">La Música Que Marca la Diferencia</p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:inline">{user.email}</span>
              <Button asChild variant="ghost" className="text-white hover:bg-purple-500/20">
                <Link to="/history">
                  <History className="mr-2 h-4 w-4" /> Mi Historial
                </Link>
              </Button>
              <Button onClick={onLogout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" /> Salir
              </Button>
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link to="/admin">
                    <Music className="mr-2 h-4 w-4" /> Panel de Admin
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="text-white border-purple-400/50 hover:bg-purple-500/20 hover:text-white">
                <Link to="/auth">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Link to="/auth?view=sign_up">Registrarse</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
