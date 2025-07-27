import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Heart, DollarSign, Send, Sparkles, User, LogOut, CreditCard, FileText, History, Clock, MessageCircle, Twitter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import djHeroBg from "@/assets/dj-hero-bg.jpg";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";
import djWackoLogoText from "@/assets/dj-wacko-logo-text.png";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import WelcomeModal from "@/components/custom/WelcomeModal";
import { motion } from "framer-motion";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const checkUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        setIsAdmin(false);
      } else if (profile) {
        // Using `as any` as a temporary workaround for a persistent TS/Supabase type issue.
        setIsAdmin((profile as any).role === 'admin');
      }
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUser();
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkUser]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [verifyPayment]);

  useEffect(() => {
    if (genreName) {
      const formattedGenre = genreName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (musicGenres.includes(formattedGenre)) {
        setFormData(prev => ({ ...prev, genre: formattedGenre }));
      } else {
        setFormData(prev => ({ ...prev, genre: 'Otros' }));
      }
    }
  }, [genreName]);

  const checkRequestTimeAllowed = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_settings')
        .select('is_requests_enabled, start_time, end_time')
        .single();

      if (error) throw error;

      if (!data.is_requests_enabled) {
        setIsRequestTimeAllowed(false);
        setScheduleMessage("Las solicitudes de canciones están desactivadas por el momento.");
      }
    } catch (error) {
      console.error("Error checking schedule:", error);
    }
  }, []);

  useEffect(() => {
    checkRequestTimeAllowed();
  }, [checkRequestTimeAllowed]);

  const handleAcceptWelcomeModal = () => {
    localStorage.setItem('welcomeModalAccepted', 'true');
    onWelcomeAccept();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handlePayment = async (requestId: string, amount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          song_request_id: requestId,
          amount: amount,
          currency: 'usd',
          success_url: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: window.location.origin,
        },
      });
      if (error) throw error;
      window.location.href = data.url;
    } catch (error: any) {
      toast({ title: 'Error de Pago', description: error.message, variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast({ title: "Debes aceptar los términos y condiciones.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('song_requests')
        .insert([{ 
          song_name: formData.songName, 
          artist_name: formData.artistName, 
          requester_name: formData.requesterName, 
          genre: formData.genre, 
          tip_amount: parseFloat(formData.tip), 
          user_id: user?.id 
        }])
        .select()
        .single();

      if (error) throw error;

      toast({ title: "¡Solicitud enviada!", description: "Procediendo al pago para priorizar." });

      const tipAmount = parseFloat(formData.tip);
      if (tipAmount >= 2) {
        await handlePayment(data.id, tipAmount);
      }
    } catch (error: any) {
      toast({ title: "Error al enviar la solicitud", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-foreground">
      <div className="absolute inset-0 z-0 bg-cover bg-center animate-ken-burns" style={{ backgroundImage: `url(${djHeroBg})` }} />
      <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm" />

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {appState === 'welcome' && <WelcomeModal open={true} onAccept={handleAcceptWelcomeModal} />}
        {appState === 'ready' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl mx-auto">
              <header className="text-center mb-8">
                <img src={djWackoMainLogo} alt="DJ Wacko Animated Logo" className="mx-auto w-48 h-48 sm:w-64 sm:h-64 object-contain"/>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-purple-500 to-neon-blue animate-text-glow">DJ WACKO</h1>
                <p className="mt-4 text-lg sm:text-xl text-foreground/80">Mezclando los mejores beats de la Ciudad de México</p>
                {!isRequestTimeAllowed && (
                  <div className="mt-6 bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg max-w-2xl mx-auto">
                    <span className="font-medium">{scheduleMessage}</span>
                  </div>
                )}
              </header>

              <main className="max-w-2xl mx-auto">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-glow">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">🎵 Solicitar Canción</CardTitle>
                    <CardDescription>Completa el formulario para enviar tu solicitud</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2"><Label htmlFor="songName">Nombre de la canción *</Label><Input id="songName" value={formData.songName} onChange={(e) => setFormData({ ...formData, songName: e.target.value })} required /></div>
                      <div className="space-y-2"><Label htmlFor="artistName">Artista *</Label><Input id="artistName" value={formData.artistName} onChange={(e) => setFormData({ ...formData, artistName: e.target.value })} required /></div>
                      <div className="space-y-2"><Label htmlFor="requesterName">Tu nombre *</Label><Input id="requesterName" value={formData.requesterName} onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })} required /></div>
                      <div className="space-y-2"><Label htmlFor="genre">Género musical</Label><Select onValueChange={(value) => setFormData({ ...formData, genre: value })} value={formData.genre}><SelectTrigger><SelectValue placeholder="Selecciona un género" /></SelectTrigger><SelectContent>{musicGenres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label htmlFor="tip">Propina (USD)</Label><Input id="tip" type="number" min="2.00" step="0.50" value={formData.tip} onChange={(e) => setFormData({ ...formData, tip: e.target.value })} /></div>
                      <div className="flex items-center space-x-2"><Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(c as boolean)} /><label htmlFor="terms" className="text-sm leading-none">Acepto los <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">términos y condiciones</a></label></div>
                      <Button type="submit" disabled={isSubmitting || !acceptedTerms} className="w-full">{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</Button>
                    </form>
                  </CardContent>
                </Card>
              </main>

              <div className="max-w-2xl mx-auto mt-6 text-center space-y-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  {isAdmin && <Button variant="secondary" onClick={() => navigate('/admin')}>👑 Panel de Admin</Button>}
                  {user && <Button variant="outline" onClick={() => navigate('/history')}> <History className="mr-2 h-4 w-4" /> Historial</Button>}
                  {user ? <Button variant="destructive" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Cerrar Sesión</Button> : <Button onClick={() => navigate('/auth')}><User className="mr-2 h-4 w-4" />Iniciar Sesión</Button>}
                </div>
                <a href="https://github.com/DjwackoCdmx/wackowebdj/releases/latest/download/dj-propiona-eb-v1.0.0.apk" target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"><Download className="mr-2 h-4 w-4" />Descargar APK</Button></a>
              </div>

              <footer className="text-center mt-16 pb-8">
                <img src={djWackoLogoText} alt="DJ Wacko Logo" className="mx-auto w-64 h-auto opacity-60" />
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} Djwacko. Todos los derechos reservados.</p>
                  <p>Developer: Juan C. Mendez N.</p>
                </div>
              </footer>
          </motion.div>
        )}
    </div>
    </div>
  );
};

export default Index;