import { supabase } from './supabase.js';
import { SYSTEM_PROMPT, FIELD_PROMPTS, AI_MODEL, AI_TEMPERATURE } from './prompts.js';

export async function improveText(fieldKey, rawText) {
  if (!rawText?.trim()) {
    throw new Error("Le champ est vide. Saisissez des notes avant d'utiliser l'assistant IA.");
  }

  const fieldPrompt = FIELD_PROMPTS[fieldKey] ?? `Reformule ces notes en texte professionnel technique.`;

  const { data, error } = await supabase.functions.invoke('improve-text', {
    body: {
      text: rawText,
      model: AI_MODEL,
      temperature: AI_TEMPERATURE,
      systemPrompt: SYSTEM_PROMPT,
      fieldPrompt,
    },
  });

  if (error) throw new Error(error.message ?? "Erreur lors de l'appel à l'IA.");
  if (data?.error) throw new Error(data.error);
  if (!data?.result) throw new Error("Réponse vide reçue de l'IA.");

  return data.result;
}
