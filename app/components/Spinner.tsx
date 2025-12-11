// src/app/components/Spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function Spinner({ 
  size = 'md', 
  color = 'border-blue-600',
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          animate-spin rounded-full 
          border-b-2 ${color}
          ${sizeClasses[size]}
        `}
      />
    </div>
  );
}