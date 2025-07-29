import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

// Define interfaces right in the hook file for clarity
export interface UserSongRequest {
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

export interface SavedSong {
  id: string;
  song_name: string;
  artist_name: string;
  genre: string | null;
  tip_amount: number;
  created_at: string;
}

export const useUserHistory = () => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<UserSongRequest[]>([]);
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchHistory = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("song_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (error: unknown) {
      toast({ title: "Error al cargar historial", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    }
  }, [toast]);

  const fetchSavedSongs = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_saved_songs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSavedSongs(data || []);
    } catch (error: unknown) {
      toast({ title: "Error al cargar canciones guardadas", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    const getUserAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(true);
      await Promise.all([fetchHistory(session.user.id), fetchSavedSongs(session.user.id)]);
      setLoading(false);
    };
    getUserAndData();
  }, [navigate, fetchHistory, fetchSavedSongs]);

  const handleSaveSong = async (request: UserSongRequest) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("user_saved_songs").insert({ user_id: user.id, song_name: request.song_name, artist_name: request.artist_name, genre: request.genre, tip_amount: request.tip_amount });
      if (error) throw error;
      toast({ title: "Canción guardada", description: "La canción se guardó en tus favoritos." });
      await fetchSavedSongs(user.id);
    } catch (error: unknown) {
      toast({ title: "Error al guardar", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    }
  };

  const handleRemoveSavedSong = async (songId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("user_saved_songs").delete().eq("id", songId);
      if (error) throw error;
      toast({ title: "Canción eliminada", description: "La canción se eliminó de tus favoritos." });
      await fetchSavedSongs(user.id);
    } catch (error: unknown) {
      toast({ title: "Error al eliminar", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    }
  };

  const handlePlaySavedSong = (song: SavedSong) => {
    navigate("/", { state: { prefilledData: { songName: song.song_name, artistName: song.artist_name, genre: song.genre || "", tipAmount: song.tip_amount.toString() } } });
  };

  const handleReorder = (request: UserSongRequest) => {
    navigate("/", { state: { prefilledData: { songName: request.song_name, artistName: request.artist_name, genre: request.genre || "", tipAmount: request.tip_amount.toString() } } });
  };

  const isSongSaved = (songName: string, artistName: string) => {
    return savedSongs.some(saved => saved.song_name === songName && saved.artist_name === artistName);
  };

  const refreshData = async () => {
    if (user?.id) {
      setLoading(true);
      await Promise.all([fetchHistory(user.id), fetchSavedSongs(user.id)]);
      setLoading(false);
    }
  };

  return {
    user,
    requests,
    savedSongs,
    loading,
    activeTab,
    setActiveTab,
    handleSaveSong,
    handleRemoveSavedSong,
    handlePlaySavedSong,
    handleReorder,
    isSongSaved,
    refreshData,
    navigate
  };
};
