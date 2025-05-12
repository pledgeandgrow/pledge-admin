'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

      // Simulated authentication failure for demo
      const isAuthSuccessful = false;

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
    } catch (error) {
      setErrors({
        general: 'Failed to sign in. Please try again later.'
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
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 flex justify-center mt-8">
        <Image
          src="/logo-white.png"
          alt="Pledge Portal Logo"
          width={128}
          height={128}
          className="h-32 w-auto"
          priority
        />
      </div>
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        aria-labelledby="login-heading"
      >
        <h1 id="login-heading" className="text-2xl font-bold mb-6 text-center">
          Welcome to Pledge Portal
        </h1>
        
        {errors.general && (
          <div 
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            role="alert"
            aria-live="polite"
          >
            {errors.general}
          </div>
        )}

        <div className="mb-4">
          <label 
            className="block text-gray-700 text-sm font-bold mb-2" 
            htmlFor="username"
          >
            Username
          </label>
          <input 
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
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
          />
          {errors.username && (
            <p 
              id="username-error" 
              className="text-red-500 text-xs italic mt-1"
              role="alert"
            >
              {errors.username}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label 
            className="block text-gray-700 text-sm font-bold mb-2" 
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input 
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
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
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p 
              id="password-error" 
              className="text-red-500 text-xs italic mt-1"
              role="alert"
            >
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <button 
            className={`bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${
              (isLoading || isLocked) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={isLoading || isLocked}
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
          </button>
          <Link 
            href="/forgot-password"
            className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-800 transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>
      </form>

      <div className="fixed bottom-0 left-0 w-full bg-black text-white text-center py-4">
        <Link 
          href="/dashboard" 
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          Pledge Portal {new Date().getFullYear()}
        </Link>
      </div>
    </div>
  );
}
