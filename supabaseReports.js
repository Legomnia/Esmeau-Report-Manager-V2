import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey && supabase);
}

// Maps a React report object → Supabase row (camelCase, matching table schema)
function reportToRow(r) {
  return {
    id: r.id,
    date: r.date || new Date().toISOString().split('T')[0],
    status: r.status ?? 'brouillon',
    clientCivilite: r.clientCivilite ?? '',
    clientNom: r.clientNom ?? '',
    clientPrenom: r.clientPrenom ?? '',
    clientPhone: r.clientPhone ?? '',
    clientEmail: r.clientEmail ?? '',
    address: r.address ?? '',
    interventionAddress: r.interventionAddress ?? '',
    problemType: r.problemType ?? '',
    tiersType: r.tiersType ?? '',
    tiersNom: r.tiersNom ?? '',
    tiersContact: r.tiersContact ?? '',
    tiersAssurance: r.tiersAssurance ?? '',
    demandeurType: r.demandeurType ?? '',
    demandeurNom: r.demandeurNom ?? '',
    demandeurContact: r.demandeurContact ?? '',
    dateFirstManif: r.dateFirstManif ?? '',
    interventionsAnterieures: r.interventionsAnterieures ?? '',
    objet: r.objet ?? '',
    constatations: r.constatations ?? '',
    surfaceAffectee: r.surfaceAffectee ?? '',
    signesAlerte: r.signesAlerte ?? '',
    batiment: r.batiment ?? '',
    alimentationConfig: r.alimentationConfig ?? '',
    alimentationComposition: r.alimentationComposition ?? '',
    alimentationPointsAcces: r.alimentationPointsAcces ?? '',
    alimentationNotes: r.alimentationNotes ?? '',
    alimentationECS: r.alimentationECS ?? '',
    alimentationECSType: r.alimentationECSType ?? '',
    alimentationChauffage: r.alimentationChauffage ?? '',
    alimentationChauffageType: r.alimentationChauffageType ?? '',
    alimentationEvacuations: r.alimentationEvacuations ?? '',
    alimentationEvacuationsNotes: r.alimentationEvacuationsNotes ?? '',
    alimentationIsolation: r.alimentationIsolation ?? '',
    conclusion: r.conclusion ?? '',
    recommandations: r.recommandations ?? '',
    riskResiduel: r.riskResiduel ?? '',
    assurabilite: r.assurabilite ?? '',
    urgence: r.urgence ?? '',
    responsabiliteExecution: r.responsabiliteExecution ?? '',
    degats: r.degats ?? [],
    investigation: r.investigation ?? [],
    moyens: r.moyens ?? {},
    etapes: r.etapes ?? [],
    sectionPhotos: r.sectionPhotos ?? {},
  };
}

// Maps a Supabase row → React report object
function rowToReport(row) {
  return {
    id: row.id,
    date: row.date,
    status: row.status,
    clientCivilite: row.clientCivilite,
    clientNom: row.clientNom,
    clientPrenom: row.clientPrenom,
    clientPhone: row.clientPhone,
    clientEmail: row.clientEmail,
    address: row.address,
    interventionAddress: row.interventionAddress,
    problemType: row.problemType,
    tiersType: row.tiersType,
    tiersNom: row.tiersNom,
    tiersContact: row.tiersContact,
    tiersAssurance: row.tiersAssurance,
    demandeurType: row.demandeurType,
    demandeurNom: row.demandeurNom,
    demandeurContact: row.demandeurContact,
    dateFirstManif: row.dateFirstManif,
    interventionsAnterieures: row.interventionsAnterieures,
    objet: row.objet,
    constatations: row.constatations,
    surfaceAffectee: row.surfaceAffectee,
    signesAlerte: row.signesAlerte,
    batiment: row.batiment,
    alimentationConfig: row.alimentationConfig,
    alimentationComposition: row.alimentationComposition,
    alimentationPointsAcces: row.alimentationPointsAcces,
    alimentationNotes: row.alimentationNotes,
    alimentationECS: row.alimentationECS,
    alimentationECSType: row.alimentationECSType,
    alimentationChauffage: row.alimentationChauffage,
    alimentationChauffageType: row.alimentationChauffageType,
    alimentationEvacuations: row.alimentationEvacuations,
    alimentationEvacuationsNotes: row.alimentationEvacuationsNotes,
    alimentationIsolation: row.alimentationIsolation,
    conclusion: row.conclusion,
    recommandations: row.recommandations,
    riskResiduel: row.riskResiduel,
    assurabilite: row.assurabilite,
    urgence: row.urgence,
    responsabiliteExecution: row.responsabiliteExecution,
    degats: row.degats ?? [],
    investigation: row.investigation ?? [],
    moyens: row.moyens ?? {},
    etapes: row.etapes ?? [],
    sectionPhotos: row.sectionPhotos ?? {},
  };
}

export const reportsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data.map(rowToReport);
  },

  async upsert(report) {
    const { error } = await supabase
      .from('reports')
      .upsert(reportToRow(report), { onConflict: 'id' });
    if (error) throw error;
  },

  async delete(id) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
