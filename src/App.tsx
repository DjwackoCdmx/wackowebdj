import { useState, useEffect } from 'react';
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
  const [appState, setAppState] = useState<'loading' | 'welcome' | 'ready'>('loading');

  useEffect(() => {
    const hasAccepted = localStorage.getItem('hasAcceptedWelcomeModal');

    const loadingTimer = setTimeout(() => {
      if (!hasAccepted) {
        setAppState('welcome');
      } else {
        setAppState('ready');
      }
    }, 2500); // 2.5 segundos de pantalla de carga

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleWelcomeAccept = () => {
    // Guardamos la aceptación en localStorage desde Index, pero actualizamos el estado aquí
    setAppState('ready');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AnimatePresence mode="wait">
            {appState === 'loading' && <LoadingScreen key="loading" />}
          </AnimatePresence>

          {/* Renderiza las rutas siempre, pero el contenido de la página Index se adaptará */}
          <Routes>
            <Route path="/" element={<Index appState={appState} onWelcomeAccept={handleWelcomeAccept} />} />
            <Route path="/genre/:genreName" element={<Index appState={appState} onWelcomeAccept={handleWelcomeAccept} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/history" element={<UserHistory />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

