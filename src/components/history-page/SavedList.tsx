import { SavedItem } from "./SavedItem";
import { HistoryEmptyState } from "./HistoryEmptyState";
import type { SavedSong } from "@/hooks/useUserHistory";

interface SavedListProps {
  savedSongs: SavedSong[];
  handlePlaySavedSong: (song: SavedSong) => void;
  handleRemoveSavedSong: (songId: string) => void;
  goToHistory: () => void;
}

export const SavedList = ({ savedSongs, handlePlaySavedSong, handleRemoveSavedSong, goToHistory }: SavedListProps) => {
  if (savedSongs.length === 0) {
    return <HistoryEmptyState type="saved" onActionClick={goToHistory} />;
  }

  return (
    <div className="grid gap-4">
      {savedSongs.map((song, index) => (
        <SavedItem
          key={song.id}
          song={song}
          index={index}
          handlePlaySavedSong={handlePlaySavedSong}
          handleRemoveSavedSong={handleRemoveSavedSong}
        />
      ))}
    </div>
  );
};
