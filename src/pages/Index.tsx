import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Heart, DollarSign, Send, User, LogOut, History, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import djHeroBg from "@/assets/dj-hero-bg.jpg";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const musicGenres = [
  "Reggaeton", "Techno", "House", "Electro", "EDM", "Hip-Hop", "Trap", 
  "Pop", "Rock", "Cumbia", "Salsa", "Bachata", "Merengue", "Regional Mexicano",
  "Funk", "Disco", "Trance", "Dubstep", "Drum & Bass", "Ambient", "Progressive",
  "Deep House", "Tech House", "Minimal", "Banda", "Circuit", "Otros"
];

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRequestTimeAllowed, setIsRequestTimeAllowed] = useState(true);
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [formData, setFormData] = useState({
    songName: "",
    artistName: "",
    genre: "",
    tip: "",
    telegram: "",
    requesterName: ""
  });
  const [customGenre, setCustomGenre] = useState("");
  const [showCustomGenre, setShowCustomGenre] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleGenreChange = (value: string) => {
    if (value === "Otros") {
      setShowCustomGenre(true);
    } else {
      setShowCustomGenre(false);
    }
    setFormData(prev => ({ ...prev, genre: value }));
  };

  const checkRequestTimeAllowed = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('is_request_time_allowed');
      if (error) throw error;
      setIsRequestTimeAllowed(data);
      if (!data) {
        setScheduleMessage("Las solicitudes están temporalmente cerradas. Horario: Viernes y Sábados de 8 PM a 2 AM.");
      }
    } catch (error) {
      console.error('Error checking request time:', error);
      setIsRequestTimeAllowed(true); // Default to allowed if check fails
    }
  }, []);

  const verifyPayment = useCallback(async (sessionId: string) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify_stripe_session', {
        body: { session_id: sessionId },
      });

      if (error) throw new Error(`Error verifying payment: ${error.message}`);
      
      if (data.status === 'success') {
        toast({
          title: "¡Pago verificado!",
          description: "Tu solicitud ha sido enviada con éxito.",
          className: "bg-green-600 text-white border-green-700",
        });
        setSearchParams({}, { replace: true });
      } else {
        throw new Error(data.message || 'Error desconocido al verificar el pago.');
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast({
        title: "Error en la verificación del pago",
        description: errMsg,
        variant: "destructive",
      });
      setSearchParams({}, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, setSearchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {

    const reorderData = localStorage.getItem('reorderData');
    if (reorderData) {
      const parsedData = JSON.parse(reorderData);
      setFormData(parsedData);
      localStorage.removeItem('reorderData');
      toast({ title: "Datos cargados", description: "Se han cargado los datos de tu solicitud anterior." });
    }

    checkRequestTimeAllowed();

    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (paymentStatus === 'cancelled') {
      toast({ title: "Pago cancelado", description: "El pago fue cancelado. Puedes intentar nuevamente.", variant: "destructive" });
      setSearchParams({}, { replace: true });
    }
  }, [checkRequestTimeAllowed, verifyPayment, searchParams, setSearchParams, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente." });
  };

  const handlePayment = async (requestId: string, amount: number) => {
    try {
        const { data, error } = await supabase.functions.invoke('create-stripe-session', {
            body: { 
                request_id: requestId,
                amount: amount 
            },
        });

        if (error) throw error;

        if (data.url) {
            window.location.href = data.url;
        }

    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        toast({ title: "Error al procesar pago", description: errMsg, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRequestTimeAllowed) {
      toast({ title: "Solicitudes cerradas", description: scheduleMessage, variant: "destructive" });
      return;
    }

    if (!formData.songName || !formData.artistName || parseFloat(formData.tip) < 2 || !acceptedTerms) {
      toast({ title: "Error en la solicitud", description: !acceptedTerms ? "Debes aceptar los términos y condiciones." : "Completa los campos obligatorios y asegúrate que la propina sea mínimo $2 USD.", variant: "destructive" });
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

      toast({
        title: "¡Solicitud guardada!",
        description: `Redirigiendo al pago...`,
      });

      handlePayment(data.id, parseFloat(formData.tip));

    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast({ title: "Error al enviar solicitud", description: errMsg, variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${djHeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-neon rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-electric rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-end mb-6 gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {userRole === 'admin' && (
                  <Button variant="destructive" onClick={() => navigate('/admin')} size="sm">
                    Panel de Admin
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate('/user-history')} size="sm">
                  <History className="w-4 h-4 mr-2" />
                  Mi Historial
                </Button>
                <Badge variant="secondary" className="px-3 py-1">
                  <User className="w-3 h-3 mr-1" />
                  {user.email}
                </Badge>
                <Button variant="ghost" onClick={handleSignOut} size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => navigate('/auth')} size="sm">
                <User className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>

          <div className="flex justify-center mb-6 animate-fade-in">
            <img src={djWackoMainLogo} alt="DJ Wacko" className="w-48 h-48 object-contain hover-scale transition-transform duration-500" />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">🎧 <strong>DJ versátil</strong> especializado en <strong>Techno, House, Reggaeton, Electro</strong> y <strong>Circuito</strong></p>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">Toco de todos los géneros en <strong>clubs, antros</strong> y eventos exclusivos 🔥</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a href="https://wa.me/5256441274646" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-300 hover-scale">📱 +52 56 4412 7464</a>
            <a href="https://twitter.com/DjwackoCDMX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 hover-scale">🐦 @DjwackoCDMX</a>
          </div>
          
          {!isRequestTimeAllowed && (
            <div className="mb-8 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-yellow-400"><Clock className="w-5 h-5" /><span className="font-medium">{scheduleMessage}</span></div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}><Heart className="w-5 h-5 text-neon-pink animate-pulse" /><span className="text-lg font-medium text-foreground/80">🎵 Solicita tu canción favorita</span><Heart className="w-5 h-5 text-neon-pink animate-pulse" /></div>
        </div>

        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex justify-end mb-4">
            <a href="/DJ-Wacko-Propinas.apk" download>
              <Button variant="outline">
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.382 6.457C21.033 5.924 20.456 5.59 19.81 5.59H16.5V3.75C16.5 2.784 15.716 2 14.75 2H9.25C8.284 2 7.5 2.784 7.5 3.75V5.59H4.19C3.544 5.59 2.967 5.924 2.618 6.457C2.269 6.99 2.245 7.648 2.55 8.145L3.843 10.24H20.157L21.45 8.145C21.755 7.648 21.731 6.99 21.382 6.457ZM9 3.75C9 3.612 9.112 3.5 9.25 3.5H14.75C14.888 3.5 15 3.612 15 3.75V5.59H9V3.75Z M4.453 11.74L2.31 18.693C2.152 19.217 2.59 19.74 3.132 19.74H20.868C21.41 19.74 21.848 19.217 21.69 18.693L19.547 11.74H4.453Z"/></svg>
                Descargar para Android
              </Button>
            </a>
          </div>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground">🎵 Solicitar Canción</CardTitle>
              <CardDescription className="text-lg">Completa el formulario para solicitar tu canción 🎶</CardDescription>
            </CardHeader>
            
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="songName"><Music className="inline-block w-4 h-4 mr-2"/>Canción</Label>
                      <Input id="songName" placeholder="Ej: 'Bohemian Rhapsody'" value={formData.songName} onChange={(e) => setFormData({...formData, songName: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="artistName"><User className="inline-block w-4 h-4 mr-2"/>Artista</Label>
                      <Input id="artistName" placeholder="Ej: 'Queen'" value={formData.artistName} onChange={(e) => setFormData({...formData, artistName: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Género Musical</Label>
                    <Select onValueChange={handleGenreChange} value={formData.genre}>
                      <SelectTrigger><SelectValue placeholder="Selecciona un género" /></SelectTrigger>
                      <SelectContent>
                        {musicGenres.map(genre => <SelectItem key={genre} value={genre}>{genre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {showCustomGenre && (
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="customGenre">Otro Género</Label>
                      <Input id="customGenre" placeholder="Específica el género" value={customGenre} onChange={(e) => setCustomGenre(e.target.value)} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="tip"><DollarSign className="inline-block w-4 h-4 mr-2"/>Propina (USD)</Label>
                    <Input id="tip" type="number" placeholder="Mínimo: 2.00" min="2" step="0.01" value={formData.tip} onChange={(e) => setFormData({...formData, tip: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="requesterName">Tu Nombre (Opcional)</Label>
                      <Input id="requesterName" placeholder="Tu nombre aquí" value={formData.requesterName} onChange={(e) => setFormData({...formData, requesterName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram">@Telegram (Opcional)</Label>
                      <Input id="telegram" placeholder="Tu usuario de Telegram" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} />
                    </div>
                  </div>
                  <div className="items-top flex space-x-2">
                    <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))} />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Acepto los términos y condiciones</label>
                      <p className="text-sm text-muted-foreground">Tu solicitud será añadida a la cola. El DJ se reserva el derecho de mezclar o acortar la canción.</p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover-scale shadow-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Procesando...' : <><Send className="w-5 h-5 mr-2"/>Enviar Solicitud y Pagar</>}
                  </Button>
                </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;