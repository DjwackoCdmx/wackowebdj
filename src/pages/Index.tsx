import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { WelcomeModal } from '@/components/page-components/WelcomeModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/page-components/MainContent";
import { Footer } from "@/components/layout/Footer";
import backgroundImage from '@/assets/dj-hero-bg.jpg';

interface SongFormData {
  songName: string;
  artistName: string;
  genre: string;
  requesterName: string;
  telegram: string;
}

const Index = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isRequestTimeAllowed, setIsRequestTimeAllowed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setShowWelcomeModal(true);
  }, []);

  const handleCloseWelcomeModal = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setShowWelcomeModal(false);
  };

  const checkAdminStatus = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase.rpc('is_admin' as any);
      if (error) throw error;
      setIsAdmin(data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }, []);

  const checkRequestTime = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase.rpc('is_request_time_allowed' as any);
      if (error) {
        throw error;
      }
      setIsRequestTimeAllowed(data);
    } catch (error) {
      console.error('Error checking request time:', error);
      setIsRequestTimeAllowed(false); // Default to false on error
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    checkRequestTime();

    const currentUser = supabase.auth.getUser();
    currentUser.then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        checkAdminStatus(user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus, checkRequestTime]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
    } else {
      setUser(null);
      setIsAdmin(false);
      navigate('/');
      toast.success("Has cerrado sesión exitosamente");
    }
  };

  const handleFormSubmit = async (formData: SongFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('song_requests').insert([{
        song_name: formData.songName,
        artist_name: formData.artistName,
        genre: formData.genre,
        requester_name: formData.requesterName,
        telegram_username: formData.telegram,
        user_id: user?.id,
        tip_amount: 0 // Default value
      }]);

      if (error) {
        throw new Error(error.message);
      }
      toast.success("¡Tu canción ha sido solicitada con éxito!");
      setShowPaymentDialog(true);
    } catch (error: unknown) {
      console.error('Error submitting song request:', error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      toast.error(`Error al solicitar la canción: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      toast.success("¡Gracias por tu apoyo! Tu pago ha sido procesado.");
    }
    if (searchParams.get('payment') === 'cancelled') {
      toast.info("El pago fue cancelado. Puedes intentarlo de nuevo más tarde.");
    }
  }, [searchParams]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-black bg-opacity-70">
        <Toaster position="top-center" richColors />
        
        <AnimatePresence>
          {showWelcomeModal && <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseWelcomeModal} />}
        </AnimatePresence>

        <Header user={user} isAdmin={isAdmin} onLogout={handleLogout} />
        <MainContent
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          isRequestTimeAllowed={isRequestTimeAllowed}
        />
        <Footer />

        {/* Payment Dialog remains the same */}
        <AnimatePresence>
          {showPaymentDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            >
              <Dialog open={showPaymentDialog} onOpenChange={() => setShowPaymentDialog(false)}>
                <DialogContent className="bg-gray-900 text-white border-green-500/20 shadow-lg">
                  <DialogHeader>
                    <DialogTitle>¡Solicitud Recibida!</DialogTitle>
                    <DialogDescription>
                      Tu solicitud ha sido enviada. Para agilizar el proceso, por favor realiza tu pago y envía el comprobante por WhatsApp.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => window.open('https://wa.me/5256441274646', '_blank')}>Ir a WhatsApp</Button>
                    <Button variant="secondary" onClick={() => setShowPaymentDialog(false)}>Cerrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;