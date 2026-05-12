-- ============================================================
-- ESMEAU Report Manager — Schéma base de données Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Table des rapports
create table if not exists public.reports (
  -- Identifiant métier (ex: "001/PTE/2506")
  id text primary key,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- En-tête
  date date not null default current_date,
  status text not null default 'brouillon'
    check (status in ('brouillon', 'en cours', 'finalisé')),
  problem_type text default '',

  -- Client
  client_civilite text default 'M.',
  client_nom text default '',
  client_prenom text default '',
  client_phone text default '',
  client_email text default '',
  address text default '',
  intervention_address text default '',

  -- Tiers & demandeur
  tiers_type text default '',
  tiers_nom text default '',
  tiers_contact text default '',
  tiers_assurance text default '',
  demandeur_type text default '',
  demandeur_nom text default '',
  demandeur_contact text default '',
  date_first_manif text default '',
  interventions_anterieures text default '',

  -- Sections rédigées
  objet text default '',
  constatations text default '',
  surface_affectee text default '',
  signes_alerte text default '',
  batiment text default '',

  -- Alimentation eau
  alimentation_config text default '',
  alimentation_composition text default '',
  alimentation_points_acces text default '',
  alimentation_notes text default '',
  alimentation_ecs text default '',
  alimentation_ecs_type text default '',
  alimentation_chauffage text default '',
  alimentation_chauffage_type text default '',
  alimentation_evacuations text default '',
  alimentation_evacuations_notes text default '',
  alimentation_isolation text default '',

  -- Conclusion & synthèse
  conclusion text default '',
  recommandations text default '',
  risk_residuel text default '',
  assurabilite text default '',
  urgence text default '',
  responsabilite_execution text default '',

  -- Structures complexes stockées en JSON
  degats jsonb default '[]'::jsonb,
  investigation jsonb default '[]'::jsonb,
  moyens jsonb default '{}'::jsonb,
  etapes jsonb default '[]'::jsonb,
  section_photos jsonb default '{}'::jsonb
);

-- Index pour les listes triées
create index if not exists reports_date_idx on public.reports (date desc);
create index if not exists reports_status_idx on public.reports (status);

-- Mise à jour automatique de updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_updated_at on public.reports;
create trigger reports_updated_at
  before update on public.reports
  for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security
-- Pour l'instant : accès libre (pas encore d'authentification).
-- À remplacer par des politiques par utilisateur quand auth activée.
-- ============================================================
alter table public.reports enable row level security;

drop policy if exists "Accès public temporaire" on public.reports;
create policy "Accès public temporaire" on public.reports
  for all
  using (true)
  with check (true);
