'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingWithTimeoutProps {
  isLoading: boolean;
  timeout?: number; // in milliseconds, default 10 seconds
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function LoadingWithTimeout({
  isLoading,
  timeout = 10000,
  error,
  onRetry,
  children,
}: LoadingWithTimeoutProps) {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoading) {
        console.error('⏱️ Loading timeout detected - possible infinite loop');
        setIsTimeout(true);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [isLoading, timeout]);

  // Show error if provided
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p className="text-sm">{error}</p>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show timeout warning
  if (isTimeout) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Temps de chargement dépassé</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p className="text-sm">
              Le chargement prend plus de temps que prévu. Cela peut indiquer :
            </p>
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>Une connexion réseau lente</li>
              <li>Un problème avec la base de données</li>
              <li>Des données manquantes</li>
            </ul>
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Recharger la page
              </Button>
              {onRetry && (
                <Button onClick={onRetry} variant="ghost" size="sm">
                  Réessayer
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4 space-y-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Chargement en cours...</p>
      </div>
    );
  }

  // Show content
  return <>{children}</>;
}
