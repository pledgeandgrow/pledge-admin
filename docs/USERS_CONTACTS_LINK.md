# Liaison Users ↔ Contacts

## 📋 Vue d'ensemble

Chaque utilisateur (`users`) est automatiquement lié à un contact (`contacts`) de type **member** ou **board-member**.

## 🔗 Structure de liaison

### Schéma de relation

```
┌─────────────────┐         ┌──────────────────┐
│     users       │         │    contacts      │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄───────┤│ user_id (FK)     │
│ email           │         │ id (PK)          │
│ first_name      │         │ first_name       │
│ last_name       │         │ last_name        │
│ role            │         │ email            │
│ contact_id (FK) │────────►│ type             │
│ ...             │         │ ...              │
└─────────────────┘         └──────────────────┘
```

### Champs ajoutés

#### Table `users`
- `contact_id` (uuid) - Référence vers le contact associé

#### Table `contacts`
- `user_id` (uuid) - Référence vers l'utilisateur associé (si le contact a un compte)

## 🔄 Synchronisation automatique

### Création d'un utilisateur → Création d'un contact

Quand un utilisateur est créé :
1. Un contact est automatiquement créé
2. Le type de contact dépend du rôle :
   - `role = 'admin'` → `type = 'board-member'`
   - `role = 'user'` → `type = 'member'`
3. Les deux enregistrements sont liés automatiquement

### Mise à jour d'un contact → Mise à jour de l'utilisateur

Quand un contact lié à un utilisateur est modifié :
- Les champs `first_name`, `last_name`, `email`, `phone` sont synchronisés vers `users`

## 📊 Types de contacts et rôles

| Rôle utilisateur | Type de contact | Description |
|------------------|-----------------|-------------|
| `admin` | `board-member` | Membre du conseil d'administration |
| `user` | `member` | Membre régulier |
| `manager` | `member` | Manager (membre avec permissions étendues) |
| `viewer` | `member` | Observateur (membre en lecture seule) |

## 🛠️ Fonctions utilitaires

### 1. Récupérer son propre contact

```sql
SELECT * FROM public.get_my_contact();
```

Retourne le contact associé à l'utilisateur connecté.

### 2. Promouvoir un utilisateur en board member

```sql
SELECT public.promote_to_board_member('user-uuid-here');
```

Cette fonction :
- Change le rôle de l'utilisateur en `admin`
- Change le type de contact en `board-member`

### 3. Rétrograder un board member en membre

```sql
SELECT public.demote_to_member('user-uuid-here');
```

Cette fonction :
- Change le rôle de l'utilisateur en `user`
- Change le type de contact en `member`

## 📝 Exemples d'utilisation

### Créer un nouvel utilisateur (automatiquement créé comme membre)

```sql
-- L'utilisateur est créé via Supabase Auth
-- Le trigger crée automatiquement un contact de type 'member'
```

### Promouvoir un membre en board member

```sql
-- Promouvoir l'utilisateur avec l'email antimbe11@gmail.com
SELECT public.promote_to_board_member(
  (SELECT id FROM public.users WHERE email = 'antimbe11@gmail.com')
);
```

### Voir tous les board members

```sql
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  c.type as contact_type,
  c.board_role,
  c.board_start_date
FROM public.users u
JOIN public.contacts c ON u.contact_id = c.id
WHERE c.type = 'board-member';
```

### Voir tous les membres

```sql
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  c.type as contact_type,
  c.status
FROM public.users u
JOIN public.contacts c ON u.contact_id = c.id
WHERE c.type = 'member';
```

## 🔒 Sécurité (RLS)

### Politiques mises à jour

1. **Les utilisateurs peuvent voir leur propre contact**
   ```sql
   auth.uid() = user_id
   ```

2. **Les utilisateurs authentifiés peuvent voir tous les contacts**
   ```sql
   auth.role() = 'authenticated'
   ```

3. **Les utilisateurs peuvent modifier leur propre contact**
   ```sql
   auth.uid() = user_id
   ```

## 🚀 Migration

### Appliquer la migration

1. Ouvrez Supabase Dashboard > SQL Editor
2. Copiez le contenu de `supabase/migrations/003_link_users_contacts.sql`
3. Exécutez la requête

### Ce que fait la migration

✅ Ajoute `user_id` à la table `contacts`  
✅ Ajoute `contact_id` à la table `users`  
✅ Crée des index pour optimiser les performances  
✅ Crée des triggers pour la synchronisation automatique  
✅ Crée des contacts pour tous les utilisateurs existants  
✅ Met à jour les politiques RLS  
✅ Ajoute des fonctions utilitaires  

### Vérification après migration

```sql
-- Vérifier que tous les users ont un contact
SELECT 
  u.id,
  u.email,
  u.contact_id,
  c.type
FROM public.users u
LEFT JOIN public.contacts c ON u.contact_id = c.id;

-- Vérifier que tous les contacts liés ont un user
SELECT 
  c.id,
  c.email,
  c.type,
  c.user_id,
  u.email as user_email
FROM public.contacts c
LEFT JOIN public.users u ON c.user_id = u.id
WHERE c.user_id IS NOT NULL;
```

## 🎯 Cas d'usage

### 1. Inscription d'un nouvel utilisateur

```typescript
// L'utilisateur s'inscrit via /auth/signup
// Automatiquement :
// 1. Compte créé dans auth.users
// 2. Profil créé dans public.users (via trigger handle_new_user)
// 3. Contact créé dans public.contacts (via trigger sync_user_to_contact)
// 4. Liaison bidirectionnelle établie
```

### 2. Mise à jour du profil utilisateur

```typescript
// L'utilisateur met à jour son profil
await supabase
  .from('contacts')
  .update({
    first_name: 'Nouveau',
    last_name: 'Nom',
    phone: '+33123456789'
  })
  .eq('user_id', user.id);

// Automatiquement synchronisé vers public.users
```

### 3. Promouvoir un membre en board member

```typescript
// Dans l'interface admin
const promoteUser = async (userId: string) => {
  const { error } = await supabase.rpc('promote_to_board_member', {
    target_user_id: userId
  });
  
  if (error) console.error('Error:', error);
  else console.log('User promoted to board member!');
};
```

## ⚠️ Points importants

1. **Un utilisateur = Un contact**
   - Chaque utilisateur a exactement un contact associé
   - Un contact peut exister sans utilisateur (ex: contact externe)

2. **Synchronisation bidirectionnelle**
   - Modifications dans `users` → propagées vers `contacts`
   - Modifications dans `contacts` → propagées vers `users`

3. **Types de contacts sans compte utilisateur**
   - `freelance`, `partner`, `investor`, `externe`, `network`, `lead`, `client`, `waitlist`, `blacklist`
   - Ces contacts n'ont pas de `user_id` (NULL)

4. **Suppression**
   - Supprimer un utilisateur → `user_id` dans contacts devient NULL
   - Supprimer un contact → `contact_id` dans users devient NULL
   - Utilise `ON DELETE SET NULL` pour éviter les suppressions en cascade

## 📚 Ressources

- Migration : `supabase/migrations/003_link_users_contacts.sql`
- Schéma users : `supabase/migrations/001_create_users_table.sql`
- Schéma contacts : `supabase/migrations/002_create_contacts_table.sql`
