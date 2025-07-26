import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Music, Trash2, Play, Heart, HeartOff, RefreshCw } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface UserSongRequest {
  id: string;
  song_name: string;
  artist_name: string;
  genre: string | null;
  tip_amount: number;
  payment_status: string;
  played_status: string;
  created_at: string;
  played_at: string | null;
  stripe_session_id: string | null;
}

interface SavedSong {
  id: string;
  song_name: string;
  artist_name: string;
  genre: string | null;
  tip_amount: number;
  created_at: string;
}

const UserHistory = () => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<UserSongRequest[]>([]);
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await Promise.all([fetchHistory(session.user.id), fetchSavedSongs(session.user.id)]);
    };

    getUser();
  }, [navigate]);

  const fetchHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("song_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error al cargar historial",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedSongs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_saved_songs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedSongs(data || []);
    } catch (error: any) {
      toast({
        title: "Error al cargar canciones guardadas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReorder = (request: UserSongRequest) => {
    navigate("/", {
      state: {
        prefilledData: {
          songName: request.song_name,
          artistName: request.artist_name,
          genre: request.genre || "",
          tipAmount: request.tip_amount.toString(),
        }
      }
    });
  };

  const handleSaveSong = async (request: UserSongRequest) => {
    try {
      const { error } = await supabase
        .from("user_saved_songs")
        .insert({
          user_id: user?.id,
          song_name: request.song_name,
          artist_name: request.artist_name,
          genre: request.genre,
          tip_amount: request.tip_amount,
        });

      if (error) throw error;

      toast({
        title: "Canción guardada",
        description: "La canción se guardó en tus favoritos.",
      });

      if (user?.id) {
        await fetchSavedSongs(user.id);
      }
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveSavedSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from("user_saved_songs")
        .delete()
        .eq("id", songId);

      if (error) throw error;

      toast({
        title: "Canción eliminada",
        description: "La canción se eliminó de tus favoritos.",
      });

      if (user?.id) {
        await fetchSavedSongs(user.id);
      }
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePlaySavedSong = (song: SavedSong) => {
    navigate("/", {
      state: {
        prefilledData: {
          songName: song.song_name,
          artistName: song.artist_name,
          genre: song.genre || "",
          tipAmount: song.tip_amount.toString(),
        }
      }
    });
  };

  const getStatusBadge = (paymentStatus: string, playedStatus: string) => {
    if (playedStatus === "completed") {
      return <Badge className="bg-green-500 text-white">Reproducida</Badge>;
    }
    if (playedStatus === "playing") {
      return <Badge className="bg-blue-500 text-white">Reproduciéndose</Badge>;
    }
    if (paymentStatus === "paid" || paymentStatus === "verified") {
      return <Badge className="bg-yellow-500 text-white">En Cola</Badge>;
    }
    return <Badge variant="outline">Pendiente</Badge>;
  };

  const isSongSaved = (songName: string, artistName: string) => {
    return savedSongs.some(saved => 
      saved.song_name === songName && saved.artist_name === artistName
    );
  };

  const refreshData = async () => {
    if (user?.id) {
      setLoading(true);
      await Promise.all([fetchHistory(user.id), fetchSavedSongs(user.id)]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          
          <Button
            onClick={refreshData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setActiveTab('history')}
            variant={activeTab === 'history' ? 'default' : 'outline'}
            className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
          >
            Mi Historial
          </Button>
          <Button
            onClick={() => setActiveTab('saved')}
            variant={activeTab === 'saved' ? 'default' : 'outline'}
            className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
          >
            Mis Favoritos
          </Button>
        </div>

        {activeTab === 'history' && (
          <div className="space-y-4">
            <Card className="backdrop-blur-sm bg-card/80 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Mi Historial de Solicitudes
                </CardTitle>
                <CardDescription>
                  Historial completo de tus solicitudes musicales
                </CardDescription>
              </CardHeader>
            </Card>

            {requests.length === 0 ? (
              <Card className="backdrop-blur-sm bg-card/80">
                <CardContent className="text-center py-8">
                  <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Aún no has hecho ninguna solicitud musical.
                  </p>
                  <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all">
                    Hacer mi primera solicitud
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {requests.map((request, index) => (
                  <Card key={request.id} className="backdrop-blur-sm bg-card/80 hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-bold text-lg">{request.song_name}</h3>
                            {getStatusBadge(request.payment_status, request.played_status)}
                          </div>
                          
                          <p className="text-muted-foreground mb-2">
                            <strong>Artista:</strong> {request.artist_name}
                          </p>
                          
                          {request.genre && (
                            <p className="text-muted-foreground mb-2">
                              <strong>Género:</strong> {request.genre}
                            </p>
                          )}
                          
                          <p className="text-muted-foreground mb-2">
                            <strong>Propina:</strong> ${request.tip_amount}
                          </p>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Solicitada:</strong> {new Date(request.created_at).toLocaleDateString()}
                          </p>
                          
                          {request.played_at && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Reproducida:</strong> {new Date(request.played_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleReorder(request)}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Pedir de nuevo
                          </Button>
                          
                          <Button
                            onClick={() => handleSaveSong(request)}
                            size="sm"
                            variant="outline"
                            disabled={isSongSaved(request.song_name, request.artist_name)}
                            className="hover:scale-105 transition-all"
                          >
                            <Heart className={`w-4 h-4 mr-2 ${isSongSaved(request.song_name, request.artist_name) ? 'fill-current' : ''}`} />
                            {isSongSaved(request.song_name, request.artist_name) ? 'Guardada' : 'Guardar'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-4">
            <Card className="backdrop-blur-sm bg-card/80 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Mis Canciones Favoritas
                </CardTitle>
                <CardDescription>
                  Tus canciones guardadas para solicitar rápidamente
                </CardDescription>
              </CardHeader>
            </Card>

            {savedSongs.length === 0 ? (
              <Card className="backdrop-blur-sm bg-card/80">
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No tienes canciones guardadas aún.
                  </p>
                  <Button onClick={() => setActiveTab('history')} variant="outline" className="hover:scale-105 transition-all">
                    Ver mi historial
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {savedSongs.map((song, index) => (
                  <Card key={song.id} className="backdrop-blur-sm bg-card/80 hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{song.song_name}</h3>
                          
                          <p className="text-muted-foreground mb-2">
                            <strong>Artista:</strong> {song.artist_name}
                          </p>
                          
                          {song.genre && (
                            <p className="text-muted-foreground mb-2">
                              <strong>Género:</strong> {song.genre}
                            </p>
                          )}
                          
                          <p className="text-muted-foreground mb-2">
                            <strong>Propina guardada:</strong> ${song.tip_amount}
                          </p>
                          
                          <p className="text-sm text-muted-foreground">
                            <strong>Guardada:</strong> {new Date(song.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handlePlaySavedSong(song)}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Solicitar
                          </Button>
                          
                          <Button
                            onClick={() => handleRemoveSavedSong(song.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-50 hover:scale-105 transition-all"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHistory;