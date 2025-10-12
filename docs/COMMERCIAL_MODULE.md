# 📊 Module Commercial - Documentation

## Vue d'ensemble

Le module commercial gère l'ensemble du cycle de vente : leads, clients, services, packages, formations et offres spéciales.

---

## 📋 Tables créées

### 1. **Services/Prestations** (`public.services`)

Services et prestations offerts par l'entreprise.

**Champs principaux** :
- `name` - Nom du service
- `description` - Description détaillée
- `category` - Catégorie (consulting, development, design, marketing, training, support, other)
- `price` - Prix
- `billing_type` - Type de facturation (one-time, hourly, daily, monthly, yearly)
- `duration_hours` - Durée estimée
- `deliverables` - Livrables
- `status` - Statut (active, inactive, draft, archived)

### 2. **Packages** (`public.packages`)

Offres groupées de services.

**Champs principaux** :
- `name` - Nom du package
- `description` - Description
- `price` - Prix du package
- `discount_percentage` - Pourcentage de réduction
- `services` - Services inclus (JSONB)
- `duration_months` - Durée en mois
- `features` - Fonctionnalités
- `is_popular` - Package populaire (booléen)
- `status` - Statut

### 3. **Formations** (`public.formations`)

Programmes de formation et cours.

**Champs principaux** :
- `title` - Titre de la formation
- `description` - Description
- `category` - Catégorie
- `level` - Niveau (beginner, intermediate, advanced, expert)
- `price` - Prix
- `duration_hours` - Durée en heures
- `max_participants` - Nombre maximum de participants
- `format` - Format (online, in-person, hybrid)
- `start_date` / `end_date` - Dates
- `objectives` - Objectifs pédagogiques
- `prerequisites` - Prérequis
- `program` - Programme détaillé (JSONB)
- `instructor_id` - Formateur
- `current_participants` - Participants actuels
- `status` - Statut (draft, published, ongoing, completed, cancelled, archived)

### 4. **Offres** (`public.offers`)

Autres offres commerciales et promotions.

**Champs principaux** :
- `title` - Titre de l'offre
- `description` - Description
- `type` - Type (product, service, subscription, bundle, other)
- `price` - Prix
- `original_price` - Prix original (pour afficher la réduction)
- `features` - Fonctionnalités
- `valid_from` / `valid_until` - Période de validité
- `is_limited_time` - Offre limitée dans le temps
- `status` - Statut

### 5. **Vues SQL**

#### `public.leads`
Vue sur les contacts de type 'lead' avec champs spécifiques :
- `source` - Source du lead
- `score` - Score du lead (0-100)
- `probability` - Probabilité de conversion (0-100)
- `estimated_value` - Valeur estimée
- `next_follow_up` - Prochain suivi

#### `public.clients`
Vue sur les contacts de type 'client' avec champs spécifiques :
- `first_contact_date` - Date du premier contact
- `last_purchase_date` - Date du dernier achat
- `total_spent` - Total dépensé
- `client_since` - Client depuis

#### `public.waitlist`
Vue sur les contacts de type 'waitlist' avec champs spécifiques :
- `position` - Position dans la liste d'attente
- `service` - Service demandé
- `joined_at` - Date d'inscription
- `expires_at` - Date d'expiration

---

## 🗂️ Structure des pages

### Pages implémentées

| Route | Composant | Description |
|-------|-----------|-------------|
| `/commercial/lead` | `LeadList` | Gestion des leads |
| `/commercial/clients` | `ClientList` | Gestion des clients |
| `/commercial/prestations` | `PrestationList` | Catalogue de services |
| `/commercial/packages` | `PackageList` | Packages de services |
| `/commercial/formation` | `FormationList` | Formations disponibles |
| `/commercial/autres-offres` | `OffreList` | Autres offres |
| `/commercial/waitlist` | `WaitlistList` | Liste d'attente |

### Composants disponibles

Chaque module dispose de :
- **List** - Liste avec recherche, filtres et pagination
- **Table** - Tableau avec tri et actions
- **AddDialog** - Formulaire d'ajout
- **EditDialog** - Formulaire d'édition
- **ViewDialog** - Vue détaillée (optionnel)

---

## 🚀 Migration

### Appliquer la migration

1. Ouvrez Supabase Dashboard > SQL Editor
2. Copiez le contenu de `supabase/migrations/004_create_commercial_tables.sql`
3. Exécutez la requête

### Vérification après migration

```sql
-- Vérifier que toutes les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('services', 'packages', 'formations', 'offers');

-- Vérifier les vues
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('leads', 'clients', 'waitlist');

-- Compter les enregistrements
SELECT 'services' as table_name, COUNT(*) FROM public.services
UNION ALL
SELECT 'packages', COUNT(*) FROM public.packages
UNION ALL
SELECT 'formations', COUNT(*) FROM public.formations
UNION ALL
SELECT 'offers', COUNT(*) FROM public.offers;
```

