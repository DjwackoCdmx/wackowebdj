import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from '@/components/layout/LoadingScreen';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import Index from './pages/Index';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Terms from './pages/Terms';
import UserHistory from './pages/UserHistory';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';

const queryClient = new QueryClient();

const AppWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay for demo

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/genre/:genreName" element={<Index />} />
            <Route 
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/history" element={<UserHistory />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppWrapper />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
