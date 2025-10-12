# 💼 Module Workspace - Documentation

## Vue d'ensemble

Le module Workspace est le cœur de la gestion de projet : projets, tâches, calendrier, documents, suivi du temps et collaboration.

---

## 📋 Tables créées/mises à jour

### 1. **Projects** (`public.projects`)

Gestion des projets (table existante, colonnes ajoutées si manquantes).

**Champs principaux** :
- `name` - Nom du projet
- `description` - Description
- `project_type` - Type (Client, Internal, Partner, Lead)
- `status` - Statut (Active, On Hold, Completed, Cancelled)
- `start_date` / `end_date` - Dates
- `budget` - Budget
- `progress` - Progression (0-100%)
- `primary_contact_id` - Contact principal
- `team_contacts` - Équipe (JSONB)
- `tags` - Tags
- `priority` - Priorité (Low, Medium, High, Urgent)

### 2. **Tasks** (`public.tasks`)

Gestion des tâches (table existante, colonnes ajoutées si manquantes).

**Champs principaux** :
- `title` - Titre de la tâche
- `description` - Description
- `project_id` - Projet associé
- `status` - Statut (todo, in_progress, in_review, blocked, done, archived)
- `priority` - Priorité (low, medium, high, urgent)
- `assignee_ids` - Assignés (array)
- `start_at` / `due_at` - Dates
- `completed_at` - Date de complétion
- `progress` - Progression (0-100%)
- `estimate_hours` - Estimation (heures)
- `actual_hours` - Temps réel (heures)
- `parent_task_id` - Tâche parente (sous-tâches)
- `order_index` - Ordre d'affichage
- `comments` - Commentaires (JSONB)
- `tags` - Tags

### 3. **Events/Calendar** (`public.events`)

Gestion du calendrier (table existante, colonnes ajoutées si manquantes).

**Champs principaux** :
- `title` - Titre de l'événement
- `description` - Description
- `event_type` - Type d'événement
- `location` - Lieu
- `start_datetime` / `end_datetime` - Dates/heures
- `is_all_day` - Événement toute la journée
- `attendees` - Participants (JSONB)
- `recurrence` - Récurrence (JSONB)
- `priority` - Priorité
- `status` - Statut (scheduled, ongoing, completed, cancelled)

### 4. **Documents** (`public.documents`)

Gestion des documents (table existante, colonnes ajoutées si manquantes).

**Champs principaux** :
- `title` - Titre du document
- `description` - Description
- `document_type_id` - Type de document
- `file_path` - Chemin du fichier
- `file_name` - Nom du fichier
- `file_size` - Taille
- `file_type` - Type de fichier
- `version` - Version
- `status` - Statut (Draft, Active, Archived, Deleted)
- `project_id` - Projet associé
- `contact_id` - Contact associé
- `is_template` - Est un template
- `tags` - Tags

### 5. **Time Entries** (`public.time_entries`) ⭐ NOUVEAU

Suivi du temps de travail.

**Champs principaux** :
- `task_id` - Tâche associée
- `project_id` - Projet associé
- `user_id` - Utilisateur
- `start_time` - Début
- `end_time` - Fin
- `duration_minutes` - Durée (calculée automatiquement)
- `description` - Description
- `billable` - Facturable
- `hourly_rate` - Taux horaire
- `status` - Statut (running, paused, completed, cancelled)
- `tags` - Tags

### 6. **Comments** (`public.comments`) ⭐ NOUVEAU

Commentaires sur les tâches, projets, documents, événements.

**Champs principaux** :
- `entity_type` - Type d'entité (task, project, document, event)
- `entity_id` - ID de l'entité
- `content` - Contenu du commentaire
- `author_id` - Auteur
- `parent_comment_id` - Commentaire parent (threading)
- `reactions` - Réactions (JSONB) {emoji: [user_ids]}
- `is_edited` - Modifié
- `is_deleted` - Supprimé

### 7. **Attachments** (`public.attachments`) ⭐ NOUVEAU

Pièces jointes pour diverses entités.

