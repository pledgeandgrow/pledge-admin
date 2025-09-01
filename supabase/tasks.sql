create table public.tasks (
  id uuid not null default gen_random_uuid (),
  project_id uuid null,
  title text not null,
  description text null,
  status text not null default 'todo'::text,
  priority text not null default 'medium'::text,
  created_by uuid null,
  assignee_ids uuid[] null,
  start_at timestamp with time zone null,
  due_at timestamp with time zone null,
  completed_at timestamp with time zone null,
  progress integer null default 0,
  estimate_hours numeric(6, 2) null,
  actual_hours numeric(6, 2) null,
  parent_task_id uuid null,
  order_index integer null default 0,
  comments jsonb not null default '[]'::jsonb,
  info jsonb not null default '{}'::jsonb,
  tags text[] null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint tasks_pkey primary key (id),
  constraint tasks_parent_task_id_fkey foreign KEY (parent_task_id) references tasks (id) on delete CASCADE,
  constraint tasks_project_id_fkey foreign KEY (project_id) references projects (id) on delete set null,
  constraint tasks_created_by_fkey foreign KEY (created_by) references contacts (id) on delete set null,
  constraint tasks_priority_check check (
    (
      priority = any (
        array[
          'low'::text,
          'medium'::text,
          'high'::text,
          'urgent'::text
        ]
      )
    )
  ),
  constraint tasks_progress_check check (
    (
      (progress >= 0)
      and (progress <= 100)
    )
  ),
  constraint tasks_status_check check (
    (
      status = any (
        array[
          'todo'::text,
          'in_progress'::text,
          'in_review'::text,
          'blocked'::text,
          'done'::text,
          'archived'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_tasks_project on public.tasks using btree (project_id) TABLESPACE pg_default;

create index IF not exists idx_tasks_status on public.tasks using btree (status, order_index) TABLESPACE pg_default;

create index IF not exists idx_tasks_priority on public.tasks using btree (priority) TABLESPACE pg_default;

create index IF not exists idx_tasks_parent on public.tasks using btree (parent_task_id, order_index) TABLESPACE pg_default;

create index IF not exists idx_tasks_assignees_gin on public.tasks using gin (assignee_ids) TABLESPACE pg_default;

create index IF not exists idx_tasks_tags_gin on public.tasks using gin (tags) TABLESPACE pg_default;

create index IF not exists idx_tasks_comments_gin on public.tasks using gin (comments) TABLESPACE pg_default;