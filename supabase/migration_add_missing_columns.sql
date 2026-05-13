-- Migration : ajout des colonnes manquantes à la table reports
-- À exécuter dans Supabase → SQL Editor

ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS "tiersType"               TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "tiersNom"                TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "tiersContact"            TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "tiersAssurance"          TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "demandeurType"           TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "demandeurNom"            TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "demandeurContact"        TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "dateFirstManif"          TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "interventionsAnterieures" TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "surfaceAffectee"         TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "signesAlerte"            TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "alimentationECS"         TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "alimentationECSType"     TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "alimentationChauffage"   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "alimentationChauffageType" TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "alimentationEvacuations" TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "alimentationEvacuationsNotes" TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "alimentationIsolation"   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "riskResiduel"            TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "assurabilite"            TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "urgence"                 TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS "responsabiliteExecution" TEXT DEFAULT '';