---

## 📊 Exemples de données

### Créer un service

```sql
INSERT INTO public.services (
  name,
  description,
  category,
  price,
  billing_type,
  duration_hours,
  status
) VALUES (
  'Développement Web Custom',
  'Développement d''une application web sur mesure',
  'development',
  5000.00,
  'one-time',
  80,
  'active'
);
```

### Créer un package

```sql
INSERT INTO public.packages (
  name,
  description,
  price,
  discount_percentage,
  services,
  features,
  is_popular,
  status
) VALUES (
  'Pack Startup',
  'Package complet pour lancer votre startup',
  8000.00,
  15,
  '[{"service_id": "uuid-here", "quantity": 1}]'::jsonb,
  ARRAY['Site web', 'Logo', 'Hébergement 1 an', 'Support 24/7'],
  true,
  'active'
);
```

### Créer une formation

```sql
INSERT INTO public.formations (
  title,
  description,
  category,
  level,
  price,
  duration_hours,
  max_participants,
  format,
  start_date,
  objectives,
  status
) VALUES (
  'Formation React Avancé',
  'Maîtrisez React et ses écosystèmes',
  'Développement Web',
  'advanced',
  1200.00,
  16,
  12,
  'online',
  '2025-11-01 09:00:00+00',
  ARRAY['Maîtriser les hooks', 'Optimiser les performances', 'Gérer l''état global'],
  'published'
);
```

---

## 🔒 Sécurité (RLS)

### Politiques appliquées

Toutes les tables ont les mêmes politiques RLS :

1. **SELECT** - Tous les utilisateurs authentifiés peuvent voir
2. **INSERT** - Tous les utilisateurs authentifiés peuvent créer
3. **UPDATE** - Tous les utilisateurs authentifiés peuvent modifier
4. **DELETE** - Seuls les admins peuvent supprimer

### Modifier les politiques

Si vous voulez restreindre l'accès :

```sql
-- Exemple : Seuls les admins peuvent créer des services
DROP POLICY "Authenticated users can insert services" ON public.services;

CREATE POLICY "Only admins can insert services" ON public.services
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 📈 Statistiques et rapports

### Statistiques des leads

```sql
SELECT 
  COUNT(*) as total_leads,
  AVG(lead_score) as avg_score,
  SUM(estimated_value) as total_potential_value,
  COUNT(*) FILTER (WHERE probability >= 70) as hot_leads
FROM public.leads
WHERE status = 'active';
```

### Revenus par client

```sql
SELECT 
  first_name || ' ' || last_name as client_name,
  total_spent,
  last_purchase_date,
  EXTRACT(DAYS FROM NOW() - client_since) as days_as_client
FROM public.clients
ORDER BY total_spent DESC
LIMIT 10;
```

### Services les plus vendus

```sql
-- Nécessite une table de commandes/ventes (à créer si besoin)
SELECT 
  s.name,
  s.category,
  s.price,
  COUNT(*) as sales_count
FROM public.services s
-- JOIN avec table de ventes
GROUP BY s.id, s.name, s.category, s.price
ORDER BY sales_count DESC;
```

---

## 🎯 Fonctionnalités à venir

### Phase 2 (optionnel)

- [ ] **Devis** - Génération de devis PDF
- [ ] **Factures** - Facturation automatique
- [ ] **Contrats** - Gestion des contrats clients
- [ ] **Pipeline de vente** - Visualisation du pipeline
- [ ] **Rapports avancés** - Tableaux de bord analytiques
- [ ] **Intégrations** - CRM, comptabilité, etc.

---

## 📚 Ressources

- Migration : `supabase/migrations/004_create_commercial_tables.sql`
- Composants : `src/components/commercial/`
- Pages : `src/app/commercial/`
- Types : `src/types/commercial.ts` (à créer si nécessaire)

---

## ✅ Checklist de mise en production

- [ ] Appliquer la migration `004_create_commercial_tables.sql`
- [ ] Vérifier que toutes les tables sont créées
- [ ] Vérifier que les vues fonctionnent
- [ ] Tester la création de services
- [ ] Tester la création de packages
- [ ] Tester la création de formations
- [ ] Tester la création d'offres
- [ ] Vérifier les politiques RLS
- [ ] Ajouter des données de test
- [ ] Tester toutes les pages du module commercial

---

**Date de création** : 13 octobre 2025  
**Version** : 1.0.0  
**Status** : ✅ Prêt pour la production
