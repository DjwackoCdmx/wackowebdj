import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Heart } from "lucide-react";
import type { UserSongRequest } from "@/hooks/useUserHistory";

interface RequestItemProps {
  request: UserSongRequest;
  index: number;
  handleReorder: (request: UserSongRequest) => void;
  handleSaveSong: (request: UserSongRequest) => void;
  isSongSaved: (songName: string, artistName: string) => boolean;
}

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

export const RequestItem = ({ request, index, handleReorder, handleSaveSong, isSongSaved }: RequestItemProps) => (
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
);
