'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db, ShoppingList } from '@/lib/db';
import { SyncIndicator } from '@/components/sync-indicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Settings, Fingerprint, Loader2, LogOut, Key, User, ShieldAlert, Sparkles } from 'lucide-react';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { useTranslation } from '@/lib/i18n';

/**
 * Home - Premium Glassmorphic Collaborative Dashboard for Kaino
 * Highly translated using local/server-aware translation hook.
 */
export default function Home() {
  const router = useRouter();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Translations Hook
  const { t, loadingTranslations } = useTranslation();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);

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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

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

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="max-w-4xl mx-auto p-4 w-full flex-grow">
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Kaino</h1>
            <SyncIndicator />
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <span className="text-xs text-muted-foreground mr-2 font-medium bg-muted px-2.5 py-1 rounded-full flex items-center gap-1.5 border">
                <User className="h-3.5 w-3.5 text-indigo-400" />
                {currentUser.username}
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} title={t('administration')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title={t('disconnect')}>
              <LogOut className="h-5 w-5 text-rose-400" />
            </Button>
          </div>
        </header>

        <div className="space-y-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {t('dashboard_lists_title')}
              </CardTitle>
              <CardDescription>
                {t('dashboard_lists_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lists.length > 0 && (
                <div className="space-y-3 mb-6">
                  {lists.map((list) => (
                    <div 
                      key={list.id} 
                      onClick={() => router.push(`/lists/${list.id}`)}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{list.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{t('sharing')}: {list.shareId}</p>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {t('dashboard_lists_open')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={() => router.push('/lists/new')} className="w-full">
                {t('dashboard_lists_create_btn')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40 bg-slate-900/10 backdrop-blur-md mt-auto">
        <p>Kaino v0.03</p>
      </footer>
    </div>
  );
}
