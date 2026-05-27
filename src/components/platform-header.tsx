'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '@/lib/useTheme';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PlatformHeaderProps {
  /** Main title text */
  title: string | ReactNode;
  /** Optional subtitle below title */
  subtitle?: string | ReactNode;
  /** Right-side action buttons */
  actions?: ReactNode;
  /** Show a back button */
  showBack?: boolean;
  /** Custom back handler */
  onBack?: () => void;
  /** Additional content in header area (e.g. SyncIndicator) */
  extra?: ReactNode;
  /** Whether this is a list detail page (affects Samsung layout) */
  isListDetail?: boolean;
}

/**
 * PlatformHeader — Adaptive page header.
 * 
 * iOS: Large Title (34px) that collapses on scroll → small title in sticky blur bar
 * Material You: Top App Bar with title and action icons
 * Samsung One UI: 1/3 screen height zone with large title at the bottom of the zone
 * Generic: Simple inline header
 */
export function PlatformHeader({
  title,
  subtitle,
  actions,
  showBack = false,
  onBack,
  extra,
  isListDetail = false,
}: PlatformHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const handleBack = onBack || (() => router.push('/'));

  useEffect(() => {
    if (theme !== 'theme-ios') return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]);

  // ========================
  // iOS — Human Interface Guidelines
  // ========================
  if (theme === 'theme-ios') {
    return (
      <>
        {/* Sticky collapsed header (shows on scroll) */}
        <header className={`ios-sticky-header ${scrolled ? '' : 'transparent'}`}>
          <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-11">
            <div className="flex items-center gap-2">
              {showBack && (
                <button onClick={handleBack} className="ios-text-btn flex items-center gap-0.5 text-[17px]">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="text-[17px]">Retour</span>
                </button>
              )}
              {scrolled && (
                <h1 className="text-[17px] font-semibold tracking-tight animate-in fade-in slide-in-from-top-2 duration-200">
                  {title}
                </h1>
              )}
            </div>
            {scrolled && <div className="flex items-center gap-1">{actions}</div>}
          </div>
        </header>

        {/* Large Title area (always in the DOM to prevent scroll jitter/collapse) */}
        <div className="max-w-2xl mx-auto px-4 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] pb-3">
          {showBack && (
            <button 
              onClick={handleBack} 
              className={`ios-text-btn flex items-center gap-0.5 text-[17px] mb-2 transition-all duration-200 ${
                scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className={`ios-large-title transition-all duration-200 ${scrolled ? 'opacity-0 scale-95 origin-left' : 'opacity-100'}`}>
                {title}
              </h1>
              {extra}
            </div>
            <div className={`flex items-center gap-1 transition-all duration-200 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {actions}
            </div>
          </div>
          {subtitle && (
            <div className={`transition-all duration-200 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {typeof subtitle === 'string' ? (
                <p className="text-[13px] text-muted-foreground mt-1 px-4">{subtitle}</p>
              ) : (
                <div className="mt-1 px-4">{subtitle}</div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  // ========================
  // Samsung One UI — Reachability Design
  // ========================
  if (theme === 'theme-samsung') {
    return (
      <section className="oneui-header-zone">
        {/* Top action row */}
        <div className="flex justify-between items-center mb-6">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full h-11 w-11 bg-card/50 border border-border/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>

        {/* Large Title at the bottom of the 1/3 zone */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="oneui-title">{title}</h1>
            {extra}
          </div>
          {subtitle && (
            <div className="flex items-center gap-3 pt-1">
              {subtitle}
            </div>
          )}
        </div>
      </section>
    );
  }

  // ========================
  // Material You (Pixel) — Top App Bar
  // ========================
  if (theme === 'theme-android') {
    return (
      <header className="m3-top-bar max-w-2xl mx-auto px-2">
        <div className="flex items-center gap-2 flex-1">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full ripple h-12 w-12"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          <div className="flex-1 px-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-normal tracking-normal">{title}</h1>
              {extra}
            </div>
            {subtitle && (
              <p className="text-[14px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {actions}
        </div>
      </header>
    );
  }

  // ========================
  // Generic / Desktop
  // ========================
  return (
    <header className="max-w-4xl mx-auto p-4 flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            {extra}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions}
      </div>
    </header>
  );
}
