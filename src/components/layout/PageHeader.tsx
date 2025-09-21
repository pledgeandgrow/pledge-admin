import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'admin' | 'success' | 'warning';
  };
}

export function PageHeader({ title, description, actions, badge }: PageHeaderProps) {
  const getBadgeClass = () => {
    switch (badge?.variant) {
      case 'admin':
        return 'bg-blue-600 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="space-y-1">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
          {badge && (
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getBadgeClass()}`}>
              {badge.text}
            </span>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
