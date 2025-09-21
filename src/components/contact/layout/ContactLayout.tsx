import { ReactNode } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

interface ContactLayoutProps {
  children: ReactNode;
}

export function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <PageLayout>
      {children}
    </PageLayout>
  );
}
