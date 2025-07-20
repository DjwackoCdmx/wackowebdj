import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("session_id is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Verify payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update payment status
    const { error: paymentError } = await supabaseService
      .from("payments")
      .update({
        status: session.payment_status === "paid" ? "completed" : "failed",
        stripe_payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session_id);

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
    }

    // Update song request payment status
    if (session.payment_status === "paid") {
      const { error: requestError } = await supabaseService
        .from("song_requests")
        .update({
          payment_status: "paid",
          payment_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session_id);

      if (requestError) {
        console.error("Error updating song request:", requestError);
      }
    }

    return new Response(JSON.stringify({ 
      payment_status: session.payment_status,
      session: session 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});