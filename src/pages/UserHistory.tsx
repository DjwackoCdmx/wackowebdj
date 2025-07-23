import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Music, RefreshCw, Repeat } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface UserSongRequest {
  id: string;
  song_name: string;
  artist_name: string;
  genre?: string;
  tip_amount: number;
  requester_name?: string;
  created_at: string;
  payment_status: string;
  played_status: string;
  played_at?: string;
}

const UserHistory = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<UserSongRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user]);

  const fetchUserHistory = async () => {
    if (!user?.email) return;
    
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .eq('requester_name', user.email) // Assuming we store user email as requester_name for logged-in users
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching user history:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar tu historial",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleReorder = (request: UserSongRequest) => {
    // Pre-fill form data and navigate to main page
    const formData = {
      songName: request.song_name,
      artistName: request.artist_name,
      genre: request.genre || '',
      tip: request.tip_amount.toString(),
      requesterName: request.requester_name || '',
      telegram: ''
    };
    
    localStorage.setItem('reorderData', JSON.stringify(formData));
    navigate('/');
  };

  const getStatusBadge = (paymentStatus: string, playedStatus: string) => {
    if (playedStatus === 'completed') {
      return <Badge className="bg-green-600">Reproducida</Badge>;
    }
    if (playedStatus === 'playing') {
      return <Badge className="bg-blue-600">Reproduciendo</Badge>;
    }
    if (paymentStatus === 'verified') {
      return <Badge className="bg-yellow-600">En cola</Badge>;
    }
    return <Badge variant="outline">Pendiente pago</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Historial</h1>
            <p className="text-muted-foreground">Revisa tus canciones solicitadas</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchUserHistory}
            disabled={refreshing}
            className="ml-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay canciones aún</h3>
              <p className="text-muted-foreground mb-4">
                Aún no has solicitado ninguna canción
              </p>
              <Button onClick={() => navigate('/')}>
                Solicitar primera canción
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map((request) => (
              <Card key={request.id} className="bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Music className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">
                          {request.song_name}
                        </h3>
                        {getStatusBadge(request.payment_status, request.played_status)}
                      </div>
                      <p className="text-muted-foreground mb-1">
                        <strong>Artista:</strong> {request.artist_name}
                      </p>
                      {request.genre && (
                        <p className="text-muted-foreground mb-1">
                          <strong>Género:</strong> {request.genre}
                        </p>
                      )}
                      <p className="text-muted-foreground mb-1">
                        <strong>Propina:</strong> ${request.tip_amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Solicitada: {new Date(request.created_at).toLocaleString('es-ES')}
                      </p>
                      {request.played_at && (
                        <p className="text-xs text-muted-foreground">
                          Reproducida: {new Date(request.played_at).toLocaleString('es-ES')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleReorder(request)}
                      className="ml-4"
                    >
                      <Repeat className="w-4 h-4 mr-2" />
                      Volver a pedir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHistory;