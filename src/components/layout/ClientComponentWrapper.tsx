'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import ClientWrapper dynamically with ssr: false
const ClientWrapper = dynamic(() => import('@/components/layout/ClientWrapper'), { ssr: false });

export default function ClientComponentWrapper({ children }: { children: React.ReactNode }) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
