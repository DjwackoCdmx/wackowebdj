import { useUserHistory } from "@/hooks/useUserHistory";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Music, Heart } from "lucide-react";
import { HistoryTabs } from "@/components/history-page/HistoryTabs";
import { RequestList } from "@/components/history-page/RequestList";
import { SavedList } from "@/components/history-page/SavedList";

const UserHistory = () => {
  const {
    loading,
    requests,
    savedSongs,
    activeTab,
    setActiveTab,
    handleReorder,
    handleSaveSong,
    isSongSaved,
    handlePlaySavedSong,
    handleRemoveSavedSong,
    refreshData,
    navigate
  } = useUserHistory();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate("/")} variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>

        <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'history' ? (
          <div className="space-y-4">
            <Card className="backdrop-blur-sm bg-card/80 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Mi Historial de Solicitudes
                </CardTitle>
                <CardDescription>Historial completo de tus solicitudes musicales</CardDescription>
              </CardHeader>
            </Card>
            <RequestList 
              requests={requests} 
              handleReorder={handleReorder} 
              handleSaveSong={handleSaveSong} 
              isSongSaved={isSongSaved} 
              goToFirstRequest={() => navigate("/")}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="backdrop-blur-sm bg-card/80 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Mis Canciones Favoritas
                </CardTitle>
                <CardDescription>Tus canciones guardadas para solicitar rápidamente</CardDescription>
              </CardHeader>
            </Card>
            <SavedList 
              savedSongs={savedSongs} 
              handlePlaySavedSong={handlePlaySavedSong} 
              handleRemoveSavedSong={handleRemoveSavedSong} 
              goToHistory={() => setActiveTab('history')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHistory;