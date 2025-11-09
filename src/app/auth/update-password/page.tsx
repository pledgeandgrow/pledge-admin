'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // Supabase can send various parameters in password reset links
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const expiresIn = searchParams.get('expires_in');
  const isRecoveryFlow = type === 'recovery';
  
  // Check for any of the possible auth parameters
  const hasAuthParams = token || isRecoveryFlow || accessToken || refreshToken;
  
  // Log all parameters for debugging
  console.log('Auth parameters:', { 
    token: !!token, 
    type, 
    accessToken: !!accessToken, 
    refreshToken: !!refreshToken,
    expiresIn
  });
  
  const { updatePassword } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    
    // Debug all URL parameters
    if (typeof window !== 'undefined') {
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });
      console.log('All URL parameters:', allParams);
      
      // If we have a hash fragment in the URL, it might contain the access token
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashAccessToken = hashParams.get('access_token');
      const _hashType = hashParams.get('type');
      
      if (hashAccessToken) {
        console.log('Found access token in hash fragment');
        // We have the token in the hash, which means we need to process it
        // This is how Supabase sends the token for password reset
      }
    }
    
    // If no auth params are present, redirect to forgot password
    if (!hasAuthParams && typeof window !== 'undefined') {
      console.log('No auth parameters found, redirecting to forgot-password');
      router.push('/auth/forgot-password');
    } else {
      console.log('Auth parameters found, ready for password update');
    }
  }, [hasAuthParams, searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validation
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      
      if (!password || password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
      
      setIsLoading(true);
      console.log('Attempting to update password');
      
      // Check if we have a hash fragment in the URL with an access token
      let error = null;
      if (typeof window !== 'undefined') {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashAccessToken = hashParams.get('access_token');
        
        if (hashAccessToken) {
          // If we have an access token in the hash, we need to use it to update the password
          // This is a special case for password reset links
          try {
            // First, set the session with the access token
            const { data: { session: _resetSession }, error: sessionError } = 
              await supabase.auth.setSession({
                access_token: hashAccessToken,
                refresh_token: hashParams.get('refresh_token') || '',
              });
            
            if (sessionError) {
              console.error('Error setting session:', sessionError.message);
              error = sessionError;
            } else {
              console.log('Session set successfully for password reset');
              // Now update the password
              const { error: updateError } = await updatePassword(password);
              error = updateError;
            }
          } catch (err) {
            console.error('Error processing hash token:', err);
            error = { message: 'Failed to process authentication token' };
          }
        } else {
          // Normal password update
          const { error: updateError } = await updatePassword(password);
          error = updateError;
        }
      } else {
        // Fallback to normal password update
        const { error: updateError } = await updatePassword(password);
        error = updateError;
      }
      
      if (error) {
        console.error('Error updating password:', error.message);
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      // Show success toast
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        variant: "default",
      });
      
      // Redirect to sign in page with success message
      router.push('/auth/signin?message=Password updated successfully');
    } catch (err) {
      console.error('Unexpected error during password update:', err);
      setError('An unexpected error occurred. Please try again.');
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

  if (!hasAuthParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Invalid or expired password reset link. Please try resetting your password again.</p>
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
          <CardTitle className="text-2xl font-bold text-center text-white">
            {isSuccess ? 'Password Updated!' : 'Create New Password'}
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            {isSuccess 
              ? 'Your password has been updated successfully.'
              : 'Create a new password for your account.'}
          </CardDescription>
        </CardHeader>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div 
                  className="p-3 bg-red-900/50 border border-red-800 text-red-200 rounded text-sm flex items-center"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={8}
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
                <p className="text-xs text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Updating...
                  </>
                ) : (
                  'Update Password'
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
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="p-3 bg-green-900/50 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white text-center">
                Password Updated Successfully!
              </h3>
              <p className="text-gray-400 text-center text-sm">
                You&apos;ll be redirected to the sign in page shortly...
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
