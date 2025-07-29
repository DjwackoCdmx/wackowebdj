import { useState, useEffect } from 'react';
import { supabase } from './integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from './components/custom/LoadingScreen';
import Index from './pages/Index';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Terms from './pages/Terms';
import UserHistory from './pages/UserHistory';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
      setLoading(false); // Auth state is now confirmed, hide loading screen.
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          {loading ? (
            <LoadingScreen key="loading" />
          ) : (
            <Routes>
              <Route path="/" element={<Index user={user} isAdmin={isAdmin} />} />
              <Route path="/genre/:genreName" element={<Index user={user} isAdmin={isAdmin} />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/history" element={<UserHistory />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

