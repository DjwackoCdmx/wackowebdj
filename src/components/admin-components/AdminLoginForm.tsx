import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Music, RefreshCw } from 'lucide-react';

interface AdminLoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AdminLoginForm = ({ onLogin, onResetPassword, loading }: AdminLoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginForm.email, loginForm.password);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResetPassword(resetEmail);
  };

  if (showResetPassword) {
    return (
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center">
          <Music className="w-12 h-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription>Ingresa tu email para recibir instrucciones</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email de recuperación</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Ingresa tu email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="bg-background/50 border-primary/30"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" disabled={loading}>
              {loading ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
              ) : (
                'Enviar Email de Recuperación'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowResetPassword(false)} className="w-full">
              Volver al Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="text-center">
        <Music className="w-12 h-12 text-primary mx-auto mb-4" />
        <CardTitle className="text-2xl font-bold">🎧 DJ Admin Panel</CardTitle>
        <CardDescription>Acceso exclusivo para DJ Wacko</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu email de acceso"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="bg-background/50 border-primary/30"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="bg-background/50 border-primary/30"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" disabled={loading}>
            {loading ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Iniciando...</>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => setShowResetPassword(true)} className="text-primary">
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;
