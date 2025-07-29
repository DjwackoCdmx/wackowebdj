import { Button } from '@/components/ui/button';
import { History, LogOut, Music } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import djWackoMainLogo from '@/assets/img/dj_wacko_main_logo.jpg';

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
            <p className="text-xs text-purple-300">Panel de Control</p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:inline">{user.email}</span>
              <Button asChild variant="ghost" className="text-white hover:bg-purple-500/20">
                <a href="/history">
                  <History className="mr-2 h-4 w-4" /> Mi Historial
                </a>
              </Button>
              <Button onClick={onLogout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" /> Salir
              </Button>
              {isAdmin && (
                <Button asChild variant="outline">
                  <a href="/admin">
                    <Music className="mr-2 h-4 w-4" /> Panel de Admin
                  </a>
                </Button>
              )}
            </>
          ) : (
            <Button asChild variant="outline">
              <a href="/auth">Iniciar Sesión</a>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
