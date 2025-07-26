import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Heart, DollarSign, Send, Sparkles, User, LogOut, CreditCard, FileText, History, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import djHeroBg from "@/assets/dj-hero-bg.jpg";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";
import djWackoLogoText from "@/assets/dj-wacko-logo-text.png";
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
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<SupabaseUser | null>(null);
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
  const [showPayment, setShowPayment] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    // Check authentication status
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Check if we have reorder data from localStorage
    const reorderData = localStorage.getItem('reorderData');
    if (reorderData) {
      const parsedData = JSON.parse(reorderData);
      setFormData(parsedData);
      localStorage.removeItem('reorderData');
      toast({
        title: "Datos cargados",
        description: "Se han cargado los datos de tu solicitud anterior",
      });
    }

    // Check request time restrictions
    checkRequestTimeAllowed();

    // Check for payment success
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Pago cancelado",
        description: "El pago fue cancelado. Puedes intentar nuevamente.",
        variant: "destructive",
      });
    }

    return () => subscription.unsubscribe();
  }, [searchParams, toast]);

  const checkRequestTimeAllowed = async () => {
    try {
      const { data, error } = await supabase.rpc('is_request_time_allowed');
      if (error) throw error;
      
      setIsRequestTimeAllowed(data);
      
      if (!data) {
        setScheduleMessage("Las solicitudes están temporalmente cerradas fuera del horario establecido. Vuelve más tarde.");
      }
    } catch (error) {
      console.error('Error checking request time:', error);
      // If there's an error, allow requests by default
      setIsRequestTimeAllowed(true);
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      if (data.payment_status === 'paid') {
        toast({
          title: "¡Pago confirmado!",
          description: "Tu canción ha sido agregada a la lista con prioridad.",
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
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
        tip: "",
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
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${djHeroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-neon rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-electric rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* User Authentication Section */}
          <div className="flex justify-end mb-6 gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/user-history')}
                  size="sm"
                >
                  <History className="w-4 h-4 mr-2" />
                  Mi Historial
                </Button>
                <Badge variant="secondary" className="px-3 py-1">
                  <User className="w-3 h-3 mr-1" />
                  {user.email}
                </Badge>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  size="sm"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                size="sm"
              >
                <User className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Main Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <img 
              src={djWackoMainLogo} 
              alt="DJ Wacko Logo" 
              className="w-48 h-48 object-contain"
            />
          </div>
          
          {/* DJ Description */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              🎧 <strong>DJ versátil</strong> especializado en <strong>Techno, House, Reggaeton, Electro</strong> y <strong>Circuito</strong>
            </p>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Toco de todos los géneros en <strong>clubs, antros</strong> y eventos exclusivos 🔥
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a 
              href="https://wa.me/5256441274646" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-300 hover-scale"
            >
              📱 +52 56 4412 7464
            </a>
            <a 
              href="https://twitter.com/DjwackoCDMX" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 hover-scale"
            >
              🐦 @DjwackoCDMX
            </a>
          </div>
          
          {/* Schedule Message */}
          {!isRequestTimeAllowed && (
            <div className="mb-8 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{scheduleMessage}</span>
              </div>
            </div>
          )}
          <form>
            {/* Rest of the form */}
          </form>
          {/* Payment Section */}
          {showPayment ? (
            <div className="mt-8 p-6 bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl border border-primary/30 space-y-6 animate-fade-in">
              <h3 className="font-bold text-foreground mb-4 text-center text-xl">💳 Selecciona tu método de pago</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handlePayment(localStorage.getItem('currentRequestId') || '', parseFloat(localStorage.getItem('currentTipAmount') || '0'))}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 gentle-pulse hover:animate-none"
                  disabled={parseFloat(localStorage.getItem('currentTipAmount') || '0') < 2}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  💳 Stripe (${localStorage.getItem('currentTipAmount') || '0'} USD)
                </Button>
                
                <Button
                  onClick={() => window.open('https://buy.stripe.com/cNifZgclA1ve8vS0z02Ji01', '_blank')}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 gentle-pulse hover:animate-none"
                  style={{ animationDelay: '0.5s' }}
                  disabled={parseFloat(localStorage.getItem('currentTipAmount') || '0') < 2}
                >
                  <span className="text-lg mr-2">₿</span>
                  Cripto ({localStorage.getItem('currentTipAmount') || '0'} USDC)
                </Button>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Tu solicitud será procesada después de confirmar el pago
                </p>
                <p className="text-xs text-primary font-medium">
                  Mínimo: $2 USD / 2 USDC
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">💳 Próximos pasos:</h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Completa el formulario y acepta los términos</li>
                <li>2. Selecciona método de pago (Stripe/Cripto)</li>
                <li>3. Confirma tu pago</li>
                <li>4. ¡Espera confirmación cuando tu canción suene!</li>
              </ol>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
          className="text-sm"
        >
          🎧 Acceso DJ
        </Button>
      </div>
      <div className="text-center mt-16 pb-8 animate-fade-in" style={{ animationDelay: '2s' }}>
        <img 
          src={djWackoLogoText} 
          alt="DJ Wacko Logo" 
          className="mx-auto w-64 h-auto object-contain opacity-60 hover:opacity-100 transition-all duration-500 hover-scale"
        />
      </div>
    </div>
  );
};

export default Index;