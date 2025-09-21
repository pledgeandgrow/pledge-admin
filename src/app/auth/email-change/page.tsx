'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmailChangePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const newEmail = searchParams.get('new_email') || '';
  const oldEmail = searchParams.get('old_email') || '';
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="absolute top-0 left-0 right-0 flex justify-center mt-8">
        <Link href="/">
          <div className="relative h-32 w-32 cursor-pointer transition-transform hover:scale-105">
            <Image
              src="/logo/logo-white.png"
              alt="Pledge Portal Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 8rem, 8rem"
            />
          </div>
        </Link>
      </div>
      
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-400 hover:text-white mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle className="text-2xl font-bold text-white">
              {success ? 'Email Changed' : 'Email Change Requested'}
            </CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            {success 
              ? 'Your email address has been successfully updated.'
              : 'Your email change request has been received.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="p-4 bg-green-900/30 rounded-full">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <div className="text-center space-y-2">
              {success ? (
                <>
                  <h3 className="text-lg font-medium text-white">Email Successfully Updated</h3>
                  <p className="text-gray-400 text-sm">
                    Your email address has been changed from <span className="font-medium text-white">{oldEmail}</span> to <span className="font-medium text-white">{newEmail}</span>.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    You can now use your new email address to sign in to your account.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-white">Verification Required</h3>
                  <p className="text-gray-400 text-sm">
                    We've sent a verification email to <span className="font-medium text-white">{newEmail}</span>.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Please check your inbox and click the verification link to complete the email change process.
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full"
            onClick={handleGoToDashboard}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Go to Dashboard'
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="fixed bottom-0 left-0 w-full text-gray-400 text-center py-4 text-sm">
        <p>
          Pledge Portal &copy; {new Date().getFullYear()} | 
          <Link 
            href="/privacy-policy" 
            className="text-gray-400 hover:text-gray-300 transition-colors ml-2"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
