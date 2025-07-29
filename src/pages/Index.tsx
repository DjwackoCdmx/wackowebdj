import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Crown, User, History, LogOut, UserPlus, Phone, Twitter, MessageCircle, Download } from 'lucide-react';

// Import page components and layout
import { SongRequestForm, type SongRequestFormData, WelcomeModal, PaymentDialog } from "@/components/page-components";
import LoadingScreen from "@/components/layout/LoadingScreen";

// Import assets
import djHeroBg from '@/assets/dj-hero-bg.jpg';
import djWackoMainLogo from '@/assets/dj-wacko-main-logo.gif';

/**
 * Main index page component.
 * Handles user authentication, session management, and renders the main UI.
 */
const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- STATE MANAGEMENT ---
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isRequestTimeAllowed, setIsRequestTimeAllowed] = useState(true); // Placeholder
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  // --- AUTH & SESSION LOGIC ---
  useEffect(() => {
    // 1. Set up auth listener to get user session
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsInitializing(false);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- DATA FETCHING AFTER AUTH ---
  useEffect(() => {
    // 2. Once user is identified, check their role and other permissions.
    if (user) {
      // Check admin status
      const checkAdminStatus = async () => {
        try {
          // Note: Verifying admin by email is insecure on the client-side.
          // The recommended approach is using Supabase RPC with RLS as implemented here.
          // HACK: Using 'as any' to bypass incorrect Supabase type generation.
          // The root cause is likely that the auto-generated types only expect 'is_request_time_allowed'.
          // The long-term fix is to regenerate Supabase types correctly.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await supabase.rpc('is_admin' as any);
          if (error) throw error;
          setIsAdmin(data ?? false);
        } catch (e) {
          console.error('Error checking admin status:', e);
          setIsAdmin(false);
        }
      };

      checkAdminStatus();
    } else {
      // If no user, they are not an admin.
      setIsAdmin(false);
    }

    // Check if song requests are currently allowed (this can be independent of user session)
    const checkRequestTime = async () => {
      try {
        const { data, error } = await supabase.rpc('is_request_time_allowed');
        if (error) throw error;
        setIsRequestTimeAllowed(data ?? false);
      } catch (e) {
        console.error('Error checking request time:', e);
        setIsRequestTimeAllowed(false); // Default to false on error
      }
    };

    checkRequestTime();

    // Welcome modal logic
    if (!localStorage.getItem('hasSeenWelcomeModal')) {
      setShowWelcomeModal(true);
    }
  }, [user]); // This hook depends on the user state

  // Payment status toast notifications
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus) {
      if (paymentStatus === 'success') {
        toast({ title: "¡Pago exitoso!", description: "Tu solicitud ha sido enviada.", variant: 'default', className: 'bg-green-500 text-white' });
      } else if (paymentStatus === 'cancelled') {
        toast({ title: "Pago cancelado", description: "Tu solicitud no fue enviada.", variant: 'destructive' });
      }
      // Clean up URL param after showing toast
      setSearchParams(params => { params.delete('payment'); return params; }, { replace: true });
    }
  }, [searchParams, toast, setSearchParams]);


  // --- EVENT HANDLERS ---
  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
        toast({
          title: "¡Solicitud enviada exitosamente! 🎵",
          description: `Tu solicitud de "${formData.songName}" por ${formData.artistName} ha sido guardada. Procede con el pago para confirmarla.`,
        });
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

  // --- RENDER LOGIC ---
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <>
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseWelcomeModal} />
      <PaymentDialog isOpen={showPayment} onClose={() => setShowPayment(false)} paymentUrl={paymentUrl} />
      
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background & decorative elements */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${djHeroBg})` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-neon rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-electric rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <img src={djWackoMainLogo} alt="DJ Wacko Logo" className="w-12 h-12 rounded-full object-cover border-2 border-primary/50" />
              <div>
                <h2 className="text-xl font-bold text-white tracking-wider">DJ Wacko</h2>
                <p className="text-xs text-purple-300">Panel de Control</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Button variant="secondary" onClick={() => navigate('/admin')}>
                      <Crown className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                  <span className="text-sm text-gray-300 hidden sm:block">{user.email}</span>
                  <Button variant="outline" onClick={() => navigate('/user-history')} size="sm">
                    <History className="w-4 h-4 mr-2" />
                    Mi Historial
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut} size="icon" aria-label="Cerrar sesión">
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

          {/* Main Content */}
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

          {/* Footer */}
          <footer className="w-full p-4 bg-black bg-opacity-30 mt-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-lg font-semibold text-white mb-3"><MessageCircle className="inline-block mr-2"/> Contacto y Descargas</h3>
              <div className="flex justify-center items-center gap-4 flex-wrap">
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