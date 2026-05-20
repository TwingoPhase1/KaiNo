import { useState, useEffect } from 'react';

export type AppTheme = 'theme-ios' | 'theme-samsung' | 'theme-android' | 'theme-generic';

/**
 * Custom React hook that resolves the current device-aware theme.
 * Returns the active theme string and guarantees hydration compatibility.
 */
export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>('theme-generic');

  useEffect(() => {
    // 1. Check window.__THEME__ set by layout blocking script or document class
    if (typeof window !== 'undefined') {
      const detectedTheme = (window as any).__THEME__ || document.documentElement.className;
      if (detectedTheme && ['theme-ios', 'theme-samsung', 'theme-android', 'theme-generic'].includes(detectedTheme)) {
        setTheme(detectedTheme as AppTheme);
        return;
      }
    }

    // 2. Client-side fallback detection if not set earlier
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let resolvedTheme: AppTheme = 'theme-generic';
    if (/iPhone|iPad|iPod/i.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      resolvedTheme = 'theme-ios';
    } else if (/Samsung|SamsungBrowser/i.test(ua)) {
      resolvedTheme = 'theme-samsung';
    } else if (/Android/i.test(ua)) {
      resolvedTheme = 'theme-android';
    }
    
    setTheme(resolvedTheme);
  }, []);

  return theme;
}
