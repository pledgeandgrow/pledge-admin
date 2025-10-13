# 🔧 Guide de dépannage

## Problème : Chargement infini sur certains onglets

### 🔍 Diagnostic

Quand vous cliquez sur un onglet et qu'il charge à l'infini, cela signifie généralement :

1. **La table n'existe pas** dans Supabase
2. **Les politiques RLS bloquent** l'accès aux données
3. **Une erreur réseau** ou de connexion
4. **Un bug dans le hook React** qui cause une boucle infinie

---

## ✅ Solution étape par étape

### Étape 1 : Vérifier quelles tables existent

1. Ouvrez Supabase Dashboard : https://app.supabase.com
2. Allez dans **SQL Editor**
3. Copiez et exécutez le script `supabase/migrations/CHECK_TABLES.sql`
4. Notez quelles tables sont **❌ MISSING**

### Étape 2 : Appliquer les migrations manquantes

Selon les tables manquantes, appliquez les migrations dans l'ordre :

#### Migration 1 : Table users
```sql
-- Si users est manquante
-- Exécutez : supabase/migrations/001_create_users_table.sql
```

#### Migration 2 : Table contacts
```sql
-- Si contacts est manquante
-- Exécutez : supabase/migrations/002_create_contacts_table.sql
```

#### Migration 3 : Liaison users ↔ contacts
```sql
-- Si la liaison n'existe pas
-- Exécutez : supabase/migrations/003_link_users_contacts.sql
```

#### Migration 4 : Tables commerciales
```sql
-- Si services, packages, formations, offers sont manquantes
-- Exécutez : supabase/migrations/004_create_commercial_tables.sql
```

#### Migration 5 : Tables workspace
```sql
-- Si time_entries, comments, attachments, activity_log sont manquantes
-- Exécutez : supabase/migrations/005_create_workspace_tables.sql
```

### Étape 3 : Vérifier les politiques RLS

Si les tables existent mais le chargement est infini, vérifiez les politiques RLS :

```sql
-- Voir toutes les politiques
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Étape 4 : Vérifier les erreurs dans la console

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet **Console**
3. Rechargez la page
4. Cherchez les erreurs rouges

**Erreurs courantes** :

#### Erreur : "relation does not exist"
```
Error: relation "public.contacts" does not exist
```
**Solution** : La table n'existe pas. Appliquez la migration correspondante.

#### Erreur : "new row violates row-level security policy"
```
Error: new row violates row-level security policy
```
**Solution** : Les politiques RLS bloquent l'accès. Vérifiez les politiques.

#### Erreur : "column does not exist"
```
Error: column "lead_source" does not exist
```
**Solution** : Une colonne manque. Réappliquez la migration.

---

## 🚨 Problèmes spécifiques par module

### Module Contact (Board Members, Members, etc.)

**Symptôme** : Chargement infini sur `/contact/*`

**Vérification** :
```sql
-- Vérifier que la table contacts existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'contacts';

-- Vérifier les colonnes
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'contacts';
```

**Solution** :
1. Appliquez `002_create_contacts_table.sql`
2. Appliquez `003_link_users_contacts.sql`

### Module Commercial (Leads, Clients, Services, etc.)

**Symptôme** : Chargement infini sur `/commercial/*`

**Vérification** :
```sql
-- Vérifier les tables commerciales
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('services', 'packages', 'formations', 'offers');

-- Vérifier les vues
SELECT table_name FROM information_schema.views 
WHERE table_name IN ('leads', 'clients', 'waitlist');
```

**Solution** :
1. Assurez-vous que `contacts` existe (migration 002)
2. Appliquez `004_create_commercial_tables.sql`

### Module Workspace (Projects, Tasks, Calendar, Documents)

**Symptôme** : Chargement infini sur `/workspace/*`

**Vérification** :
```sql
-- Vérifier les tables workspace
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('projects', 'tasks', 'events', 'documents', 'time_entries', 'comments');
```

**Solution** :
1. Vérifiez que les tables de base existent (projects, tasks, events, documents)
2. Appliquez `005_create_workspace_tables.sql`

---

## 🔧 Solutions rapides

### Solution 1 : Réappliquer toutes les migrations

Si vous n'êtes pas sûr de ce qui manque, réappliquez toutes les migrations dans l'ordre :

```sql
-- 1. Users
-- Copiez et exécutez 001_create_users_table.sql

-- 2. Contacts
-- Copiez et exécutez 002_create_contacts_table.sql

-- 3. Liaison
-- Copiez et exécutez 003_link_users_contacts.sql

-- 4. Commercial
-- Copiez et exécutez 004_create_commercial_tables.sql

-- 5. Workspace
-- Copiez et exécutez 005_create_workspace_tables.sql
```

### Solution 2 : Désactiver temporairement RLS (⚠️ DANGER)

**⚠️ À utiliser UNIQUEMENT pour le diagnostic, PAS en production !**

```sql
-- Désactiver RLS sur une table
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;

-- Tester si ça fonctionne
-- Si oui, le problème vient des politiques RLS

-- RÉACTIVER IMMÉDIATEMENT
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
```

### Solution 3 : Vérifier la connexion Supabase

Vérifiez vos variables d'environnement :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
```

**Test de connexion** :
```typescript
// Dans la console du navigateur
const { data, error } = await supabase.from('users').select('count');
console.log('Connection test:', { data, error });
```

---

## 📊 Logs utiles

### Activer les logs détaillés

Ajoutez ceci temporairement dans vos hooks :

```typescript
// Dans useContacts.ts, useProjects.ts, etc.
useEffect(() => {
  console.log('🔍 Fetching data...');
  fetchData().then(data => {
    console.log('✅ Data loaded:', data);
  }).catch(error => {
    console.error('❌ Error:', error);
  });
}, []);
```

### Vérifier les requêtes Supabase

Dans la console du navigateur, regardez l'onglet **Network** :
1. Filtrez par "supabase"
2. Regardez les requêtes qui échouent (en rouge)
3. Cliquez dessus pour voir la réponse

---

## 🆘 Si rien ne fonctionne

### Option nucléaire : Réinitialiser les tables

**⚠️ ATTENTION : Cela supprimera TOUTES les données !**

```sql
-- Supprimer toutes les tables dans l'ordre inverse
DROP TABLE IF EXISTS public.activity_log CASCADE;
DROP TABLE IF EXISTS public.attachments CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.time_entries CASCADE;
DROP VIEW IF EXISTS public.waitlist CASCADE;
DROP VIEW IF EXISTS public.clients CASCADE;
DROP VIEW IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.offers CASCADE;
DROP TABLE IF EXISTS public.formations CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Puis réappliquer toutes les migrations dans l'ordre
```

---

## 📞 Support

Si le problème persiste :

1. **Vérifiez les logs Supabase** : Dashboard > Logs
2. **Vérifiez la console du navigateur** : F12 > Console
3. **Exécutez le script de vérification** : `CHECK_TABLES.sql`
4. **Notez l'erreur exacte** et cherchez dans ce guide

---

## ✅ Checklist de vérification

- [ ] Toutes les migrations sont appliquées
- [ ] Toutes les tables existent
- [ ] Les politiques RLS sont configurées
- [ ] Les variables d'environnement sont correctes
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Les requêtes Supabase réussissent (onglet Network)
- [ ] L'utilisateur est authentifié

---

**Dernière mise à jour** : 13 octobre 2025
