import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Music, Heart, DollarSign, Send, Sparkles, User, LogOut, CreditCard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import djHeroBg from "@/assets/dj-hero-bg.jpg";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.png";
import djWackoLogoText from "@/assets/dj-wacko-logo-text.png";

const genres = [
  "Electronic",
  "Hip Hop",
  "Pop",
  "Rock",
  "Reggaeton",
  "Salsa",
  "Bachata",
  "Merengue",
  "Trap",
  "House",
  "Techno",
  "Drum & Bass",
  "Dubstep",
  "R&B",
  "Funk",
  "Disco"
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    song: "",
    artist: "",
    genre: "",
    tip: "",
    telegram: "",
    requesterName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);

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
    if (!formData.song || !formData.artist || parseFloat(formData.tip) < 2) {
      toast({
        title: "Error en la solicitud",
        description: "Por favor completa los campos obligatorios y asegúrate que la propina sea mínimo $2 USD",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('song_requests')
        .insert({
          song_name: formData.song,
          artist_name: formData.artist,
          genre: formData.genre || null,
          requester_name: formData.requesterName || null,
          telegram_username: formData.telegram || null,
          tip_amount: parseFloat(formData.tip),
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "¡Solicitud enviada exitosamente! 🎵",
        description: `Tu solicitud de "${formData.song}" por ${formData.artist} ha sido guardada. Procede con el pago para confirmarla.`,
      });

      // Reset form
      setFormData({
        song: "",
        artist: "",
        genre: "",
        tip: "",
        telegram: "",
        requesterName: ""
      });

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
          {/* Main Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <img 
              src={djWackoMainLogo} 
              alt="DJ Wacko" 
              className="w-48 h-48 object-contain hover-scale transition-transform duration-500"
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
          
          {/* Subtle tip message */}
          <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Heart className="w-5 h-5 text-neon-pink animate-pulse" />
            <span className="text-lg font-medium text-foreground/80">
              🎵 Solicita tu canción favorita
            </span>
            <Heart className="w-5 h-5 text-neon-pink animate-pulse" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
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
                {/* Song Name */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <Label htmlFor="song" className="text-sm font-medium text-foreground">
                    🎵 Nombre de la canción *
                  </Label>
                  <Input
                    id="song"
                    placeholder="Ej: Gasolina"
                    value={formData.song}
                    onChange={(e) => setFormData({ ...formData, song: e.target.value })}
                    className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300"
                    required
                  />
                </div>

                {/* Artist */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1s' }}>
                  <Label htmlFor="artist" className="text-sm font-medium text-foreground">
                    👨‍🎤 Artista *
                  </Label>
                  <Input
                    id="artist"
                    placeholder="Ej: Daddy Yankee"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300"
                    required
                  />
                </div>

                {/* Requester Name */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  <Label htmlFor="requesterName" className="text-sm font-medium text-foreground">
                    👤 Tu nombre (opcional)
                  </Label>
                  <Input
                    id="requesterName"
                    placeholder="¿Cómo te llamas?"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300"
                  />
                </div>

                {/* Genre */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1.4s' }}>
                  <Label htmlFor="genre" className="text-sm font-medium text-foreground">
                    🎼 Género (opcional)
                  </Label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                    <SelectTrigger className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300">
                      <SelectValue placeholder="Selecciona un género" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tip Amount */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1.6s' }}>
                  <Label htmlFor="tip" className="text-sm font-medium text-foreground">
                    💝 Muestra tu apoyo (USD) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="tip"
                      type="number"
                      min="2"
                      step="0.01"
                      placeholder="2.00"
                      value={formData.tip}
                      onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                      className="pl-10 bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desde $2.00 USD - Pequeño gesto que hace posible priorizar tu canción ✨
                  </p>
                </div>

                {/* Telegram */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1.8s' }}>
                  <Label htmlFor="telegram" className="text-sm font-medium text-foreground">
                    📱 Tu @Telegram (opcional)
                  </Label>
                  <Input
                    id="telegram"
                    placeholder="@tu_usuario"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300"
                  />
                  <p className="text-xs text-muted-foreground">
                    Para recibir confirmación cuando tu canción sea reproducida
                  </p>
                </div>

                {/* Submit Button */}
                <div className="animate-fade-in" style={{ animationDelay: '2s' }}>
                  <Button 
                    type="submit" 
                    variant="dj" 
                    size="xl" 
                    disabled={isSubmitting}
                    className="w-full hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Enviando solicitud...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        🎵 Enviar Mi Solicitud
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Payment Info */}
              <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">💳 Próximos pasos:</h3>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Completa el formulario</li>
                  <li>2. Selecciona método de pago (Cripto/Transferencia)</li>
                  <li>3. Sube evidencia del pago</li>
                  <li>4. ¡Espera confirmación cuando tu canción suene!</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Admin Access */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="text-sm"
            >
              🎧 Acceso DJ
            </Button>
          </div>
        </div>

        {/* Footer with Logo */}
        <div className="text-center mt-16 pb-8 animate-fade-in" style={{ animationDelay: '2s' }}>
          <img 
            src={djWackoLogoText} 
            alt="DJ Wacko Logo" 
            className="mx-auto w-64 h-auto object-contain opacity-60 hover:opacity-100 transition-all duration-500 hover-scale"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
