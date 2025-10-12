'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const errorParam = searchParams.get('error');
  const redirectedFrom = searchParams.get('redirectedFrom');
  const { signIn } = useAuth();
  const supabase = createClient();
  
  // Redirect URL is handled by the signIn function in AuthContext

  // Check for existing session and message on mount
  useEffect(() => {
    let isActive = true;
    setIsMounted(true);
    
    // Check for error message in URL
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
    
    // Check for success message in URL
    if (message) {
      setSuccessMessage(message);
      // Show toast notification
      toast({
        title: "Success",
        description: message,
        variant: "default",
      });
    }
    
    // Show message if redirected from protected route
    if (redirectedFrom && !errorParam && !message) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access that page",
        variant: "default",
      });
    }
    
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isActive && currentSession) {
          // If we have a session but are still on the sign-in page, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        if (isActive) {
          console.error('Error checking session:', error);
        }
      }
    };
    
    checkSession();
    
    // Cleanup function
    return () => {
      isActive = false;
    };
  }, [router, message, errorParam, redirectedFrom, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);

    try {
      // Use the signIn function from AuthContext
      const { error } = await signIn(email.trim(), password.trim());
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          // If email is not confirmed, redirect to verification page
          const verificationUrl = `/auth/verify-email?email=${encodeURIComponent(email)}`;
          router.push(verificationUrl);
          return;
        } else if (error.message.includes('Email rate limit exceeded')) {
          setError('Too many attempts. Please try again later.');
        } else {
          setError(error.message || 'Failed to sign in');
        }
        return;
      }
      
      // If no error, the AuthContext will handle the session and redirect
      router.push('/dashboard');
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      if (!isMounted) return; // Prevent state update if component unmounted
      setIsLoading(false);
    }
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
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-800">Signing in...</p>
          </div>
        </div>
      )}
      
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        
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
            
            {successMessage && (
              <div 
                className="p-3 bg-green-900/50 border border-green-800 text-green-200 rounded text-sm flex items-center"
                role="alert"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-gray-900/50 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-gray-900/50 border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
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
