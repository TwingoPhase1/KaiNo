import { useState, useEffect } from 'react';

export type AppTheme = 'theme-ios' | 'theme-samsung' | 'theme-android' | 'theme-generic';

/**
 * Converts RGB color channels to HSL (Hue, Saturation, Lightness).
 */
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Extracts Chrome/Android's AccentColor (which reflects system Material You themes on Android 12+)
 * and generates HSL shades to populate CSS variables.
 */
function applyAndroidDynamicColors() {
  if (typeof window === 'undefined') return;
  try {
    const testDiv = document.createElement('div');
    testDiv.style.color = 'AccentColor';
    testDiv.style.position = 'absolute';
    testDiv.style.left = '-9999px';
    document.body.appendChild(testDiv);
    const resolvedColor = window.getComputedStyle(testDiv).color;
    document.body.removeChild(testDiv);

    if (resolvedColor && resolvedColor.startsWith('rgb')) {
      const match = resolvedColor.match(/\d+/g);
      if (match && match.length >= 3) {
        const r = parseInt(match[0]);
        const g = parseInt(match[1]);
        const b = parseInt(match[2]);
        
        // Skip fallback black/white to keep premium default violet
        if ((r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255)) {
          return;
        }

        const { h, s, l } = rgbToHsl(r, g, b);
        const root = document.documentElement;
        
        root.style.setProperty('--android-dynamic-accent-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--android-dynamic-primary-hsl', `${h} ${s}% ${l}%`);

        // Generate dynamic light variables
        root.style.setProperty('--android-dynamic-bg-light', `${h} 12% 98%`);
        root.style.setProperty('--android-dynamic-card-light', `${h} 15% 94%`);
        root.style.setProperty('--android-dynamic-fg-light', `${h} 25% 10%`);
        root.style.setProperty('--android-dynamic-border-light', `${h} 15% 91%`);
        root.style.setProperty('--android-dynamic-input-light', `${h} 15% 92%`);
        root.style.setProperty('--android-dynamic-muted-light', `${h} 12% 45%`);

        // Generate dynamic dark variables
        root.style.setProperty('--android-dynamic-bg-dark', `${h} 20% 8%`);
        root.style.setProperty('--android-dynamic-card-dark', `${h} 20% 12%`);
        root.style.setProperty('--android-dynamic-fg-dark', `${h} 15% 95%`);
        root.style.setProperty('--android-dynamic-border-dark', `${h} 15% 16%`);
        root.style.setProperty('--android-dynamic-input-dark', `${h} 15% 18%`);
        root.style.setProperty('--android-dynamic-muted-dark', `${h} 10% 65%`);
      }
    }
  } catch (e) {
    console.warn('Failed to resolve Android dynamic colors:', e);
  }
}

/**
 * Custom React hook that resolves the current device-aware theme.
 * Returns the active theme string and guarantees hydration compatibility.
 */
export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>('theme-generic');

  useEffect(() => {
    // A. Apply dynamic Android Material You colors from AccentColor
    applyAndroidDynamicColors();

    // B. Check local storage manual selection override
    if (typeof window !== 'undefined') {
      let devTheme = null;
      try {
        devTheme = localStorage.getItem('kaino-dev-theme');
      } catch (e) {}
      if (devTheme && ['theme-ios', 'theme-samsung', 'theme-android', 'theme-generic'].includes(devTheme)) {
        setTheme(devTheme as AppTheme);
        return;
      }

      // C. Fallback to anti-FOUC sniffed classes
      const classes = (window as any).__THEME__ || document.documentElement.className;
      const detectedTheme = classes.split(' ').find((c: string) => 
        ['theme-ios', 'theme-samsung', 'theme-android', 'theme-generic'].includes(c)
      );
      if (detectedTheme) {
        setTheme(detectedTheme as AppTheme);
        return;
      }
    }

    // D. Client-side UA backup sniffing
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let resolvedTheme: AppTheme = 'theme-generic';
    if (/Samsung|SamsungBrowser|SM-/i.test(ua)) {
      resolvedTheme = 'theme-samsung';
    } else if (/iPhone|iPad|iPod/i.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      resolvedTheme = 'theme-ios';
    } else if (/Android/i.test(ua)) {
      resolvedTheme = 'theme-android';
    }
    
    setTheme(resolvedTheme);
  }, []);

  return theme;
}
