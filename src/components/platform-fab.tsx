'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/lib/useTheme';
import { Plus } from 'lucide-react';

interface PlatformFabProps {
  onClick: () => void;
  icon?: ReactNode;
  label?: string;
}

/**
 * PlatformFab — Material You Floating Action Button.
 * Only renders on Android/Pixel theme. Returns null for other themes.
 */
export function PlatformFab({ onClick, icon, label }: PlatformFabProps) {
  const { theme } = useTheme();

  // Only show FAB on Material You
  if (theme !== 'theme-android') {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="m3-fab"
      title={label}
      aria-label={label || 'Action'}
    >
      {icon || <Plus className="h-6 w-6" />}
    </button>
  );
}