**Champs principaux** :
- `entity_type` - Type d'entité
- `entity_id` - ID de l'entité
- `file_name` - Nom du fichier
- `file_path` - Chemin
- `file_size` - Taille
- `file_type` - Type
- `mime_type` - Type MIME
- `uploaded_by` - Uploadé par

### 8. **Activity Log** (`public.activity_log`) ⭐ NOUVEAU

Journal d'activité pour tracer les changements.

**Champs principaux** :
- `entity_type` - Type d'entité
- `entity_id` - ID de l'entité
- `action` - Action (created, updated, deleted, commented, assigned, completed, archived, restored)
- `description` - Description
- `changes` - Changements (JSONB) avant/après
- `user_id` - Utilisateur

---

## 🗂️ Structure des pages

### Pages implémentées

| Route | Composant | Description |
|-------|-----------|-------------|
| `/workspace/projects` | `ProjectsPage` | Liste des projets |
| `/workspace/projects/[id]` | `ProjectDetailPage` | Détails d'un projet |
| `/workspace/tasks` | `TasksPage` | Liste des tâches |
| `/workspace/calendar` | `CalendarPage` | Calendrier |
| `/workspace/documents` | `DocumentsPage` | Gestion des documents |

### Composants disponibles

**Projects** :
- `ProjectCard` - Carte de projet
- `ProjectDialog` - Formulaire de création/édition
- `ProjectDetail` - Vue détaillée

**Tasks** :
- `TaskList` - Liste de tâches
- `TaskCard` - Carte de tâche
- `TaskDialog` - Formulaire de tâche
- `TaskBoard` - Vue Kanban

**Calendar** :
- `Calendar` - Calendrier complet
- `EventDialog` - Formulaire d'événement

**Documents** :
- `DocumentList` - Liste de documents
- `DocumentUpload` - Upload de fichiers

---

## 🚀 Migration

### Appliquer la migration

1. Ouvrez Supabase Dashboard > SQL Editor
2. Copiez le contenu de `supabase/migrations/005_create_workspace_tables.sql`
3. Exécutez la requête

### Vérification après migration

```sql
-- Vérifier que toutes les nouvelles tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('time_entries', 'comments', 'attachments', 'activity_log');

-- Vérifier les colonnes ajoutées aux tables existantes
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'tasks', 'events', 'documents')
AND column_name IN ('progress', 'estimate_hours', 'is_all_day', 'version');
```

---

## 📊 Exemples d'utilisation

### Créer un projet

```sql
INSERT INTO public.projects (
  name,
  description,
  project_type,
  status,
  budget,
  progress,
  priority
) VALUES (
  'Refonte du site web',
  'Refonte complète du site corporate',
  'Client',
  'Active',
  15000.00,
  25,
  'High'
);
```

### Créer une tâche

```sql
INSERT INTO public.tasks (
  project_id,
  title,
  description,
  status,
  priority,
  assignee_ids,
  due_at,
  estimate_hours
) VALUES (
  'project-uuid-here',
  'Design de la homepage',
  'Créer les maquettes de la page d''accueil',
  'todo',
  'high',
  ARRAY['user-uuid-1', 'user-uuid-2'],
  '2025-11-15 17:00:00+00',
  8
);
```

### Démarrer un suivi de temps

```sql
INSERT INTO public.time_entries (
  task_id,
  project_id,
  user_id,
  start_time,
  description,
  billable,
  hourly_rate,
  status
) VALUES (
  'task-uuid-here',
  'project-uuid-here',
  auth.uid(),
  NOW(),
  'Travail sur le design',
  true,
  75.00,
  'running'
);
```

### Arrêter le suivi de temps

```sql
UPDATE public.time_entries
SET 
  end_time = NOW(),
  status = 'completed'
WHERE id = 'time-entry-uuid-here';
-- duration_minutes est calculé automatiquement par le trigger
```

### Ajouter un commentaire

```sql
INSERT INTO public.comments (
  entity_type,
  entity_id,
  content,
  author_id
) VALUES (
  'task',
  'task-uuid-here',
  'Excellent travail ! Quelques ajustements mineurs à faire.',
  auth.uid()
);
```

