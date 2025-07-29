import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Crown, Heart, User, History, Clock, LogOut, UserPlus, Phone, Twitter } from 'lucide-react';

// Import page components from barrel file
import { SongRequestForm, type SongRequestFormData, WelcomeModal, PaymentDialog } from "@/components/page-components";
import LoadingScreen from "@/components/layout/LoadingScreen";

// Background images and logos
import djHeroBg from '@/assets/dj-hero-bg.jpg';
import djWackoMainLogo from '@/assets/dj-wacko-main-logo.gif';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isRequestTimeAllowed, setIsRequestTimeAllowed] = useState(true);
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
            // @ts-expect-error - RPC type generation issue
      const { data, error } = await supabase.rpc('is_admin', { p_user_id: userId });
      if (error) throw error;
      setIsAdmin(data ?? false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }, []);

  const checkRequestTime = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('is_request_time_allowed');
      if (error) throw error;
      setIsRequestTimeAllowed(data ?? true); // Default to true if data is null

      if (!data) {
                // @ts-expect-error - RPC type generation issue
        const { data: messageData, error: messageError } = await supabase.rpc('get_schedule_message');
        if (messageError) throw messageError;
        setScheduleMessage(String(messageData ?? "Las solicitudes están cerradas fuera del horario establecido."));
      }
    } catch (error) {
      console.error("Error checking request time:", error);
      setIsRequestTimeAllowed(true); // Fallback to allow requests if check fails
    }
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    navigate('/');
  };

  const handleCloseWelcomeModal = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setShowWelcomeModal(false);
  };

  const handleFormSubmit = async (formData: SongRequestFormData) => {
    if (!user) {
        toast({ title: 'Debes iniciar sesión', description: 'Para poder solicitar una canción, necesitas una cuenta.', variant: 'destructive' });
        navigate('/auth');
        return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-link', {
        body: { ...formData, userId: user.id },
      });

      if (error) throw new Error(error.message);
      if (data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
        setShowPayment(true);
      } else {
        throw new Error('No se recibió la URL de pago.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
      toast({ title: 'Error al crear solicitud', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await checkAdminStatus(currentUser.id);
      }
      await checkRequestTime();

      if (!localStorage.getItem('hasSeenWelcomeModal')) {
        setShowWelcomeModal(true);
      }
      
      setIsInitializing(false);
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
            checkAdminStatus(currentUser.id);
        } else {
            setIsAdmin(false);
        }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus, checkRequestTime]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast({ title: "¡Pago exitoso!", description: "Tu solicitud ha sido enviada.", variant: 'default', className: 'bg-green-500 text-white' });
      setSearchParams(params => { params.delete('payment'); return params; });
    } else if (paymentStatus === 'cancelled') {
      toast({ title: "Pago cancelado", description: "Tu solicitud no fue enviada.", variant: 'destructive' });
      setSearchParams(params => { params.delete('payment'); return params; });
    }
  }, [searchParams, toast, setSearchParams]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <>
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseWelcomeModal} />
      <PaymentDialog isOpen={showPayment} onClose={() => setShowPayment(false)} paymentUrl={paymentUrl} />
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
          <header className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
                <img src={djWackoMainLogo} alt="DJ Wacko Logo" className="w-16 h-16 rounded-full object-cover border-2 border-primary/50" />
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-wider">DJ WACKO</h1>
                  <p className="text-sm text-foreground/70 -mt-1">Plataforma de Solicitudes Musicales</p>
                </div>
            </div>
            <nav className="flex items-center gap-2">
              {user && isAdmin && (
                  <Button variant="secondary" onClick={() => navigate('/admin')}>
                    <Crown className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
              )}
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => navigate('/user-history')} size="sm">
                    <History className="w-4 h-4 mr-2" />
                    Mi Historial
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut} size="icon">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => navigate('/auth')}>
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/auth', { state: { view: 'register' } })}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrarse
                  </Button>
                </div>
              )}
            </nav>
          </header>

          <div className="text-center mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a 
                href="https://wa.me/5256441274646" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-300"
              >
                <Phone className="w-4 h-4" /> +52 56 4412 7464
              </a>
              <a 
                href="https://twitter.com/DjwackoCDMX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" /> @DjwackoCDMX
              </a>
            </div>

            {!isRequestTimeAllowed && (
              <div className="mb-8 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{scheduleMessage}</span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Heart className="w-5 h-5 text-neon-pink animate-pulse" />
              <span className="text-lg font-medium text-foreground/80">
                🎵 Solicita tu canción favorita
              </span>
              <Heart className="w-5 h-5 text-neon-pink animate-pulse" />
            </div>
          </div>

          <main className="relative z-10 flex items-center justify-center">
            <SongRequestForm 
                onSubmit={handleFormSubmit} 
                isSubmitting={isSubmitting} 
                isRequestTimeAllowed={isRequestTimeAllowed}
                genres={['Rock', 'Pop', '80s', '90s', 'Electrónica', 'Reggaeton', 'Otro']}
              />
          </main>
        </div>
      </div>
    </>
  );
};

export default Index;