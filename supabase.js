import { createClient } from '@supabase/supabase-js';

// Configuration Supabase - À remplacer avec vos clés réelles
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Vérifier si Supabase est configuré
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY';
};

// Fonctions CRUD pour les rapports
export const reportsAPI = {
  // Récupérer tous les rapports
  getAll: async () => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      return null;
    }
  },

  // Créer un nouveau rapport
  create: async (report) => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([report])
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erreur lors de la création du rapport:', error);
      return null;
    }
  },

  // Mettre à jour un rapport
  update: async (id, report) => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(report)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rapport:', error);
      return null;
    }
  },

  // Supprimer un rapport
  delete: async (id) => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du rapport:', error);
      return false;
    }
  }
};
