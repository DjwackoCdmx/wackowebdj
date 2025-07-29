import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import type { SavedSong } from "@/hooks/useUserHistory";

interface SavedItemProps {
  song: SavedSong;
  index: number;
  handlePlaySavedSong: (song: SavedSong) => void;
  handleRemoveSavedSong: (songId: string) => void;
}

export const SavedItem = ({ song, index, handlePlaySavedSong, handleRemoveSavedSong }: SavedItemProps) => (
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
            Pedir de nuevo
          </Button>
          <Button
            onClick={() => handleRemoveSavedSong(song.id)}
            size="sm"
            variant="destructive"
            className="hover:scale-105 transition-all"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
