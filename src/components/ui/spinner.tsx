import React from 'react';

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
  return (
    <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-primary ${className}`}></div>
  );
};