### Logger une activité

```sql
SELECT public.log_activity(
  'task',
  'task-uuid-here',
  'completed',
  'Tâche terminée avec succès',
  '{"status": {"from": "in_progress", "to": "done"}}'::jsonb
);
```

---

## 🔒 Sécurité (RLS)

### Politiques appliquées

**Time Entries** :
- SELECT - Tous les utilisateurs authentifiés
- INSERT - Utilisateurs peuvent créer leurs propres entrées
- UPDATE - Utilisateurs peuvent modifier leurs propres entrées
- DELETE - Utilisateurs peuvent supprimer leurs propres entrées

**Comments** :
- SELECT - Tous les utilisateurs authentifiés
- INSERT - Tous les utilisateurs authentifiés
- UPDATE - Utilisateurs peuvent modifier leurs propres commentaires
- DELETE - Utilisateurs peuvent supprimer leurs propres commentaires

**Attachments** :
- SELECT - Tous les utilisateurs authentifiés
- INSERT - Tous les utilisateurs authentifiés
- DELETE - Utilisateurs peuvent supprimer leurs propres pièces jointes

**Activity Log** :
- SELECT - Tous les utilisateurs authentifiés (lecture seule)
- INSERT - Système uniquement

---

## 📈 Rapports et statistiques

### Temps passé par projet

```sql
SELECT 
  p.name as project_name,
  SUM(te.duration_minutes) / 60.0 as total_hours,
  COUNT(DISTINCT te.user_id) as team_members,
  SUM(CASE WHEN te.billable THEN te.duration_minutes * te.hourly_rate / 60.0 ELSE 0 END) as billable_amount
FROM public.time_entries te
JOIN public.projects p ON te.project_id = p.id
WHERE te.status = 'completed'
GROUP BY p.id, p.name
ORDER BY total_hours DESC;
```

### Tâches par statut

```sql
SELECT 
  status,
  COUNT(*) as count,
  ROUND(AVG(progress), 2) as avg_progress
FROM public.tasks
WHERE project_id = 'project-uuid-here'
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'done' THEN 1
    WHEN 'in_progress' THEN 2
    WHEN 'in_review' THEN 3
    WHEN 'blocked' THEN 4
    WHEN 'todo' THEN 5
    ELSE 6
  END;
```

### Activité récente

```sql
SELECT 
  al.action,
  al.entity_type,
  al.description,
  u.first_name || ' ' || u.last_name as user_name,
  al.created_at
FROM public.activity_log al
LEFT JOIN public.users u ON al.user_id = u.id
WHERE al.entity_id = 'entity-uuid-here'
ORDER BY al.created_at DESC
LIMIT 20;
```

---

## 🎯 Fonctionnalités avancées

### Triggers automatiques

1. **Calcul automatique de la durée** - Quand `end_time` est défini sur un `time_entry`
2. **Mise à jour de `updated_at`** - Sur toutes les tables
3. **Logging automatique** - Via la fonction `log_activity()`

### Fonctions utilitaires

**`log_activity()`** - Logger une activité
```sql
SELECT public.log_activity(
  'task',           -- entity_type
  'uuid-here',      -- entity_id
  'updated',        -- action
  'Description',    -- description (optional)
  '{}'::jsonb       -- changes (optional)
);
```

---

## ✅ Checklist de mise en production

- [ ] Appliquer la migration `005_create_workspace_tables.sql`
- [ ] Vérifier que toutes les tables sont créées
- [ ] Vérifier que les colonnes ont été ajoutées aux tables existantes
- [ ] Tester la création de projets
- [ ] Tester la création de tâches
- [ ] Tester le suivi de temps
- [ ] Tester les commentaires
- [ ] Tester les pièces jointes
- [ ] Vérifier les politiques RLS
- [ ] Tester toutes les pages du module workspace

---

**Date de création** : 13 octobre 2025  
**Version** : 1.0.0  
**Status** : ✅ Prêt pour la production
