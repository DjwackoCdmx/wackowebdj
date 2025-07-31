import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

// Función para verificar el rol de administrador
const isAdmin = async (supabaseClient: SupabaseClient): Promise<boolean> => {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return false;
  }

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return !profileError && profile?.role === 'admin';
};

serve(async (req) => {
  // Manejo de la solicitud pre-vuelo CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' 
    } });
  }

  try {
    // 1. Crear un cliente de Supabase a partir del token de autorización del solicitante
    const client = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 2. Verificar si el solicitante es un administrador
    const isUserAdmin = await isAdmin(client);
    if (!isUserAdmin) {
      return new Response(JSON.stringify({ error: 'No autorizado. Se requiere rol de administrador.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Obtener el ID del usuario a eliminar del cuerpo de la solicitud
    const { user_id_to_delete } = await req.json();
    if (!user_id_to_delete) {
      return new Response(JSON.stringify({ error: 'Se requiere el ID del usuario a eliminar.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. Crear un cliente de servicio para realizar la eliminación
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 5. Eliminar el usuario
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id_to_delete);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(JSON.stringify({ message: 'Usuario eliminado exitosamente.' }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-control-Allow-Origin': '*' },
      status: 500,
    });
  }
});
