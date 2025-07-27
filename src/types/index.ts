export interface SongRequest {
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
  user_id?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  created_at: string;
  updated_at: string;
  is_online?: boolean;
}
