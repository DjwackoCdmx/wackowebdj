import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Heart, DollarSign, Send, Sparkles, User, LogOut, CreditCard, FileText, History, Clock, MessageCircle, Twitter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import djHeroBg from "@/assets/dj-hero-bg.jpg";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";
import djWackoLogoText from "@/assets/dj-wacko-logo-text.png";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import WelcomeModal from "@/components/custom/WelcomeModal";

interface IndexProps {
  appState: 'loading' | 'welcome' | 'ready';
  onWelcomeAccept: () => void;
}

const musicGenres = [
  "Reggaeton", "Techno", "House", "Electro", "EDM", "Hip-Hop", "Trap", 
  "Pop", "Rock", "Cumbia", "Salsa", "Bachata", "Merengue", "Regional Mexicano",
  "Funk", "Disco", "Trance", "Dubstep", "Drum & Bass", "Ambient", "Progressive",
  "Deep House", "Tech House", "Minimal", "Banda", "Circuit", "Otros"
];

const Index = ({ appState, onWelcomeAccept }: IndexProps) => {
  const { genreName } = useParams<{ genreName: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRequestTimeAllowed, setIsRequestTimeAllowed] = useState(true);
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [formData, setFormData] = useState({
    songName: "",
    artistName: "",
    requesterName: "",
    genre: "",
    tip: "2.00",
    telegram: "",
  });
  const [showCustomGenre, setShowCustomGenre] = useState(false);
  const [customGenre, setCustomGenre] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const verifyPayment = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-stripe-session', {
        body: { session_id: sessionId },
      });

      if (error) throw error;

      if (data.payment_status === 'paid') {
        toast({
          title: "✅ ¡Pago verificado!",
          description: "Tu solicitud ha sido confirmada y priorizada.",
          
        });
        setShowPayment(false);
      } else {
        toast({
          title: "😕 Pago no completado",
          description: "El pago no se completó. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Error de Verificación",
        description: "No se pudo verificar el pago. Contacta a soporte.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (profile) {
          setIsAdmin(profile.role === 'admin');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        checkUser(); 
      } else {
        setUser(null);
        setIsAdmin(false);
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
      window.history.replaceState({}, document.title, "/");
    }
  }, [verifyPayment]);

  useEffect(() => {
    if (genreName) {
      const formattedGenreName = genreName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (musicGenres.includes(formattedGenreName)) {
        setFormData(prev => ({ ...prev, genre: formattedGenreName }));
      }
    }
  }, [genreName]);

  const checkRequestTimeAllowed = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('is-request-time-allowed');
      if (error) throw error;
      setIsRequestTimeAllowed(data.isAllowed);
      setScheduleMessage(data.message);
    } catch (error) {
      console.error('Error checking request time:', error);
      setIsRequestTimeAllowed(false);
      setScheduleMessage("No se pudo verificar el horario. Inténtalo más tarde.");
    }
  };

  const handleAcceptWelcomeModal = () => {
    localStorage.setItem('hasAcceptedWelcomeModal', 'true');
    onWelcomeAccept();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const handleCoinbasePayment = async (requestId: string, amount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-coinbase-charge', {
        body: {
          song_request_id: requestId,
          amount: amount,
          currency: 'usd'
        }
      });

      if (error) throw error;

      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating Coinbase charge:', error);
      toast({
        title: "Error en el pago con Cripto",
        description: "No se pudo procesar el pago. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (requestId: string, amount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          song_request_id: requestId,
          amount: amount,
          currency: 'usd'
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error en el pago",
        description: "No se pudo procesar el pago. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRequestTimeAllowed) {
      toast({
        title: "Solicitudes cerradas",
        description: scheduleMessage,
        variant: "destructive"
      });
      return;
    }

    if (!formData.songName || !formData.artistName || parseFloat(formData.tip) < 2 || !acceptedTerms) {
      toast({
        title: "Error en la solicitud",
        description: !acceptedTerms ? "Debes aceptar los términos y condiciones" : "Por favor completa los campos obligatorios y asegúrate que la propina sea mínimo $2 USD",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalGenre = formData.genre === "Otros" ? customGenre || "Otros" : formData.genre;
      
      const { data, error } = await supabase
        .from('song_requests')
        .insert({
          song_name: formData.songName,
          artist_name: formData.artistName,
          genre: finalGenre || null,
          requester_name: formData.requesterName || (user?.email) || null,
          telegram_username: formData.telegram || null,
          tip_amount: parseFloat(formData.tip),
          payment_status: 'pending',
          user_id: user?.id || null
        })
        .select()
        .single();

      if (error) throw error;

      // Show payment options after successful request creation
      setShowPayment(true);
      
      toast({
        title: "¡Solicitud enviada exitosamente! 🎵",
        description: `Tu solicitud de "${formData.songName}" por ${formData.artistName} ha sido guardada. Procede con el pago para confirmarla.`,
      });

      // Store the request ID and amount for payment
      localStorage.setItem('currentRequestId', data.id);
      localStorage.setItem('currentTipAmount', formData.tip);

      // Reset form
      setFormData({
        songName: "",
        artistName: "",
        genre: "",
        tip: "2.00",
        telegram: "",
        requesterName: ""
      });
      setCustomGenre("");
      setAcceptedTerms(false);

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      toast({
        title: "Error al enviar solicitud",
        description: "Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <WelcomeModal open={appState === 'welcome'} onAccept={handleAcceptWelcomeModal} />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 text-white">
        {/* Renderiza el contenido solo cuando el estado es 'ready' */}
        {appState === 'ready' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <header className="text-center mb-10">
              {/* Top-right buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-4">
                {user && (
                  <div className="flex items-center gap-4">
                    {isAdmin && (
                      <Button
                        variant="secondary"
                        onClick={() => navigate('/admin')}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Panel de Admin
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => navigate('/history')}
                      size="sm"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Mi Historial
                    </Button>
                </p>
              </div>
              {!isRequestTimeAllowed && (
                <div className="mt-6 bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg shadow-lg max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{scheduleMessage}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 my-8">
                <Heart className="w-5 h-5 text-neon-pink animate-pulse" />
                <span className="text-lg font-medium text-foreground/80">
                  🎵 Solicita tu canción favorita
                </span>
                <Heart className="w-5 h-5 text-neon-pink animate-pulse" />
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto">
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-glow">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-foreground">
                    🎵 Solicitar Canción
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Completa el formulario para solicitar tu canción 🎶
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form fields... */}
                    <div className="space-y-2">
                      <Label htmlFor="songName">🎵 Nombre de la canción *</Label>
                      <Input id="songName" placeholder="Ej: Gasolina" value={formData.songName} onChange={(e) => setFormData({ ...formData, songName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="artistName">🎤 Artista *</Label>
                      <Input id="artistName" placeholder="Ej: Daddy Yankee" value={formData.artistName} onChange={(e) => setFormData({ ...formData, artistName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requesterName">👤 Tu nombre *</Label>
                      <Input id="requesterName" placeholder="Tu nombre o apodo" value={formData.requesterName} onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genre">🎶 Género musical</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, genre: value })} value={formData.genre}>
                        <SelectTrigger><SelectValue placeholder="Selecciona un género" /></SelectTrigger>
                        <SelectContent>{musicGenres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tip">💰 Propina (USD)</Label>
                      <Input id="tip" type="number" min="2.00" step="0.50" value={formData.tip} onChange={(e) => setFormData({ ...formData, tip: e.target.value })} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
                      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Acepto los <a href="/terms" target="_blank" className="underline text-primary">términos y condiciones</a>
                      </label>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !acceptedTerms} className="w-full">{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</Button>
                  </form>
                </CardContent>
              </Card>
            </main>

            {/* Action Buttons */}
            <div className="max-w-2xl mx-auto mt-6 text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user && <Button variant="outline" onClick={() => navigate('/history')}> <History className="mr-2 h-4 w-4" /> Mi Historial</Button>}
                {isAdmin && <Button variant="secondary" onClick={() => navigate('/admin')}>👑 Panel de Admin</Button>}
                {user ? <Button variant="destructive" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Cerrar Sesión</Button> : <Button onClick={() => navigate('/auth')}><User className="mr-2 h-4 w-4" />Iniciar Sesión</Button>}
              </div>
              <a href="https://github.com/DjwackoCdmx/wackowebdj/releases/download/v1.0.0/dj-propiona-eb-latest.apk" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"><Download className="mr-2 h-4 w-4" />Descargar APK</Button>
              </a>
            </div>

            {/* Footer */}
            <footer className="text-center mt-16 pb-8">
              <img src={djWackoLogoText} alt="DJ Wacko Logo" className="mx-auto w-64 h-auto object-contain opacity-60" />
              <div className="mt-4 text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Djwacko. Todos los derechos reservados.</p>
                <p>Developer: Juan C. Mendez N.</p>
                <p className="mt-2 text-xs text-gray-500">v1.0</p>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </div>
  </div>
);
export default Index;