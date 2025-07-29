import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Crown, Heart, User, History, Clock, LogOut, UserPlus, Phone, Twitter, ListChecks, MessageCircle, Send, Download } from 'lucide-react';

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

            </div>
            <nav className="flex items-center gap-2">
              {user && isAdmin && (
                  <Button variant="secondary" onClick={() => navigate('/admin')}>
                    <Crown className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
              )}
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 hidden sm:block">{user.email}</span>
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
                   <Button onClick={() => navigate('/auth', { state: { from: 'register' } })}>
                     <UserPlus className="w-4 h-4 mr-2" />
                     Registrarse
                   </Button>
                </div>
              )}
            </nav>
          </header>

          <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <div className="bg-black bg-opacity-50 p-8 rounded-xl shadow-2xl max-w-3xl w-full">
              <h1 className="text-5xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Tu Música, Tu Momento
              </h1>
              <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-4">DJ WACKO</h2>
              <p className="text-xl text-gray-300 mb-8">
                Solicita tus canciones preferidas y disfrútalas en la fiesta.
              </p>
              
              <SongRequestForm 
                onSubmit={handleFormSubmit} 
                isSubmitting={isSubmitting} 
                isRequestTimeAllowed={isRequestTimeAllowed}
                genres={['Rock', 'Pop', '80s', '90s', 'Electrónica', 'Reggaeton', 'Otro']}
              />
            </div>
          </main>

          <footer className="w-full p-4 bg-black bg-opacity-30 mt-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-lg font-semibold text-white mb-3"><MessageCircle className="inline-block mr-2"/> Contacto y Descargas</h3>
              <div className="flex justify-center items-center gap-4">
                <Button asChild variant="outline" className="bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/20">
                  <a href="https://wa.me/5256441274646" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="bg-blue-500/10 border-blue-500/30 text-white hover:bg-blue-500/20">
                  <a href="https://twitter.com/DjwackoCDMX" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                  </a>
                </Button>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                  <a href="https://github.com/DjwackoCdmx/wackowebdj/releases/download/v1.0.0/app-release.apk" download>
                    <Download className="mr-2 h-4 w-4" /> Descargar APK
                  </a>
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;