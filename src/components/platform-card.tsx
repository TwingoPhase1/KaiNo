'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/lib/useTheme';

interface PlatformCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * PlatformCard — Adaptive card container.
 * 
 * iOS: Semi-transparent with backdrop blur, 12px radius (Inset Grouped style)
 * Material You: Tinted with dynamic accent color, 12px radius
 * Samsung One UI: Large 24px radius, no border, soft shadow
 * Generic: Standard card with subtle border
 */
export function PlatformCard({ children, className = '', onClick }: PlatformCardProps) {
  const { theme } = useTheme();

  if (theme === 'theme-samsung') {
    return (
      <div
        onClick={onClick}
        className={`oneui-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {children}
      </div>
    );
  }

  if (theme === 'theme-ios') {
    return (
      <div
        onClick={onClick}
        className={`rounded-xl bg-card/80 backdrop-blur-lg border-[0.5px] border-border/50 
          ${onClick ? 'cursor-pointer active:opacity-70 transition-opacity' : ''} 
          p-4 ${className}`}
      >
        {children}
      </div>
    );
  }

  if (theme === 'theme-android') {
    return (
      <div
        onClick={onClick}
        className={`rounded-xl bg-[rgba(var(--accent-rgb),0.08)] 
          ${onClick ? 'cursor-pointer ripple active:scale-[0.97] transition-transform' : ''} 
          p-4 ${className}`}
      >
        {children}
      </div>
    );
  }

  // Generic
  return (
    <div
      onClick={onClick}
      className={`rounded-md border border-border/80 bg-card 
        ${onClick ? 'cursor-pointer hover:bg-accent transition-colors' : ''} 
        p-4 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * PlatformCardGroup — Wraps multiple items in an iOS Inset Grouped style container.
 * For other platforms, just renders children directly.
 */
export function PlatformCardGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { theme } = useTheme();

  if (theme === 'theme-ios') {
    return (
      <div className={`ios-inset-grouped ${className}`}>
        {children}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
