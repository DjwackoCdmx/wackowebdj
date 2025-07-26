import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COINBASE_API_URL = "https://api.commerce.coinbase.com/charges";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { song_request_id, amount, currency = "usd" } = await req.json();

    if (!song_request_id || !amount) {
      throw new Error("song_request_id and amount are required");
    }

    const coinbaseApiKey = Deno.env.get("COINBASE_COMMERCE_API_KEY");
    if (!coinbaseApiKey) {
      throw new Error("Coinbase API key is not set");
    }

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: songRequest, error: fetchError } = await supabaseService
      .from("song_requests")
      .select("*")
      .eq("id", song_request_id)
      .single();

    if (fetchError || !songRequest) {
      throw new Error("Song request not found");
    }

    const chargeData = {
      name: `Propina para: ${songRequest.song_name} - ${songRequest.artist_name}`,
      description: `Solicitud de ${songRequest.requester_name || "Anónimo"}`,
      pricing_type: "fixed_price",
      local_price: {
        amount: amount.toString(),
        currency: currency,
      },
      metadata: {
        song_request_id: song_request_id,
      },
      redirect_url: `${req.headers.get("origin")}/?payment=success&coinbase=true`,
      cancel_url: `${req.headers.get("origin")}/?payment=cancelled&coinbase=true`,
    };

    const response = await fetch(COINBASE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": coinbaseApiKey,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(chargeData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error?.message || "Failed to create Coinbase charge");
    }

    const charge = responseData.data;

    await supabaseService.from("payments").insert({
      coinbase_charge_id: charge.code,
      song_request_id: song_request_id,
      amount: amount,
      currency: currency,
      status: "pending",
    });

    return new Response(JSON.stringify({ url: charge.hosted_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating Coinbase charge:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
