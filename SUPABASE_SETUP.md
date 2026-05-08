# Configuration Supabase pour ESMEAU Report Manager

L'application utilise maintenant un système de stockage hybride : **Supabase (cloud) + localStorage (fallback)**.

## État actuel

- ✅ L'application fonctionne **immédiatement** avec localStorage (pas de configuration nécessaire)
- ✅ Le frontend et le design sont **100% préservés**
- ✅ Les données sont synchronisées automatiquement avec Supabase une fois configuré

## Comment configurer Supabase

### 1. Créer un compte Supabase gratuit

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit (500 Mo inclus)
3. Créez un nouveau projet

### 2. Créer la table des rapports

Dans le dashboard Supabase :
1. Allez dans **SQL Editor**
2. Exécutez ce script SQL :

```sql
-- Créer la table reports
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  date TEXT,
  clientCivilite TEXT,
  clientNom TEXT,
  clientPrenom TEXT,
  clientPhone TEXT,
  clientEmail TEXT,
  address TEXT,
  interventionAddress TEXT,
  problemType TEXT,
  status TEXT,
  objet TEXT,
  constatations TEXT,
  batiment TEXT,
  degats JSONB,
  investigation JSONB,
  alimentationConfig TEXT,
  alimentationComposition TEXT,
  alimentationPointsAcces TEXT,
  alimentationNotes TEXT,
  moyens JSONB,
  etapes JSONB,
  conclusion TEXT,
  recommandations TEXT,
  sectionPhotos JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activer Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Permettre toutes les opérations (adapter selon vos besoins de sécurité)
CREATE POLICY "Enable all access for all users" ON reports
  FOR ALL USING (true) WITH CHECK (true);
```

### 3. Récupérer vos clés API

Dans le dashboard Supabase :
1. Allez dans **Settings** → **API**
2. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 4. Configurer les variables d'environnement

Ouvrez le fichier `.env.local` et remplacez les valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_publique
```

### 5. Redémarrer l'application

Arrêtez et relancez le serveur de développement :

```bash
npm run dev
```

## Fonctionnement du stockage hybride

**Chargement des données :**
1. Essai de chargement depuis Supabase (si configuré)
2. Fallback sur localStorage si Supabase échoue
3. Cache localStorage mis à jour avec les données cloud

**Sauvegarde des données :**
1. Sauvegarde immédiate dans localStorage (cache)
2. Synchronisation automatique avec Supabase (si configuré)
3. L'application fonctionne même hors ligne

## Avantages

- ✅ **Zéro downtime** : L'application fonctionne immédiatement
- ✅ **Offline-first** : Fonctionne sans internet
- ✅ **Synchronisation automatique** : Les données sont sauvegardées dans le cloud
- ✅ **Multi-appareils** : Accédez à vos rapports depuis n'importe où
- ✅ **Sauvegardes automatiques** : Vos données sont sécurisées dans le cloud

## Sécurité

Pour un environnement de production, vous devriez :
1. Implémenter l'authentification Supabase
2. Restreindre les politiques RLS
3. Utiliser des clés de service pour les opérations administratives

## Support

En cas de problème, vérifiez :
- Les variables d'environnement sont correctement configurées
- La table `reports` existe dans Supabase
- Les politiques RLS permettent les opérations nécessaires
- La console du navigateur pour les messages d'erreur
