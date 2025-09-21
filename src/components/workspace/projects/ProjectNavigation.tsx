'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Users, 
  FileText,
  ChevronRight
} from 'lucide-react';

interface ProjectNavigationProps {
  projectId: string;
}

export function ProjectNavigation({ projectId }: ProjectNavigationProps) {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Vue d\'ensemble',
      href: `/projects/${projectId}`,
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Chronologie',
      href: `/projects/${projectId}/timeline`,
      icon: Calendar,
      exact: false
    },
    {
      name: 'Tâches',
      href: `/projects/${projectId}/tasks`,
      icon: CheckSquare,
      exact: false
    },
    {
      name: 'Ressources',
      href: `/projects/${projectId}/resources`,
      icon: Users,
      exact: false
    },
    {
      name: 'Documents',
      href: `/projects/${projectId}/documents`,
      icon: FileText,
      exact: false
    }
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="mb-6">
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap",
                isActive(item.href, item.exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
