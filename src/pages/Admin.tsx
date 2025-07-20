import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Play, Square, Trash2, Clock, DollarSign, MessageSquare, CheckCircle2, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface SongRequest {
  id: string;
  song_name: string;
  artist_name: string;
  genre?: string;
  tip_amount: number;
  requester_name?: string;
  telegram_username?: string;
  created_at: string;
  payment_status: string;
  played_status: string;
  played_at?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [history, setHistory] = useState<SongRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setRefreshing(true);
      const { data: pendingRequests, error: pendingError } = await supabase
        .from('song_requests')
        .select('*')
        .eq('played_status', 'pending')
        .order('tip_amount', { ascending: false })
        .order('created_at', { ascending: true });

      const { data: playedRequests, error: playedError } = await supabase
        .from('song_requests')
        .select('*')
        .in('played_status', ['playing', 'completed'])
        .order('played_at', { ascending: false });

      if (pendingError) throw pendingError;
      if (playedError) throw playedError;

      setRequests(pendingRequests || []);
      setHistory(playedRequests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;

      toast({
        title: "¡Bienvenido DJ Wacko!",
        description: "Acceso concedido al panel de administración"
      });
    } catch (error: any) {
      toast({
        title: "Error de acceso",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Revisa tu correo para restablecer tu contraseña"
      });
      setShowResetPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    });
  };

  const handlePlay = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'play', id }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      const request = requests.find(r => r.id === id);
      if (request) {
        toast({
          title: "🎵 Reproduciendo",
          description: `${request.song_name} - ${request.artist_name}`
        });
      }

      fetchRequests();
    } catch (error) {
      console.error('Error playing song:', error);
      toast({
        title: "Error",
        description: "No se pudo marcar como reproduciendo",
        variant: "destructive"
      });
    }
  };

  const handleFinish = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'complete', id }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      const request = history.find(h => h.id === id);
      if (request) {
        toast({
          title: "✅ Canción finalizada",
          description: `${request.song_name} - ${request.artist_name}`
        });
      }

      fetchRequests();
    } catch (error) {
      console.error('Error finishing song:', error);
      toast({
        title: "Error",
        description: "No se pudo finalizar la canción",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'delete', id }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Solicitud eliminada",
        description: "La solicitud ha sido removida"
      });

      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la solicitud",
        variant: "destructive"
      });
    }
  };

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
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <Music className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">🎧 DJ Admin Panel</CardTitle>
            <CardDescription>Acceso exclusivo para DJ Wacko</CardDescription>
          </CardHeader>
          <CardContent>
            {!showResetPassword ? (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="djwacko@outlook.es"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="bg-background/50 border-primary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="bg-background/50 border-primary/30"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Iniciando...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setShowResetPassword(true)}
                    className="text-primary"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email de recuperación</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="djwacko@outlook.es"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="bg-background/50 border-primary/30"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Email de Recuperación"
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowResetPassword(false)}
                  className="w-full"
                >
                  Volver al Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Panel DJ Wacko</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchRequests}
              disabled={refreshing}
            >
              {refreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <Tabs defaultValue="queue" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="queue" className="text-lg">
              🎵 Cola de Solicitudes ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="text-lg">
              📋 Historial ({history.length})
            </TabsTrigger>
          </TabsList>

          {/* Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            {requests.length === 0 ? (
              <Card className="bg-card/50 border-muted">
                <CardContent className="text-center py-12">
                  <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground">
                    No hay solicitudes pendientes
                  </h3>
                  <p className="text-muted-foreground">
                    Las nuevas solicitudes aparecerán aquí ordenadas por propina
                  </p>
                </CardContent>
              </Card>
            ) : (
              requests.map((request, index) => (
                <Card key={request.id} className="bg-card/80 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Badge variant="outline" className="bg-gradient-neon text-white">
                            ${request.tip_amount.toFixed(2)} USD
                          </Badge>
                          {request.genre && (
                            <Badge variant="secondary">
                              {request.genre}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground">
                          {request.song_name}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          {request.artist_name}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(request.created_at).toLocaleString()}
                          </div>
                          {request.requester_name && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {request.requester_name}
                            </div>
                          )}
                          {request.telegram_username && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {request.telegram_username}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                          size="lg"
                          onClick={() => handlePlay(request.id)}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Reproducir
                        </Button>
                        <Button
                          variant="destructive"
                          size="lg"
                          onClick={() => handleDelete(request.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <Card className="bg-card/50 border-muted">
                <CardContent className="text-center py-12">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground">
                    Sin historial aún
                  </h3>
                  <p className="text-muted-foreground">
                    Las canciones reproducidas aparecerán aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              history.map((item) => (
                <Card key={item.id} className="bg-card/80 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant={item.played_status === "playing" ? "default" : "secondary"}
                            className={item.played_status === "playing" ? "bg-gradient-electric text-white animate-pulse" : ""}
                          >
                            {item.played_status === "playing" ? "🔊 Reproduciendo" : "✅ Completada"}
                          </Badge>
                          <Badge variant="outline">
                            ${item.tip_amount.toFixed(2)} USD
                          </Badge>
                          {item.genre && (
                            <Badge variant="secondary">
                              {item.genre}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground">
                          {item.song_name}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          {item.artist_name}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Solicitada: {new Date(item.created_at).toLocaleString()}
                          </div>
                          {item.played_at && (
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              Reproducida: {new Date(item.played_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        {(item.requester_name || item.telegram_username) && (
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {item.requester_name && (
                              <span>{item.requester_name}</span>
                            )}
                            {item.telegram_username && (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {item.telegram_username}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.played_status === "playing" && (
                          <Button
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                            size="lg"
                            onClick={() => handleFinish(item.id)}
                          >
                            <Square className="w-5 h-5 mr-2" />
                            Finalizar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => handleDelete(item.id)}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;