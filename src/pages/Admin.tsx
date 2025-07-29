import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Music, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { SongRequest, UserProfile } from "@/types";

// Import the new modular components
import AdminLoginForm from "@/components/admin-components/AdminLoginForm";
import AdminDashboard from "@/components/admin-components/AdminDashboard";

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [history, setHistory] = useState<SongRequest[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // --- DATA FETCHING & HANDLERS ---
  const fetchRequests = useCallback(async () => {
    try {
      const { data: pendingRequests, error: pendingError } = await supabase
        .from('song_requests')
        .select('*')
        .in('played_status', ['pending', 'playing'])
        .order('tip_amount', { ascending: false })
        .order('created_at', { ascending: true });

      if (pendingError) throw pendingError;

      const { data: playedRequests, error: playedError } = await supabase
        .from('song_requests')
        .select('*')
        .eq('played_status', 'completed')
        .order('played_at', { ascending: false });

      if (playedError) throw playedError;

      setRequests(pendingRequests || []);
      setHistory(playedRequests || []);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching requests:', err);
      toast({ title: "Error", description: `No se pudieron cargar las solicitudes: ${err.message}`, variant: "destructive" });
    }
  }, [toast]);

  const fetchOnlineUsers = useCallback(async () => {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data: recentRequests, error: requestsError } = await supabase
        .from('song_requests')
        .select('user_id')
        .gte('created_at', thirtyMinutesAgo)
        .not('user_id', 'is', null);

      if (requestsError) throw requestsError;

      const userIds = [...new Set(recentRequests?.map(r => r.user_id).filter(Boolean))];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;
        setOnlineUsers(profiles || []);
      } else {
        setOnlineUsers([]);
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching online users:', err);
      toast({ title: "Error", description: `No se pudieron cargar los usuarios en línea: ${err.message}`, variant: "destructive" });
    }
  }, [toast]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchRequests(), fetchOnlineUsers()]);
    } catch (error) {
      const err = error as Error;
      console.error('Error during refresh:', err);
      toast({ title: "Error", description: `Ocurrió un error al actualizar los datos: ${err.message}`, variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  }, [fetchRequests, fetchOnlineUsers, toast]);

  // --- AUTHENTICATION ---
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      handleRefresh();
    }
  }, [user, handleRefresh]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "¡Bienvenido DJ Wacko!", description: "Acceso concedido al panel de administración" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error desconocido";
      toast({ title: "Error de acceso", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw error;
      toast({ title: "Email enviado", description: "Revisa tu correo para restablecer tu contraseña" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error desconocido";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente" });
  };

  // --- SONG REQUEST ACTIONS ---
  const handlePlay = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', { body: { action: 'play', id } });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      const request = requests.find(r => r.id === id);
      if (request) {
        toast({ title: "🎵 Reproduciendo", description: `${request.song_name} - ${request.artist_name}` });
      }
      fetchRequests();
    } catch (error) {
      const err = error as Error;
      console.error('Error playing song:', err);
      toast({ title: "Error", description: `No se pudo marcar como reproduciendo: ${err.message}`, variant: "destructive" });
    }
  };

  const handleFinish = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', { body: { action: 'complete', id } });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      const request = requests.find(r => r.id === id) || history.find(h => h.id === id);
      if (request) {
        toast({ title: "✅ Canción finalizada", description: `${request.song_name} - ${request.artist_name}` });
      }
      fetchRequests();
    } catch (error) {
      const err = error as Error;
      console.error('Error finishing song:', err);
      toast({ title: "Error", description: `No se pudo finalizar la canción: ${err.message}`, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', { body: { action: 'delete', id } });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      toast({ title: "Solicitud eliminada", description: "La solicitud ha sido removida" });
      fetchRequests();
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting request:', err);
      toast({ title: "Error", description: `No se pudo eliminar la solicitud: ${err.message}`, variant: "destructive" });
    }
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AdminLoginForm 
          onLogin={handleLogin}
          onResetPassword={handleResetPassword}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Panel DJ Wacko</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
        
        <AdminDashboard
          requests={requests}
          history={history}
          onlineUsers={onlineUsers}
          onPlay={handlePlay}
          onFinish={handleFinish}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Admin;