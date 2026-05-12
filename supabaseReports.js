import { supabase } from './supabase.js';

// ── camelCase (React) → snake_case (Supabase) ───────────────
function reportToRow(r) {
  return {
    id: r.id,
    date: r.date || new Date().toISOString().split('T')[0],
    status: r.status ?? 'brouillon',
    problem_type: r.problemType ?? '',
    client_civilite: r.clientCivilite ?? '',
    client_nom: r.clientNom ?? '',
    client_prenom: r.clientPrenom ?? '',
    client_phone: r.clientPhone ?? '',
    client_email: r.clientEmail ?? '',
    address: r.address ?? '',
    intervention_address: r.interventionAddress ?? '',
    tiers_type: r.tiersType ?? '',
    tiers_nom: r.tiersNom ?? '',
    tiers_contact: r.tiersContact ?? '',
    tiers_assurance: r.tiersAssurance ?? '',
    demandeur_type: r.demandeurType ?? '',
    demandeur_nom: r.demandeurNom ?? '',
    demandeur_contact: r.demandeurContact ?? '',
    date_first_manif: r.dateFirstManif ?? '',
    interventions_anterieures: r.interventionsAnterieures ?? '',
    objet: r.objet ?? '',
    constatations: r.constatations ?? '',
    surface_affectee: r.surfaceAffectee ?? '',
    signes_alerte: r.signesAlerte ?? '',
    batiment: r.batiment ?? '',
    alimentation_config: r.alimentationConfig ?? '',
    alimentation_composition: r.alimentationComposition ?? '',
    alimentation_points_acces: r.alimentationPointsAcces ?? '',
    alimentation_notes: r.alimentationNotes ?? '',
    alimentation_ecs: r.alimentationECS ?? '',
    alimentation_ecs_type: r.alimentationECSType ?? '',
    alimentation_chauffage: r.alimentationChauffage ?? '',
    alimentation_chauffage_type: r.alimentationChauffageType ?? '',
    alimentation_evacuations: r.alimentationEvacuations ?? '',
    alimentation_evacuations_notes: r.alimentationEvacuationsNotes ?? '',
    alimentation_isolation: r.alimentationIsolation ?? '',
    conclusion: r.conclusion ?? '',
    recommandations: r.recommandations ?? '',
    risk_residuel: r.riskResiduel ?? '',
    assurabilite: r.assurabilite ?? '',
    urgence: r.urgence ?? '',
    responsabilite_execution: r.responsabiliteExecution ?? '',
    degats: r.degats ?? [],
    investigation: r.investigation ?? [],
    moyens: r.moyens ?? {},
    etapes: r.etapes ?? [],
    section_photos: r.sectionPhotos ?? {},
  };
}

// ── snake_case (Supabase) → camelCase (React) ───────────────
function rowToReport(row) {
  return {
    id: row.id,
    date: row.date,
    status: row.status,
    problemType: row.problem_type,
    clientCivilite: row.client_civilite,
    clientNom: row.client_nom,
    clientPrenom: row.client_prenom,
    clientPhone: row.client_phone,
    clientEmail: row.client_email,
    address: row.address,
    interventionAddress: row.intervention_address,
    tiersType: row.tiers_type,
    tiersNom: row.tiers_nom,
    tiersContact: row.tiers_contact,
    tiersAssurance: row.tiers_assurance,
    demandeurType: row.demandeur_type,
    demandeurNom: row.demandeur_nom,
    demandeurContact: row.demandeur_contact,
    dateFirstManif: row.date_first_manif,
    interventionsAnterieures: row.interventions_anterieures,
    objet: row.objet,
    constatations: row.constatations,
    surfaceAffectee: row.surface_affectee,
    signesAlerte: row.signes_alerte,
    batiment: row.batiment,
    alimentationConfig: row.alimentation_config,
    alimentationComposition: row.alimentation_composition,
    alimentationPointsAcces: row.alimentation_points_acces,
    alimentationNotes: row.alimentation_notes,
    alimentationECS: row.alimentation_ecs,
    alimentationECSType: row.alimentation_ecs_type,
    alimentationChauffage: row.alimentation_chauffage,
    alimentationChauffageType: row.alimentation_chauffage_type,
    alimentationEvacuations: row.alimentation_evacuations,
    alimentationEvacuationsNotes: row.alimentation_evacuations_notes,
    alimentationIsolation: row.alimentation_isolation,
    conclusion: row.conclusion,
    recommandations: row.recommandations,
    riskResiduel: row.risk_residuel,
    assurabilite: row.assurabilite,
    urgence: row.urgence,
    responsabiliteExecution: row.responsabilite_execution,
    degats: row.degats ?? [],
    investigation: row.investigation ?? [],
    moyens: row.moyens ?? {},
    etapes: row.etapes ?? [],
    sectionPhotos: row.section_photos ?? {},
  };
}

export function isSupabaseConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL);
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
      .upsert(reportToRow(report));
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
