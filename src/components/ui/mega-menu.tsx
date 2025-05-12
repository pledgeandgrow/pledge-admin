'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  href: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Cahier des Charges',
    href: '/informatique/cahier-des-charges',
    description: 'Créer et gérer les cahiers des charges',
  },
  {
    label: 'Fiche Technique',
    href: '/informatique/fiche-technique',
    description: 'Gérer les fiches techniques',
  },
  {
    label: 'Nom de Domaine',
    href: '/informatique/nom-de-domaine',
    description: 'Gérer les noms de domaine',
  },
  {
    label: 'Projets Clients',
    href: '/informatique/projets-clients',
    description: 'Suivre les projets clients',
  },
  {
    label: 'Projets Internes',
    href: '/informatique/projets-interne',
    description: 'Gérer les projets internes',
  },
];

export const MegaMenu: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
