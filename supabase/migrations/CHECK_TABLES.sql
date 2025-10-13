-- =====================================================
-- Script de vérification des tables
-- Exécutez ce script pour vérifier quelles tables existent
-- =====================================================

-- 1. Vérifier toutes les tables publiques
SELECT 
  table_name,
  'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Vérifier les tables spécifiques attendues
SELECT 
  'users' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 'contacts', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contacts') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'services', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'packages', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'formations', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formations') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'offers', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'offers') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'projects', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'tasks', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'events', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'documents', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documents') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'time_entries', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'time_entries') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'comments', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'attachments', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'attachments') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'activity_log', CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_log') THEN '✅ EXISTS' ELSE '❌ MISSING' END;

-- 3. Vérifier les vues
SELECT 
  'leads (view)' as view_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'leads') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 'clients (view)', CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'clients') THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'waitlist (view)', CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'waitlist') THEN '✅ EXISTS' ELSE '❌ MISSING' END;

-- 4. Vérifier les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Compter les enregistrements dans chaque table
DO $$
DECLARE
  table_record RECORD;
  row_count INTEGER;
BEGIN
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM public.%I', table_record.table_name) INTO row_count;
    RAISE NOTICE '% : % rows', table_record.table_name, row_count;
  END LOOP;
END $$;
