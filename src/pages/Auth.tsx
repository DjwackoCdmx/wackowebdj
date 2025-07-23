import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, UserPlus, LogIn, Music } from "lucide-react";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";

// Utilidad para obtener mensaje seguro de error
function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Error desconocido";
}

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "¡Registro exitoso!",
        description: "Por favor verifica tu email para completar el registro.",
      });
      
      setEmail("");
      setPassword("");
      setName("");
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error && typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string") {
        message = (error as { message: string }).message;
      }
      toast({
        title: "Error en el registro",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente.",
      });
      
      navigate("/");
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error && typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string") {
        message = (error as { message: string }).message;
      }
      toast({
        title: "Error al iniciar sesión",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para recuperar la contraseña.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Revisa tu email para las instrucciones de recuperación.",
      });
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error && typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string") {
        message = (error as { message: string }).message;
      }
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className={`w-full max-w-md relative z-10 auth-card-glass auth-card-animate ${shake ? 'shake' : ''}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={djWackoMainLogo} 
              alt="DJ Wacko Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Music className="w-6 h-6" />
            DJ Wacko
          </CardTitle>
          <CardDescription className="text-white/80">
            Únete a la comunidad musical más exclusiva
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(val) => setActiveTab(val as 'signin' | 'signup')} className="w-full auth-tabs auth-tabs-animate space-y-4">
            <TabsList>
              <TabsTrigger value="signin" className="data-[state=active]:bg-white/20">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white/20">
                <UserPlus className="w-4 h-4 mr-2" />
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="auth-tabs-animate space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="auth-btn-main w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="auth-btn-ghost w-full"
                  onClick={handleResetPassword}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="auth-tabs-animate space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-white">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="auth-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="auth-btn-main w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="auth-btn-ghost"
              onClick={() => navigate("/")}
            >
              <Music className="icon-spin mr-2" /> Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;