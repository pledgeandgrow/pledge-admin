'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';

// Initialize Supabase client
const supabase = createClient();

interface SubMenuItem {
  href: string;
  icon: string;
  label: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  subItems: SubMenuItem[];
}

export function MegaMenu() {
  const { theme, setTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed left-0 top-0 h-screen w-64 bg-background border-r flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'logo-section',
      label: '',
      icon: '',
      subItems: [],
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      subItems: [],
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '📞',
      subItems: [
        { href: '/contact/board-members', icon: '👔', label: 'Board Members' },
        { href: '/contact/members', icon: '👥', label: 'Members' },
        { href: '/contact/freelance', icon: '🚀', label: 'Freelance' },
        { href: '/contact/partners', icon: '🤝', label: 'Partners' },
        { href: '/contact/investors', icon: '💰', label: 'Investors' },
        { href: '/contact/externe', icon: '🔧', label: 'Externe' },
        { href: '/contact/network', icon: '🌐', label: 'Network' },
      ],
    },
    {
      id: 'commercial',
      label: 'Commercial',
      icon: '🤝',
      subItems: [
        {
          href: '/commercial/lead',
          icon: '👥',
          label: 'Leads'
        },
        {
          href: '/commercial/clients',
          icon: '🤝',
          label: 'Clients'
        },
        {
          href: '/commercial/prestations',
          icon: '🛠️',
          label: 'Prestations'
        },
        {
          href: '/commercial/packages',
          icon: '📦',
          label: 'Packages'
        },
        {
          href: '/commercial/formation',
          icon: '📚',
          label: 'Formation'
        },
        {
          href: '/commercial/autres-offres',
          icon: '🎯',
          label: 'Autres Offres'
        },
        {
          href: '/commercial/waitlist',
          icon: '⏳',
          label: 'Liste d\'attente'
        }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: '📢',
      subItems: [
        { href: '/communication/presse', icon: '📰', label: 'Presse' },
        { href: '/communication/relations-publiques/page', icon: '🤝', label: 'Relations Publiques' },
        { href: '/communication/newsletter', icon: '📧', label: 'Newsletter' },
        { href: '/communication/evenements', icon: '🎪', label: 'Événements' },
        { href: '/communication/blog', icon: '✍️', label: 'Blog' },
      ],
    },
    {
      id: 'comptabilite',
      label: 'Finance',
      icon: '💰',
      subItems: [
        { href: '/comptabilite/facture', icon: '💸', label: 'Facture' },
        { href: '/comptabilite/devis', icon: '📜', label: 'Devis' },
        { href: '/comptabilite/depenses', icon: '💰', label: 'Dépenses' },
        { href: '/comptabilite/recettes', icon: '📈', label: 'Recettes' },
        { href: '/comptabilite/gestion-fournisseurs', icon: '👥', label: 'Fournisseurs' },
        { href: '/comptabilite/comptes-bancaires', icon: '🏦', label: 'Comptes bancaires' },
        { href: '/comptabilite/ecritures-comptables', icon: '📝', label: 'Écritures comptables' },
        { href: '/comptabilite/tva-et-taxes', icon: '💼', label: 'TVA & Taxes' },
        { href: '/comptabilite/rapports-financiers', icon: '📊', label: 'Rapports financiers' },
        { href: '/comptabilite/salaires-paiements', icon: '💵', label: 'Salaires & Paiements' },
      ],
    },
    {
      id: 'informatique',
      label: 'Informatique',
      icon: '💻',
      subItems: [
        { href: '/informatique/fiche-technique', icon: '📋', label: 'Fiche Technique' },
        { href: '/informatique/cahier-des-charges', icon: '📑', label: 'Cahier des charges' },
        { href: '/informatique/projets', icon: '📊', label: 'Projets' },
        { href: '/informatique/mise-a-jour', icon: '🔄', label: 'Mise à jour' },
        { href: '/informatique/test-et-validation', icon: '✅', label: 'Test et validation' },
        { href: '/informatique/serveurs', icon: '🖥️', label: 'Serveurs' },
        { href: '/informatique/vpn-acces', icon: '🔑', label: 'VPN & Accès' },
        { href: '/informatique/nom-de-domaine', icon: '🌐', label: 'Nom de domaine' },
        { href: '/informatique/architectures', icon: '🏗️', label: 'Architectures' },
        { href: '/informatique/automatisation', icon: '🤖', label: 'Automatisation' },
        { href: '/informatique/devops', icon: '⚙️', label: 'DevOps' },
        { href: '/informatique/cybersecurite', icon: '🔒', label: 'Cybersécurité' },
        { href: '/informatique/documentations', icon: '📚', label: 'Documentations' },
        { href: '/informatique/outils-metiers', icon: '🛠️', label: 'Outils Métiers' },
      ]
    },

    {
      id: 'marketing',
      label: 'Marketing',
      icon: '🎯',
      subItems: [
        {
          href: '/marketing/email-marketing',
          icon: '📧',
          label: 'Email Marketing'
        },
        {
          href: '/marketing/reseaux-sociaux',
          icon: '🌐',
          label: 'Réseaux Sociaux'
        },
        {
          href: '/marketing/publicite',
          icon: '📢',
          label: 'Publicité'
        },
        {
          href: '/marketing/contenu',
          icon: '📝',
          label: 'Contenu'
        },
        {
          href: '/marketing/branding',
          icon: '🎨',
          label: 'Branding'
        },
        {
          href: '/marketing/affiliation',
          icon: '🤝',
          label: 'Affiliation'
        },
        {
          href: '/marketing/fidelisation',
          icon: '🎯',
          label: 'Fidélisation'
        },
        {
          href: '/marketing/seo-sem',
          icon: '🔍',
          label: 'SEO/SEM'
        }
      ]
    },
    {
      id: 'rh',
      label: 'RH',
      icon: '👥',
      subItems: [
        { href: '/ressources-humaines/recrutement', icon: '🔍', label: 'Recrutement' },
        { href: '/ressources-humaines/staff', icon: '👥', label: 'Staff' },
        { href: '/ressources-humaines/formation', icon: '📚', label: 'Formation' },
        { href: '/ressources-humaines/administration', icon: '📋', label: 'Administration' },
        { href: '/ressources-humaines/conformite', icon: '⚖️', label: 'Conformité' },
        { href: '/ressources-humaines/paie', icon: '💰', label: 'Paie' },
        { href: '/ressources-humaines/performance', icon: '📊', label: 'Performance' },
      ],
    },

    {
      id: 'workspace',
      label: 'Workspace',
      icon: '💼',
      subItems: [
        { href: '/workspace/projects', icon: '📊', label: 'Projects' },
        { href: '/workspace/tasks', icon: '✅', label: 'Tasks' },
        { href: '/workspace/calendar', icon: '📅', label: 'Calendar' },
        { href: '/workspace/documents', icon: '📄', label: 'Documents' },
      ],
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      icon: '⚙️',
      subItems: [
        { href: '/parametres/profile', icon: '👤', label: 'Profile' },
        { href: '/parametres/securite', icon: '🔒', label: 'Sécurité' },
        { href: '/parametres/notifications', icon: '🔔', label: 'Notifications' },
        { href: '/parametres/preferences', icon: '⚙️', label: 'Préférences' },
        { href: '/parametres/theme', icon: '🎨', label: 'Thème' },
      ],
    },
  ];

  return (
    <div className="fixed left-0 top-0 flex h-screen">
      <nav className={cn(
        'flex flex-col w-64 bg-white dark:bg-gray-800',
        'border-r border-gray-200 dark:border-gray-700',
        'transition-colors duration-200 ease-in-out'
      )}>
        {/* Logo and User Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <Link href="/">
              <Image
                src={theme === 'dark' ? '/logo/logo-white.png' : '/logo/logo-black.png'}
                alt="Logo"
                width={160}
                height={64}
                className="h-16 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bonjour,
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              User Name
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          {menuItems.filter(item => item.id !== 'logo-section' && item.id !== 'parametres').map((item) => (
            <div key={item.id} className="relative">
              {item.id === 'dashboard' ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    'w-full px-4 py-2 text-left flex items-center justify-between',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'transition-colors duration-200'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    'w-full px-4 py-2 text-left flex items-center justify-between',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'transition-colors duration-200',
                    activeMenu === item.id ? 'bg-gray-100 dark:bg-gray-700' : '',
                    item.id === 'workspace' && 'my-2 bg-blue-50 dark:bg-blue-900/20 border-y border-blue-100 dark:border-blue-800'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "text-xl",
                      item.id === 'workspace' && 'text-blue-600 dark:text-blue-400'
                    )}>{item.icon}</span>
                    <span className={cn(
                      "text-sm font-medium text-gray-900 dark:text-white",
                      item.id === 'workspace' && 'font-semibold'
                    )}>
                      {item.label}
                    </span>
                  </div>
                  <svg
                    className={cn(
                      'w-4 h-4 text-gray-500 dark:text-gray-400',
                      'transition-transform duration-200',
                      activeMenu === item.id ? 'rotate-90' : '',
                      item.id === 'workspace' && 'text-blue-500 dark:text-blue-400'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={async () => {
              try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                window.location.href = '/';
              } catch (error) {
                console.error('Error signing out:', error);
              }
            }}
            className="w-full px-3 py-2 text-left flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>

        {/* Parameters Section at Bottom - Made more discrete */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          {menuItems.filter(item => item.id === 'parametres').map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleMenuClick(item.id)}
                className={cn(
                  'w-full px-3 py-1.5 text-left flex items-center justify-between', 
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  'transition-colors duration-200',
                  activeMenu === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                )}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-400">
                    {item.label}
                  </span>
                </div>
                <svg
                  className={cn(
                    'w-3 h-3 text-gray-500 dark:text-gray-400',
                    'transition-transform duration-200',
                    activeMenu === item.id ? 'rotate-90' : ''
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </nav>

      {/* Submenu Container */}
      {activeMenu && (
        <>
          {activeMenu !== 'parametres' ? (
            <div className="h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              {menuItems.map((item) => {
                if (item.id === activeMenu) {
                  return (
                    <div key={item.id} className="h-full flex flex-col">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            'w-full px-4 py-2 text-left',
                            'hover:bg-gray-100 dark:hover:bg-gray-700',
                            'transition-colors duration-200',
                            'flex items-center space-x-3',
                            'text-gray-900 dark:text-white'
                          )}
                        >
                          <span className="text-lg">{subItem.icon}</span>
                          <span className="text-sm font-medium">
                            {subItem.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <div className="absolute bottom-0 right-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-md shadow-lg z-10 max-h-64 overflow-auto">
              {menuItems.filter(item => item.id === 'parametres').map((item) => (
                <div key={item.id} className="flex flex-col text-xs">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        'w-full text-left',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        'transition-colors duration-200',
                        'flex items-center',
                        'text-gray-900 dark:text-white',
                        'px-3 py-1.5 space-x-2 text-xs'
                      )}
                    >
                      <span className="text-sm">{subItem.icon}</span>
                      <span className="text-xs font-normal">
                        {subItem.label}
                      </span>
                    </Link>
                  ))}

                  {/* Theme Toggle for Parameters */}
                  <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2"> 
                        <span className="text-sm">
                          {theme === 'dark' ? '🌙' : '☀️'}
                        </span>
                        <span className="text-xs font-normal text-gray-700 dark:text-gray-400"> 
                          {theme === 'dark' ? 'Mode Sombre' : 'Mode Clair'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTheme(theme === 'dark' ? 'light' : 'dark');
                        }}
                        className={cn(
                          'relative inline-flex h-5 w-9 items-center rounded-full', /* Made toggle smaller */
                          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200',
                          'transition-colors duration-200 ease-in-out'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-3 w-3 transform rounded-full bg-white', /* Made toggle handle smaller */
                            'transition-transform duration-200 ease-in-out',
                            theme === 'dark' ? 'translate-x-5' : 'translate-x-1' /* Adjusted translation */
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setActiveMenu(null)}
          />
        </>
      )}
    </div>
  );
}

export default MegaMenu;