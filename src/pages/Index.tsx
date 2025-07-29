import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Heart, DollarSign, Send, Sparkles, User, LogOut, CreditCard, FileText, History, Clock, MessageCircle, Twitter, Download } from "lucide-react";
import WelcomeModal from "@/components/custom/WelcomeModal";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import djHeroBg from "@/assets/dj-hero-bg.jpg";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";
import djWackoLogoText from "@/assets/dj-wacko-logo-text.png";
import type { User } from '@supabase/supabase-js';

interface IndexProps {
  user: User | null;
  isAdmin: boolean;
}

const musicGenres = [
  "Reggaeton", "Techno", "House", "Electro", "EDM", "Hip-Hop", "Trap", 
  "Pop", "Rock", "Cumbia", "Salsa", "Bachata", "Merengue", "Regional Mexicano",
  "Funk", "Disco", "Trance", "Dubstep", "Drum & Bass", "Ambient", "Progressive",
  "Deep House", "Tech House", "Minimal", "Banda", "Circuit", "Otros"
];

export default function Index({ user, isAdmin }: IndexProps) {
  const { genreName } = useParams<{ genreName: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [requestsEnabled, setRequestsEnabled] = useState(true);
  const [eventName, setEventName] = useState("Evento Privado");
  const [formData, setFormData] = useState({
    songName: '',
    artistName: '',
    requesterName: '',
    genre: '',
    otherGenre: '',
    tip: '2.00',
    telegram: '',
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleGenreChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, genre: value }));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const verifyPayment = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await fetch('https://api.commerce.coinbase.com/charges/' + sessionId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CC-Api-Key': '5722a856-a1c9-4f3d-9a67-8a8211545417',
        },
      });

      if (error) throw error;

      const charge = await data.json();

      if (charge.data.status === 'PAID' || charge.data.status === 'COMPLETED') {
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

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenModal) {
      setIsWelcomeModalOpen(true);
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setIsWelcomeModalOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast({ title: "Por favor, acepta los términos y condiciones.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('song_requests')
        .insert([
          {
            song_name: formData.songName,
            artist_name: formData.artistName,
            requester_name: formData.requesterName,
            genre: formData.genre,
            tip_amount: parseFloat(formData.tip),
            user_id: user?.id
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        const chargeData = {
          amount: formData.tip,
          currency: 'USD',
          metadata: {
            request_id: data[0].id,
            song: `${formData.songName} - ${formData.artistName}`
          }
        };

        const response = await fetch('https://api.commerce.coinbase.com/charges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CC-Api-Key': '5722a856-a1c9-4f3d-9a67-8a8211545417',
          },
          body: JSON.stringify(chargeData),
        });

        const charge = await response.json();

        if (charge.data.hosted_url) {
          window.location.href = charge.data.hosted_url;
        } else {
          toast({ title: "Error al crear el pago", description: "No se pudo redirigir a la pasarela de pago.", variant: "destructive" });
        }
      }
    } catch (error) {
      toast({ title: "Error al enviar la solicitud", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <WelcomeModal open={isWelcomeModalOpen} onAccept={handleCloseWelcomeModal} />
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
      <div className="relative container mx-auto px-4 z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full">
            <header className="flex justify-between items-center py-4">
              <img src={djWackoMainLogo} alt="DJ Wacko Logo" className="h-12 w-auto" />
              {user && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                    <User className="w-4 h-4 mr-2" />
                    {user.email}
                  </Badge>
                </div>
              )}
            </header>

            <main className="w-full max-w-2xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-300">
                DJ Wacko
              </h1>
              <p className="mt-4 text-lg max-w-xl mx-auto text-muted-foreground">
                Tu música, tu momento. Solicita tu canción y sube la energía de la fiesta.
              </p>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Toco de todos los géneros en <strong>clubs, antros</strong> y eventos exclusivos 🔥
              </p>

              {/* Social Media Links Corrected */}
              <div className="flex items-center justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <a href="https://wa.me/525644127464" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-300 hover-scale">
                  <MessageCircle className="w-5 h-5" /> Contrataciones
                </a>
                <a href="https://twitter.com/DjwackoCDMX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 hover-scale">
                  <Twitter className="w-5 h-5" /> Sígueme
                </a>
              </div>
            </main>

            <div className="max-w-2xl mx-auto mt-6 text-center space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-6">
                {isAdmin && <Button variant="secondary" onClick={() => navigate('/admin')}>👑 Panel de Admin</Button>}
                {user && <Button variant="outline" onClick={() => navigate('/history')}> <History className="mr-2 h-4 w-4" /> Historial</Button>}
                {user ? <Button variant="destructive" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Cerrar Sesión</Button> : <Button onClick={() => navigate('/auth')}><User className="mr-2 h-4 w-4" />Iniciar Sesión</Button>}
                <Button onClick={() => document.getElementById('request-section')?.scrollIntoView({ behavior: 'smooth' })}>🎵 Solicitar</Button>
                <a href="https://github.com/DjwackoCdmx/wackowebdj/releases/latest/download/app-release.apk" target="_blank" rel="noopener noreferrer"><Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white"><Download className="mr-2 h-4 w-4" />Descargar APK</Button></a>
              </div>
            </div>

            {requestsEnabled && (
              <section id="request-section" className="mt-12">
                <Card className="max-w-2xl mx-auto bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">Haz tu solicitud - {eventName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Tu Nombre */}
                      <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Label htmlFor="requesterName">Tu Nombre (Opcional)</Label>
                        <Input id="requesterName" name="requesterName" placeholder="Juan Pérez" value={formData.requesterName} onChange={handleInputChange} className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300 hover-scale" />
                      </motion.div>

                      {/* Nombre de la Canción */}
                      <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Label htmlFor="songName">🎵 Nombre de la Canción *</Label>
                        <Input id="songName" name="songName" placeholder="Ej: Gasolina" value={formData.songName} onChange={handleInputChange} required className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300 hover-scale" />
                      </motion.div>

                      {/* Nombre del Artista */}
                      <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Label htmlFor="artistName">👨‍🎤 Nombre del Artista *</Label>
                        <Input id="artistName" name="artistName" placeholder="Ej: Daddy Yankee" value={formData.artistName} onChange={handleInputChange} required className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300 hover-scale" />
                      </motion.div>

                      {/* Género Musical */}
                      <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Label htmlFor="genre">Género Musical</Label>
                        <Select name="genre" onValueChange={handleGenreChange} value={formData.genre}>
                          <SelectTrigger className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300 hover-scale">
                            <SelectValue placeholder="Selecciona un género" />
                          </SelectTrigger>
                          <SelectContent>{musicGenres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                      </motion.div>

                      {/* Campo para Otro Género (condicional) */}
                      {formData.genre === 'Otros' && (
                        <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <Label htmlFor="otherGenre">Especifica el género</Label>
                          <Input id="otherGenre" name="otherGenre" placeholder="Ej: Cumbia, Rock, etc." value={formData.otherGenre} onChange={handleInputChange} className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300 hover-scale" />
                        </motion.div>
                      )}

                      <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Label htmlFor="tip">Propina (USD)</Label>
                        <Input id="tip" type="number" min="2.00" step="0.50" value={formData.tip} onChange={handleInputChange} className="bg-background/50 border-primary/30 focus:border-primary focus:scale-105 transition-all duration-300" />
                      </motion.div>

                      <motion.div className="flex items-center space-x-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(c) => setAcceptedTerms(c as boolean)} />
                        <label htmlFor="terms" className="text-sm leading-none">Acepto los <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">términos y condiciones</a></label>
                      </motion.div>

                      <Button type="submit" disabled={isSubmitting || !acceptedTerms} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg h-12 hover:scale-105 transition-transform duration-300">{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</Button>
                    </form>
                  </CardContent>
                </Card>
              </section>
            )}

            <footer className="text-center mt-16 pb-8">
              <img src={djWackoLogoText} alt="DJ Wacko Logo" className="mx-auto w-64 h-auto opacity-60" />
              <div className="mt-4 text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Djwacko. Todos los derechos reservados.</p>
                <p>Developer: Juan C. Mendez N.</p>
              </div>
            </footer>
          </motion.div>
      </div>
    </div>
  );
};
