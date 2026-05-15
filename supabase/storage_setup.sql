-- ============================================================
-- ESMEAU Report Manager — Supabase Storage : bucket report-photos
--
-- ÉTAPES :
-- 1. Aller dans Supabase Dashboard → Storage
-- 2. Créer un bucket nommé "report-photos" (cocher "Public bucket")
-- 3. Exécuter ce script dans SQL Editor pour créer les policies
-- ============================================================

-- Crée le bucket si absent (fonctionne aussi via Dashboard)
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

-- Policies accès public temporaire (cohérent avec RLS reports)
-- À remplacer par des policies par utilisateur quand l'auth sera activée.

drop policy if exists "Lecture report-photos" on storage.objects;
create policy "Lecture report-photos"
  on storage.objects for select
  using (bucket_id = 'report-photos');

drop policy if exists "Upload report-photos" on storage.objects;
create policy "Upload report-photos"
  on storage.objects for insert
  with check (bucket_id = 'report-photos');

drop policy if exists "Update report-photos" on storage.objects;
create policy "Update report-photos"
  on storage.objects for update
  using (bucket_id = 'report-photos');

drop policy if exists "Delete report-photos" on storage.objects;
create policy "Delete report-photos"
  on storage.objects for delete
  using (bucket_id = 'report-photos');
