import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey && supabase);
}

const STORAGE_BUCKET = 'report-photos';

// Strip base64 data URLs from section_photos before sending to Supabase.
// Remote https URLs (already uploaded) are preserved as-is.
function stripPhotoData(sectionPhotos) {
  const out = {};
  for (const [key, photos] of Object.entries(sectionPhotos ?? {})) {
    out[key] = (photos ?? []).map(p => ({
      ...p,
      url: p.url?.startsWith('data:') ? '' : (p.url ?? ''),
    }));
  }
  return out;
}

// Upload base64 photos to Supabase Storage and return updated sectionPhotos
// with remote URLs replacing base64 data. Non-base64 URLs are left untouched.
async function uploadSectionPhotos(reportId, sectionPhotos) {
  const out = {};
  for (const [key, photos] of Object.entries(sectionPhotos ?? {})) {
    out[key] = await Promise.all((photos ?? []).map(async (photo, i) => {
      if (!photo.url?.startsWith('data:')) return photo;
      try {
        const res = await fetch(photo.url);
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const path = `${reportId}/${key}/${i}_${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, blob, { upsert: true, contentType: blob.type });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        return { ...photo, url: data.publicUrl };
      } catch (e) {
        console.error(`Photo upload failed [${key}[${i}]]:`, e?.message || e);
        return { ...photo, url: '' };
      }
    }));
  }
  return out;
}

// Delete all photos stored in Storage for a given report id.
async function deleteReportPhotos(reportId) {
  try {
    const { data: folders } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(reportId);
    if (!folders?.length) return;
    for (const folder of folders) {
      const { data: files } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(`${reportId}/${folder.name}`);
      if (files?.length) {
        await supabase.storage
          .from(STORAGE_BUCKET)
          .remove(files.map(f => `${reportId}/${folder.name}/${f.name}`));
      }
    }
  } catch (e) {
    console.error('Storage cleanup error:', e?.message || e);
  }
}

// Maps a React report object → Supabase row (snake_case, matching schema.sql)
function reportToRow(r) {
  return {
    id: r.id,
    date: r.date || new Date().toISOString().split('T')[0],
    status: r.status ?? 'brouillon',
    client_civilite: r.clientCivilite ?? '',
    client_nom: r.clientNom ?? '',
    client_prenom: r.clientPrenom ?? '',
    client_phone: r.clientPhone ?? '',
    client_email: r.clientEmail ?? '',
    address: r.address ?? '',
    intervention_address: r.interventionAddress ?? '',
    problem_type: r.problemType ?? '',
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
    section_photos: stripPhotoData(r.sectionPhotos),
  };
}

// Maps a Supabase row → React report object (snake_case → camelCase)
function rowToReport(row) {
  return {
    id: row.id,
    date: row.date,
    updated_at: row.updated_at,
    status: row.status,
    clientCivilite: row.client_civilite,
    clientNom: row.client_nom,
    clientPrenom: row.client_prenom,
    clientPhone: row.client_phone,
    clientEmail: row.client_email,
    address: row.address,
    interventionAddress: row.intervention_address,
    problemType: row.problem_type,
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

export const reportsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data.map(rowToReport);
  },

  // Upload any base64 photos to Storage, then upsert the DB row.
  // Returns the updated sectionPhotos (with remote URLs) so callers can update React state.
  async upsert(report) {
    const sectionPhotos = await uploadSectionPhotos(report.id, report.sectionPhotos);
    const { error } = await supabase
      .from('reports')
      .upsert(reportToRow({ ...report, sectionPhotos }), { onConflict: 'id' });
    if (error) throw error;
    return sectionPhotos;
  },

  async delete(id) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await deleteReportPhotos(id);
  },
};
