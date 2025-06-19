'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  useEffect(() => {
    // Check if account is locked
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      setIsLocked(true);
      const remainingTime = lockoutEndTime - Date.now();
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLockoutEndTime(null);
        setLoginAttempts(0);
      }, remainingTime);
      return () => clearTimeout(timer);
    }
  }, [lockoutEndTime]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutEndTime! - Date.now()) / 1000);
      setErrors({
        general: `Account is temporarily locked. Please try again in ${remainingTime} seconds.`
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      // For demo purposes, let's assume authentication is successful
      const isAuthSuccessful = true;

      if (!isAuthSuccessful) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const endTime = Date.now() + LOCKOUT_DURATION;
          setLockoutEndTime(endTime);
          setIsLocked(true);
          setErrors({
            general: 'Too many failed attempts. Account locked for 5 minutes.'
          });
        } else {
          setErrors({
            general: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`
          });
        }
        return;
      }

      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again later.';
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="absolute top-0 left-0 right-0 flex justify-center mt-8">
        <Link href="/dashboard">
          <Image
            src="/logo/logo-white.png"
            alt="Pledge Portal Logo"
            width={128}
            height={128}
            className="h-32 w-auto cursor-pointer transition-transform hover:scale-105"
            priority
          />
        </Link>
      </div>
      
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Welcome to Pledge Portal</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errors.general && (
              <div 
                className="p-3 bg-red-900/50 border border-red-800 text-red-200 rounded text-sm"
                role="alert"
                aria-live="polite"
              >
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <Label 
                htmlFor="username" 
                className="text-gray-200 flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                Username
              </Label>
              <div className="relative">
                <Input 
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading || isLocked}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  autoComplete="username"
                  className={`bg-gray-900/50 border-gray-700 text-white ${
                    errors.username ? 'border-red-800 focus:border-red-700' : 'focus:border-gray-500'
                  }`}
                />
              </div>
              {errors.username && (
                <p 
                  id="username-error" 
                  className="text-red-400 text-xs mt-1"
                  role="alert"
                >
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-gray-200 flex items-center gap-2"
              >
                <LockIcon className="h-4 w-4" />
                Password
              </Label>
              <div className="relative">
                <Input 
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading || isLocked}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  autoComplete="current-password"
                  className={`bg-gray-900/50 border-gray-700 text-white pr-10 ${
                    errors.password ? 'border-red-800 focus:border-red-700' : 'focus:border-gray-500'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p 
                  id="password-error" 
                  className="text-red-400 text-xs mt-1"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit"
              className="w-full"
              disabled={isLoading || isLocked}
              variant="default"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="text-center">
              <Link 
                href="/forgot-password"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
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
