import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Authentication - Pledge Portal',
  description: 'Sign in or create an account to access Pledge Portal',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-900 text-white`}>
      <main className="flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
