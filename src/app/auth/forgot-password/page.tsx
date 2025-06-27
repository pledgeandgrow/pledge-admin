'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();
  const { resetPassword } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await resetPassword(email);
    
    setIsLoading(false);
    
    if (error) {
      setError(error.message);
      return;
    }
    
    setIsSuccess(true);
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
              Reset Password
            </CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            {isSuccess 
              ? 'Check your email for a link to reset your password.'
              : 'Enter your email and we\'ll send you a link to reset your password.'}
          </CardDescription>
        </CardHeader>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div 
                  className="p-3 bg-red-900/50 border border-red-800 text-red-200 rounded text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-gray-900/50 border-gray-700 text-white"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Remember your password?{' '}
                <Link 
                  href="/auth/signin" 
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="p-3 bg-green-900/50 rounded-full">
                <MailCheck className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Check your email</h3>
              <p className="text-gray-400 text-center text-sm">
                We&apos;ve sent a password reset link to <span className="font-medium text-white">{email}</span>.
                The link will expire in 1 hour.
              </p>
              
              <div className="pt-4 w-full">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/auth/signin')}
                >
                  Back to Sign In
                </Button>
              </div>
              
              <div className="pt-4 text-center text-sm text-gray-500">
                <p>Didn&apos;t receive the email?</p>
                <div className="mt-1">
                  <button 
                    onClick={handleSubmit}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Resend email'}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
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
