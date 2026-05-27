'use client';

import { forwardRef, ReactNode } from 'react';
import { useTheme } from '@/lib/useTheme';
import { Search } from 'lucide-react';

interface PlatformInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Floating label for Material You outlined style */
  label?: string;
  /** Show search icon */
  showSearch?: boolean;
  /** Additional wrapper className */
  wrapperClassName?: string;
}

/**
 * PlatformInput — Adaptive text input.
 * 
 * iOS: Rounded search bar (10px radius, grey bg, no border)
 * Material You: Outlined text field with floating label on border
 * Samsung One UI: Large rounded input (24px radius)
 * Generic: Standard shadcn-style input
 */
export const PlatformInput = forwardRef<HTMLInputElement, PlatformInputProps>(
  ({ label, showSearch = false, wrapperClassName = '', className = '', ...props }, ref) => {
    const { theme } = useTheme();

    // iOS Search Bar
    if (theme === 'theme-ios') {
      return (
        <div className={`relative ${wrapperClassName}`}>
          {showSearch && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8e8e93]" />
          )}
          <input
            ref={ref}
            className={`ios-search-bar w-full ${showSearch ? 'pl-9' : 'pl-3'} ${className}`}
            {...props}
          />
        </div>
      );
    }

    // Material You Outlined TextField
    if (theme === 'theme-android') {
      if (label) {
        return (
          <div className={`m3-outlined-field ${wrapperClassName}`}>
            <label>{label}</label>
            {showSearch && (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            )}
            <input
              ref={ref}
              className={className}
              {...props}
            />
          </div>
        );
      }
      // No label — simple rounded Material input
      return (
        <div className={`relative ${wrapperClassName}`}>
          {showSearch && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          )}
          <input
            ref={ref}
            className={`w-full rounded-full border-none bg-[rgba(var(--accent-rgb),0.08)] py-3.5 text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/30 ${showSearch ? 'pl-12' : 'pl-4'} pr-4 ${className}`}
            {...props}
          />
        </div>
      );
    }

    // Samsung One UI Search
    if (theme === 'theme-samsung') {
      return (
        <div className={`relative ${wrapperClassName}`}>
          {showSearch && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8a8f98]" />
          )}
          <input
            ref={ref}
            className={`oneui-search w-full ${showSearch ? 'pl-12' : 'pl-4'} ${className}`}
            {...props}
          />
        </div>
      );
    }

    // Generic
    return (
      <div className={`relative ${wrapperClassName}`}>
        {showSearch && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        )}
        <input
          ref={ref}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${showSearch ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

PlatformInput.displayName = 'PlatformInput';
