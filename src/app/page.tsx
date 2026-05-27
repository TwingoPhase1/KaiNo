'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db, ShoppingList } from '@/lib/db';
import { SyncIndicator } from '@/components/sync-indicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Settings, Fingerprint, Loader2, LogOut, Key, User, ShieldAlert, Sparkles, Download, Share, X, Search, Plus, ChevronRight } from 'lucide-react';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { useTranslation } from '@/lib/i18n';
import { useTheme } from '@/lib/useTheme';

/**
 * Home - Premium Glassmorphic Collaborative Dashboard for Kaino
 * Highly translated using local/server-aware translation hook.
 */
export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Dynamic Translations Hook
  const { t, loadingTranslations } = useTranslation();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; isAdmin?: boolean } | null>(null);

  // PWA states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  /**
   * Reactive polling: Load lists periodically to catch sync updates.
   */
  const refreshLists = useCallback(async () => {
    try {
      const allLists = await db.shoppingLists.toArray();
      setLists(allLists);
    } catch (e) {
      console.error("Failed to load lists:", e);
    }
  }, []);

  // 1. Core initialization: Check Setup status and Session status
  useEffect(() => {
    let isMounted = true;

    const checkSetupAndSession = async () => {
      try {
        // A. If setup is required, redirect to /setup-admin
        const setupResp = await fetch('/api/setup');
        if (!setupResp.ok) {
          const data = await setupResp.json();
          console.error('❌ Setup check failed:', data);
          if (isMounted) {
            setAuthError(`${data.error || 'Erreur vérification setup'} (${data.details || ''})`);
            setLoading(false);
            setIsAuthenticated(false);
          }
          return;
        }
        const setupData = await setupResp.json();
        if (setupData.setup_required) {
          if (isMounted) {
            console.log('🔄 Setup required, redirecting to /setup-admin');
            router.push('/setup-admin');
          }
          return;
        }

        // B. Check session status
        const statusResp = await fetch('/api/auth/status');
        if (statusResp.ok) {
          const statusData = await statusResp.json();
          if (statusData.authenticated) {
            if (isMounted) {
              setIsAuthenticated(true);
              setCurrentUser(statusData.user);
              localStorage.setItem('kaino-setup-done', '1');
              await refreshLists();
              setLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        console.error('❌ Failed to run initial auth/setup checks:', err);
        if (isMounted) {
          setAuthError(`Erreur initialisation: ${err instanceof Error ? err.message : String(err)}`);
          setLoading(false);
          setIsAuthenticated(false);
        }
      }

      // If we are not authenticated, update state to show authentication overlay
      if (isMounted) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkSetupAndSession();

    return () => {
      isMounted = false;
    };
  }, [router, refreshLists]);

  // 2. Poll list items every 2 seconds if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(refreshLists, 2000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, refreshLists]);

  // 3. Auto-trigger Passkey login on mount (when isAuthenticated becomes false)
  useEffect(() => {
    if (isAuthenticated === false) {
      handlePasskeyLogin(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 4. PWA Installation Event Listener and Development PNG Icon Generation Hook
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // A. Platform and Standalone Detection
    const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsIOS(ios);

    const dismissed = localStorage.getItem('kaino-pwa-dismissed') === '1';
    if (!isStandalone && !dismissed) {
      if (ios) {
        setShowInstallBanner(true);
      }
    }

    // B. Capture BeforeInstallPrompt for Android/Chrome/Samsung
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone && !dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // C. SVG-to-PNG Auto-conversion in Development mode
    if (process.env.NODE_ENV === 'development') {
      const key = 'kaino-icons-converted-v2';
      if (!localStorage.getItem(key)) {
        const convertIcons = async () => {
          try {
            const convertSvgToPng = (svgUrl: string, size: number, filename: string) => {
              return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = svgUrl;
                img.onload = async () => {
                  try {
                    const canvas = document.createElement('canvas');
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                      reject(new Error('No canvas context'));
                      return;
                    }
                    ctx.drawImage(img, 0, 0, size, size);
                    const dataUrl = canvas.toDataURL('image/png');
                    
                    const res = await fetch('/api/dev/save-png', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ filename, data: dataUrl })
                    });
                    if (res.ok) {
                      resolve();
                    } else {
                      reject(new Error(`Failed to save ${filename}`));
                    }
                  } catch (e) {
                    reject(e);
                  }
                };
                img.onerror = () => reject(new Error(`Failed to load ${svgUrl}`));
              });
            };

            await convertSvgToPng('/icon-192.svg', 192, 'icon-192.png');
            await convertSvgToPng('/icon-512.svg', 512, 'icon-512.png');
            localStorage.setItem(key, 'true');
            console.log('🎉 [PWA Dev Tool] PNG Icons successfully generated and saved to /public');
          } catch (err) {
            console.error('❌ [PWA Dev Tool] Failed to auto-generate PNG icons:', err);
          }
        };
        convertIcons();
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install outcome: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleDismissPWA = () => {
    localStorage.setItem('kaino-pwa-dismissed', '1');
    setShowInstallBanner(false);
  };

  // Passkey assertion/login trigger
  const handlePasskeyLogin = async (isAuto = false) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const respOptions = await fetch('/api/auth/login-options');
      if (!respOptions.ok) {
        const data = await respOptions.json();
        const errorMsg = data.details ? `${data.error} (${data.details})` : data.error || t('error_fetch_options');
        throw new Error(errorMsg);
      }
      const options = await respOptions.json();

      let assertionResponse;
      try {
        assertionResponse = await startAuthentication(options);
      } catch (authError: any) {
        // User cancelled or authentication prompt failed
        console.warn('WebAuthn authentication cancelled or failed:', authError);
        throw new Error(t('login_error_cancelled'));
      }

      const respVerify = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertionResponse),
      });

      if (!respVerify.ok) {
        const data = await respVerify.json();
        const errorMsg = data.details ? `${data.error} (${data.details})` : data.error || t('error_verify_passkey');
        throw new Error(errorMsg);
      }

      // Success! Fetch status to update user state
      const statusResp = await fetch('/api/auth/status');
      if (statusResp.ok) {
        const statusData = await statusResp.json();
        if (statusData.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(statusData.user);
          localStorage.setItem('kaino-setup-done', '1');
          await refreshLists();
        }
      }
    } catch (err: any) {
      console.error('Error logging in via Passkey:', err);
      if (!isAuto) {
        setAuthError(err.message || t('error_login'));
      } else {
        // Silent notification for auto-fails, invite to retry
        setAuthError(t('passkey_required'));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Passkey registration/creation trigger
  const handlePasskeyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim()) {
      setAuthError(t('register_error_username_required'));
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      const respOptions = await fetch(`/api/auth/register-options?username=${encodeURIComponent(regUsername.trim())}`);
      if (!respOptions.ok) {
        const data = await respOptions.json();
        const errorMsg = data.details ? `${data.error} (${data.details})` : data.error || t('error_register_options');
        throw new Error(errorMsg);
      }
      const options = await respOptions.json();

      let registrationResponse;
      try {
        registrationResponse = await startRegistration(options);
      } catch (authError: any) {
        console.warn('WebAuthn registration cancelled or failed:', authError);
        throw new Error(t('register_error_cancelled'));
      }

      const respVerify = await fetch('/api/auth/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationResponse),
      });

      if (!respVerify.ok) {
        const data = await respVerify.json();
        const errorMsg = data.details ? `${data.error} (${data.details})` : data.error || t('error_register_verify');
        throw new Error(errorMsg);
      }

      // Success! Fetch status to update user state
      const statusResp = await fetch('/api/auth/status');
      if (statusResp.ok) {
        const statusData = await statusResp.json();
        if (statusData.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(statusData.user);
          localStorage.setItem('kaino-setup-done', '1');
          await refreshLists();
        }
      }
    } catch (err: any) {
      console.error('Error creating admin via Passkey:', err);
      setAuthError(err.message || t('error_create'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const resp = await fetch('/api/auth/logout', { method: 'POST' });
      if (resp.ok) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLists([]);
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading || loadingTranslations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 dark:text-indigo-400" />
          <div className="text-muted-foreground font-medium animate-pulse">{t('initialization')}</div>
        </div>
      </div>
    );
  }

  // --- PREMIUM AUTHENTICATION OVERLAY ---
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 text-slate-900 dark:text-slate-100 overflow-hidden relative">
        {/* Animated background highlights in dark mode */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6000ms' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8000ms' }} />

        <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl text-slate-900 dark:text-slate-100 shadow-2xl relative overflow-hidden rounded-2xl">
          {/* Glowing top line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 relative group">
              <Fingerprint className="h-10 w-10 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform animate-pulse" />
              <Sparkles className="h-4 w-4 text-pink-400 absolute top-0 right-0 animate-bounce" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 dark:from-indigo-200 dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              {showRegister ? t('register_title') : t('login_title')}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-2 text-sm px-4">
              {showRegister ? t('register_subtitle') : t('login_subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-4">
            {showRegister ? (
              <form onSubmit={handlePasskeyRegister} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="regUsername" className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
                    {t('register_username_label')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="regUsername"
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      required
                      disabled={authLoading}
                      className="bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 pl-10 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder={t('setup_username_placeholder')}
                    />
                  </div>
                </div>

                {authError && (
                  <div className="text-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-300 p-3 rounded-lg flex items-start gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    <p>{authError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all py-6 font-semibold rounded-lg gap-2" 
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('register_btn_loading')}
                      </>
                    ) : (
                      <>
                        <Key className="h-5 w-5" />
                        {t('setup_btn_create')}
                      </>
                    )}
                  </Button>

                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowRegister(false);
                      setAuthError(null);
                    }}
                    className="w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-sm"
                    disabled={authLoading}
                  >
                    {t('auth_login_btn')}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Button 
                    onClick={() => handlePasskeyLogin(false)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all py-8 font-semibold rounded-xl text-base gap-3 flex flex-col justify-center items-center" 
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>{t('login_btn_checking')}</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="h-7 w-7 text-indigo-200 animate-pulse" />
                        <span>{t('login_btn_unlock')}</span>
                      </>
                    )}
                  </Button>

                  {authError && (
                    <div className="text-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-300 p-3 rounded-lg flex items-start gap-2.5">
                      <ShieldAlert className="h-5 w-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                      <p>{authError}</p>
                    </div>
                  )}

                  <div className="relative my-4 flex items-center justify-center">
                    <span className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800" />
                    <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-widest">{t('auth_or')}</span>
                  </div>

                  <Button 
                    onClick={() => {
                      setShowRegister(true);
                      setAuthError(null);
                    }}
                    variant="outline"
                    className="w-full border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-6 rounded-lg font-medium"
                    disabled={authLoading}
                  >
                    {t('auth_register_btn')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case 'theme-samsung':
        return 'Samsung One UI';
      case 'theme-android':
        return 'Android Material You';
      case 'theme-ios':
        return 'iOS Safari';
      default:
        return 'Generic Default';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="max-w-4xl mx-auto p-4 w-full flex-grow">
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Kaino</h1>
            <SyncIndicator compact hideCount />
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <span className="text-xs text-muted-foreground mr-2 font-medium bg-muted px-2.5 py-1 rounded-full flex items-center gap-1.5 border">
                <User className="h-3.5 w-3.5 text-indigo-400" />
                {currentUser.username}
              </span>
            )}
            {currentUser && currentUser.isAdmin && (
              <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} title={t('administration')}>
                <Settings className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout} title={t('disconnect')}>
              <LogOut className="h-5 w-5 text-rose-400" />
            </Button>
          </div>
        </header>

        <div className="space-y-6 mt-8">
          {showInstallBanner && (
            <Card className="relative overflow-hidden border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 backdrop-blur-md shadow-xl shadow-indigo-500/5 animate-in slide-in-from-top-4 duration-300">
              {/* Glowing decorative blur orb */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
              <button 
                onClick={handleDismissPWA}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800/25 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors z-10"
                title="Ignorer"
              >
                <X className="h-4 w-4" />
              </button>
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
                    <Download className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">{t('pwa_install_title')}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">{t('pwa_install_desc')}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleInstallPWA}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all rounded-xl px-5 py-2 w-full sm:w-auto shrink-0 self-end sm:self-center"
                >
                  {t('pwa_install_btn')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* SEARCH BAR & CREATE BUTTON CONTAINER */}
          <div className="flex gap-3 w-full items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder={t('search_placeholder') || "Rechercher..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 w-full transition-all ${
                  theme === 'theme-samsung'
                    ? 'rounded-2xl border-none bg-slate-100/50 dark:bg-slate-800/40 focus-visible:ring-2 focus-visible:ring-indigo-500/20 py-5'
                    : theme === 'theme-android'
                    ? 'rounded-full border-none bg-violet-100/30 dark:bg-violet-950/20 focus-visible:ring-2 focus-visible:ring-primary/20 py-5 pl-11'
                    : theme === 'theme-ios'
                    ? 'rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/50 py-5 pl-10 focus-visible:ring-0 focus-visible:border-primary'
                    : 'rounded-md'
                }`}
              />
            </div>
            <Button
              onClick={() => router.push('/lists/new')}
              className={`theme-btn font-semibold gap-1.5 shrink-0 ${
                theme === 'theme-samsung'
                  ? 'rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 px-5 py-5 h-auto text-sm'
                  : theme === 'theme-android'
                  ? 'rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow px-5 py-5 h-auto ripple text-sm'
                  : theme === 'theme-ios'
                  ? 'rounded-xl bg-primary text-white hover:bg-primary/90 px-4 py-5 h-auto text-sm font-medium'
                  : 'rounded-md'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{t('dashboard_lists_create_btn') || "Créer une liste"}</span>
            </Button>
          </div>

          {/* SEQUENTIAL LISTS FLOW */}
          <div className="space-y-3.5">
            {filteredLists.length > 0 ? (
              filteredLists.map((list) => {
                if (theme === 'theme-samsung') {
                  return (
                    <div
                      key={list.id}
                      onClick={() => router.push(`/lists/${list.id}`)}
                      className="group flex items-center justify-between p-5 rounded-[26px] bg-white dark:bg-[#212124] shadow-[0_8px_24px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_12px_32px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none border border-slate-100/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-[20px] shadow-inner">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-[17px] text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                            {list.name}
                          </h3>
                          <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                            {t('sharing')}: {list.shareId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-bold select-none">
                          {t('dashboard_lists_open') || "Ouvrir"}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                }

                if (theme === 'theme-ios') {
                  return (
                    <div
                      key={list.id}
                      onClick={() => router.push(`/lists/${list.id}`)}
                      className="group flex items-center justify-between p-4 bg-white/95 dark:bg-[#1c1c1e]/90 backdrop-blur-md rounded-2xl hover:bg-slate-50 dark:hover:bg-[#2c2c2e]/90 active:opacity-75 transition-all cursor-pointer border border-slate-200/50 dark:border-white/5 select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                          <ShoppingBag className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-[16px] text-black dark:text-white tracking-tight">
                            {list.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                            ID: {list.shareId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span className="text-[12px] opacity-80 mr-1">
                          {t('dashboard_lists_open') || "Ouvrir"}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  );
                }

                if (theme === 'theme-android') {
                  return (
                    <div
                      key={list.id}
                      onClick={() => router.push(`/lists/${list.id}`)}
                      className="group flex items-center justify-between p-5 rounded-[22px] bg-violet-100/30 dark:bg-violet-950/15 hover:bg-violet-100/50 dark:hover:bg-violet-950/25 active:scale-[0.97] ripple transition-all cursor-pointer border border-transparent select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-500/20 text-violet-600 dark:text-violet-300 rounded-full">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                            {list.name}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {t('sharing')}: {list.shareId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-violet-500/10 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full font-semibold">
                          {t('dashboard_lists_open') || "Ouvrir"}
                        </span>
                        <ChevronRight className="h-4 w-4 text-violet-400" />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={list.id}
                    onClick={() => router.push(`/lists/${list.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/80 bg-card hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-base">{list.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{t('sharing')}: {list.shareId}</p>
                    </div>
                    <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {t('dashboard_lists_open') || "Ouvrir"}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`flex flex-col items-center justify-center p-12 text-center border border-dashed ${
                theme === 'theme-samsung'
                  ? 'rounded-[26px] bg-white/50 dark:bg-[#212124]/30 border-slate-200 dark:border-slate-800'
                  : theme === 'theme-android'
                  ? 'rounded-[22px] bg-violet-100/10 dark:bg-violet-950/5 border-violet-200/40 dark:border-violet-950/20'
                  : theme === 'theme-ios'
                  ? 'rounded-2xl bg-white/30 dark:bg-[#1c1c1e]/30 border-slate-200/40 dark:border-slate-800/40'
                  : 'rounded-lg border-muted'
              }`}>
                <ShoppingBag className={`h-12 w-12 text-muted-foreground/40 mb-4 animate-pulse`} />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {searchQuery ? (t('no_lists_found') || "Aucune liste trouvée") : (t('no_lists_yet') || "Aucune liste disponible")}
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
                  {searchQuery 
                    ? (t('try_different_search') || "Essayez d'ajuster votre terme de recherche.")
                    : (t('create_first_list_desc') || "Commencez dès aujourd'hui en créant votre première liste de courses collaborative.")
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => router.push('/lists/new')}
                    className={`mt-4 ${
                      theme === 'theme-samsung' ? 'rounded-2xl' : theme === 'theme-android' ? 'rounded-full' : theme === 'theme-ios' ? 'rounded-xl' : ''
                    }`}
                  >
                    {t('dashboard_lists_create_btn') || "Créer une liste"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DISCREET BOTTOM-RIGHT FOOTER */}
      <div className="fixed bottom-3 right-4 text-[10px] text-slate-400 dark:text-slate-500/70 font-sans tracking-tight pointer-events-none select-none z-50 hover:opacity-100 transition-opacity">
        Kaino v0.06 • {getThemeLabel(theme)}
      </div>

      {/* DEVELOPMENT DEV TOOLS - TEMPORARY THEME SELECTOR */}
      <div className="fixed bottom-3 left-4 z-50 flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded-full px-3 py-1.5 shadow-xl text-xs backdrop-blur-md text-slate-100 font-sans select-none">
        <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider">Dev:</span>
        <select
          value={theme}
          onChange={(e) => {
            const newTheme = e.target.value;
            localStorage.setItem('kaino-dev-theme', newTheme);
            const isDark = document.documentElement.classList.contains('dark') || 
                           window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.className = newTheme + (isDark ? ' dark' : '');
            (window as any).__THEME__ = newTheme;
            window.location.reload();
          }}
          className="bg-transparent border-none text-slate-100 font-semibold focus:outline-none cursor-pointer pr-1 text-[11px] outline-none"
        >
          <option value="theme-generic" className="bg-slate-900 text-slate-100">💻 Default</option>
          <option value="theme-samsung" className="bg-slate-900 text-slate-100">📱 Samsung</option>
          <option value="theme-ios" className="bg-slate-900 text-slate-100">🍎 iOS</option>
          <option value="theme-android" className="bg-slate-900 text-slate-100">🤖 Android</option>
        </select>
      </div>

      {/* iOS Safari manual installation guidance drawer/overlay */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl max-w-md w-full rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/35 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/5">
                <Share className="h-8 w-8 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">{t('pwa_ios_title')}</h3>
              <p className="text-sm text-slate-400 mt-2 px-2 leading-relaxed">
                {t('pwa_ios_desc')}
              </p>
            </div>
            <div className="mt-6 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3.5 text-xs text-slate-300 font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30 shrink-0">1</span>
                <span className="pt-0.5">{"Appuyez sur le bouton "}<strong className="text-indigo-400 font-semibold">Partager</strong>{" dans Safari (l\u2019ic\u00f4ne de fl\u00e8che sortant d\u2019un carr\u00e9)."}</span>
              </div>
              <div className="flex items-start gap-3.5 text-xs text-slate-300 font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30 shrink-0">2</span>
                <span className="pt-0.5">{"Faites d\u00e9filer vers le bas et s\u00e9lectionnez "}<strong className="text-indigo-400 font-semibold">{"Sur l\u2019\u00e9cran d\u2019accueil"}</strong>{"."}                </span>
              </div>
            </div>
            <Button 
              onClick={() => setShowIOSInstructions(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 font-semibold mt-6 py-2.5 rounded-xl transition-all"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
