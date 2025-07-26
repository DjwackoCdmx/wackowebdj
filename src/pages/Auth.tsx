import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
// Eliminado duplicado de import User
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Music, User as UserIcon, Mail, Phone, UserPlus, Shield, Trash2, AlertTriangle } from "lucide-react";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";
import djWackoLogoText from "@/assets/dj-wacko-logo-text.png";
import djHeroBg from "@/assets/dj-hero-bg.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
        if (!showDeleteAccount) {
          navigate("/");
        }
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session && !showDeleteAccount) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showDeleteAccount]);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Mínimo 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Al menos una letra mayúscula");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Al menos un número");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Al menos un carácter especial");
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  // --- FUNCIONES PRINCIPALES LIMPIAS ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignorar error de signOut
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        toast({
          title: "¡Bienvenido de vuelta!",
          description: "Has iniciado sesión correctamente.",
        });
        window.location.href = '/';
      }
    } catch (error) {
      let errMsg = "Error desconocido";
      if (error instanceof Error) errMsg = error.message;
      toast({
        title: "Error al iniciar sesión",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast({
        title: "Términos requeridos",
        description: "Debes aceptar los términos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }
    if (!validatePassword(password)) {
      toast({
        title: "Contraseña no válida",
        description: "La contraseña no cumple con los requisitos de seguridad.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            phone,
            nickname,
          },
        },
      });
      if (error) throw error;
      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu email para confirmar tu cuenta.",
      });
      setIsLogin(true);
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setAcceptTerms(false);
      setPasswordErrors([]);
    } catch (error) {
      let errMsg = "Error desconocido";
      if (error instanceof Error) errMsg = error.message;
      toast({
        title: "Error en el registro",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "Debes estar autenticado para eliminar tu cuenta.",
          variant: "destructive",
        });
        return;
      }
      await (supabase as any).from('user_saved_songs').delete().eq('user_id', session.user.id);
      await supabase.from('user_profiles').delete().eq('user_id', session.user.id);
      await supabase.auth.signOut({ scope: 'global' });
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta y todos tus datos han sido eliminados permanentemente.",
      });
      window.location.href = "/";
    } catch (error) {
      let errMsg = "Error desconocido";
      if (error instanceof Error) errMsg = error.message;
      toast({
        title: "Error al eliminar cuenta",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteAccount(false);
    }
  };

  // If user wants to delete account, show delete interface even if logged in
  if (showDeleteAccount && currentUser) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 relative"
        style={{
          backgroundImage: `url(${djHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="backdrop-blur-sm bg-card/90 max-w-md w-full animate-scale-in">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Confirmar eliminación de cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90">
                ⚠️ <strong>Advertencia:</strong> Al eliminar tu cuenta se perderán todos tus datos, 
                historial de canciones, favoritos y tendrás que hacer un nuevo registro.
              </p>
              <p className="text-white/90">
                Esta acción es <strong>irreversible</strong>. ¿Estás seguro?
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowDeleteAccount(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {loading ? "Eliminando..." : "Eliminar cuenta"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 relative"
      style={{
        backgroundImage: `url(${djHeroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <img 
              src={djWackoMainLogo} 
              alt="DJ Wacko Logo" 
              className="w-20 h-20 mx-auto hover:scale-110 transition-transform duration-300"
            />
            <img 
              src={djWackoLogoText} 
              alt="DJ Wacko" 
              className="h-12 mx-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "¡Bienvenido de vuelta!" : "Únete a la experiencia"}
              </h1>
              <p className="text-white/80">
                {isLogin ? "Inicia sesión para continuar" : "Crea tu cuenta y personaliza tus solicitudes"}
              </p>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="backdrop-blur-sm bg-card/90 animate-scale-in">
            <CardContent className="p-6">
              <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        <UserIcon className="w-4 h-4 inline mr-1" />
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nickname" className="text-white">
                        <Music className="w-4 h-4 inline mr-1" />
                        Apodo
                      </Label>
                      <Input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Tu apodo"
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Teléfono (para notificaciones)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (!isLogin) validatePassword(e.target.value);
                      }}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pr-10"
                      placeholder="Tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {!isLogin && passwordErrors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 font-medium text-sm mb-2">Requisitos de contraseña:</p>
                      {passwordErrors.map((error, index) => (
                        <p key={index} className="text-red-300 text-xs">• {error}</p>
                      ))}
                    </div>
                  )}
                  
                  {!isLogin && (
                    <p className="text-white/60 text-xs">
                      Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <div className="flex items-start space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                      className="border-white/20 data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-white/90 leading-relaxed">
                      Acepto los{" "}
                      <Link to="/terms" className="text-primary hover:underline font-medium">
                        términos de uso y condiciones
                      </Link>
                      {" "}incluyendo que no se almacenan datos sensibles fuera del uso del servicio.
                    </label>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || (!isLogin && (!acceptTerms || passwordErrors.length > 0))}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all text-white font-bold py-3 disabled:opacity-50"
                >
                  {loading ? (
                    "Cargando..."
                  ) : (
                    <>
                      {isLogin ? <Music className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                      {isLogin ? "Iniciar Sesión" : "Registrarse"}
                    </>
                  )}
                </Button>

                <p className="text-center text-white/60 mt-4">
                  {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setPasswordErrors([]);
                      setAcceptTerms(false);
                      setPassword("");
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? "Regístrate aquí" : "Inicia sesión"}
                  </button>
                </p>

                {currentUser && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowDeleteAccount(true)}
                      className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar cuenta
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Back to home button */}
          <div className="text-center animate-fade-in">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              ← Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;