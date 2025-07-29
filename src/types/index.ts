import type { Database } from './database.types';

// Extrayendo los tipos de las tablas de Supabase para mantenerlos sincronizados.
// Esto nos da type-safety basado en el esquema real de la base de datos.

/**
 * Perfil de usuario, directamente del esquema de la tabla `user_profiles`.
 */
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

/**
 * Solicitud de canción, directamente del esquema de la tabla `song_requests`.
 */
export type SongRequest = Database['public']['Tables']['song_requests']['Row'];
