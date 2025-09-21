'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleResendEmail = async () => {
    if (!email) {
      setError('No email address provided');
      return;
    }

    setResendLoading(true);
    setError(null);

    try {
      // Get the origin for the redirect URL
      const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || '';
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Error resending verification email:', error.message);
        setError(error.message);
        return;
      }

      toast({
        title: "Email sent",
        description: "Verification email has been resent. Please check your inbox.",
        variant: "default",
      });
    } catch (err) {
      console.error('Unexpected error during email resend:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/auth/signin');
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
            <Link href="/auth/signin" className="text-gray-400 hover:text-white mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle className="text-2xl font-bold text-white">
              Verify Your Email
            </CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            We've sent a verification email to:
          </CardDescription>
          <p className="font-medium text-white break-all">{email || 'your email address'}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div 
              className="p-3 bg-red-900/50 border border-red-800 text-red-200 rounded text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="p-4 bg-blue-900/30 rounded-full">
              <Mail className="h-10 w-10 text-blue-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-white">Check your inbox</h3>
              <p className="text-gray-400 text-sm">
                Click the link in the verification email to activate your account.
                If you don't see it, check your spam folder.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResendEmail}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Email
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-gray-400 hover:text-white"
            onClick={handleGoToLogin}
          >
            Back to Sign In
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
