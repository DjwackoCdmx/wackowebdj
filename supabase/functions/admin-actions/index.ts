import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, id } = await req.json();

    if (!action || !id) {
      throw new Error("action and id are required");
    }

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let result;

    switch (action) {
      case "play":
        result = await supabaseService
          .from("song_requests")
          .update({ 
            played_status: 'playing',
            played_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        break;

      case "complete":
        result = await supabaseService
          .from("song_requests")
          .update({ 
            played_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        break;

      case "delete":
        result = await supabaseService
          .from("song_requests")
          .delete()
          .eq('id', id);
        break;

      default:
        throw new Error("Invalid action");
    }

    if (result.error) throw result.error;

    return new Response(JSON.stringify({ 
      success: true, 
      data: result.data,
      message: `Action ${action} completed successfully`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in admin-actions:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});