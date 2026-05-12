import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("Clé OpenRouter manquante — configurez le secret OPENROUTER_API_KEY dans Supabase.");
    }

    const { text, model, temperature, systemPrompt, fieldPrompt } = await req.json();

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "Le champ est vide." }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://esmeau.fr",
        "X-Title": "Esmeau Report Manager",
      },
      body: JSON.stringify({
        model: model ?? "nvidia/nemotron-3-super-120b-a12b:free",
        temperature: temperature ?? 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `${fieldPrompt}\n\nNotes brutes :\n${text.trim()}` },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter ${response.status}: ${err}`);
    }

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content?.trim();

    if (!result) throw new Error("Réponse vide reçue de l'IA.");

    return new Response(JSON.stringify({ result }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
