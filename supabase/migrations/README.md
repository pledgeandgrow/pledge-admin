# Migrations Supabase

Ce dossier contient les migrations SQL pour la base de données Supabase.

## Comment appliquer les migrations

### Option 1 : Via l'interface Supabase (Recommandé)

1. Connectez-vous à votre projet Supabase : https://app.supabase.com
2. Allez dans **SQL Editor** dans le menu de gauche
3. Cliquez sur **New Query**
4. Copiez le contenu du fichier de migration
5. Cliquez sur **Run** pour exécuter la migration

### Option 2 : Via Supabase CLI

```bash
# Installer Supabase CLI si ce n'est pas déjà fait
npm install -g supabase

# Se connecter à votre projet
supabase login

# Lier votre projet local
supabase link --project-ref your-project-ref

# Appliquer les migrations
supabase db push
```

### Option 3 : Migration manuelle

Si vous préférez appliquer les migrations manuellement :

1. Ouvrez le fichier de migration
2. Copiez le contenu SQL
3. Exécutez-le dans l'éditeur SQL de Supabase

## Liste des migrations

### 001_create_users_table.sql

**Date**: 2025-10-12  
**Description**: Crée la table `public.users` pour stocker les profils utilisateurs

**Ce que cette migration fait**:
- ✅ Crée la table `public.users` avec tous les champs nécessaires
- ✅ Crée les index pour optimiser les performances
- ✅ Active Row Level Security (RLS)
- ✅ Crée les politiques RLS pour la sécurité
- ✅ Crée un trigger automatique pour créer le profil lors de l'inscription
- ✅ Crée un trigger pour mettre à jour `updated_at` automatiquement

**Champs de la table users**:
- `id` - UUID (référence auth.users)
- `email` - Email de l'utilisateur (unique)
- `first_name` - Prénom
- `last_name` - Nom
- `avatar_url` - URL de l'avatar
- `phone` - Numéro de téléphone
- `role` - Rôle (user, admin, manager, viewer)
- `email_verified` - Email vérifié (boolean)
- `status` - Statut du compte (active, inactive, suspended, pending)
- `last_login` - Dernière connexion
- `last_sign_in_at` - Dernière authentification
- `metadata` - Métadonnées additionnelles (JSONB)
- `preferences` - Préférences utilisateur (JSONB)
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

**Politiques RLS**:
- Les utilisateurs peuvent voir et modifier leur propre profil
- Les admins peuvent voir et modifier tous les profils
- Les admins peuvent créer et supprimer des utilisateurs

**Triggers automatiques**:
- Création automatique du profil lors de l'inscription
- Mise à jour automatique du champ `updated_at`

## Vérification après migration

Après avoir appliqué la migration, vérifiez que tout fonctionne :

### 1. Vérifier que la table existe

```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';
```

### 2. Vérifier les politiques RLS

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'users';
```

### 3. Vérifier les triggers

```sql
SELECT * FROM information_schema.triggers 
WHERE event_object_table = 'users';
```

### 4. Tester la création automatique de profil

Créez un nouveau compte via l'interface d'inscription et vérifiez que le profil est créé automatiquement :

```sql
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;
```

## Rollback (Annulation)

Si vous devez annuler cette migration :

```sql
-- Supprimer les triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Supprimer la table
DROP TABLE IF EXISTS public.users CASCADE;
```

⚠️ **ATTENTION**: Le rollback supprimera toutes les données de la table users !

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans Supabase Dashboard > Database > Logs
2. Vérifiez que vous avez les permissions nécessaires
3. Assurez-vous que la table `auth.users` existe (elle est créée automatiquement par Supabase)

## Notes importantes

- ⚠️ Cette migration active Row Level Security (RLS) pour sécuriser les données
- ⚠️ Les utilisateurs ne peuvent voir que leur propre profil (sauf les admins)
- ⚠️ Le premier utilisateur devra être promu admin manuellement via SQL
- ✅ Les profils sont créés automatiquement lors de l'inscription
- ✅ Les champs `first_name` et `last_name` sont récupérés depuis les métadonnées d'inscription

## Promouvoir le premier admin

Après la migration, vous devrez promouvoir manuellement le premier utilisateur en admin :

```sql
-- Remplacez 'votre-email@example.com' par votre email
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'votre-email@example.com';
```
