'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Loader2 } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import { useTranslation } from '@/lib/i18n';

/**
 * SetupAdmin - Initial admin configuration page
 * Highly translated using the server-aware i18n hook
 */
export default function SetupAdmin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic translations hook
  const { t, loadingTranslations } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const allUsers = await db.users.toArray();
        const count = allUsers.filter((u) => u.isAdmin).length;
        if (count > 0 && isMounted) {
          router.push('/');
        }
      } catch (err) {
        console.error('Error checking admin:', err);
      }
    }, 1000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [router]);

  const handleCreatePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(t('setup_error_username_required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const respOptions = await fetch(`/api/auth/register-options?username=${encodeURIComponent(username.trim())}`);
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

      localStorage.setItem('kaino-setup-done', '1');
      router.push('/');
    } catch (err: any) {
      console.error('Error creating admin via Passkey:', err);
      setError(err.message || t('error_create'));
    } finally {
      setLoading(false);
    }
  };

  if (loadingTranslations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 dark:text-indigo-400" />
          <div className="text-muted-foreground font-medium animate-pulse">Kaino...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 text-slate-900 dark:text-slate-100 overflow-hidden relative">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-slate-100 shadow-2xl relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 dark:from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <Fingerprint className="h-8 w-8 text-indigo-400 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-slate-900 dark:from-indigo-200 dark:via-indigo-100 dark:to-white bg-clip-text text-transparent">
            {t('setup_title')}
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
            {t('setup_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePasskey} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('setup_username_label')}
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg placeholder-slate-400 dark:placeholder-slate-500"
                placeholder={t('setup_username_placeholder')}
              />
            </div>

            {error && (
              <div className="text-sm bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-300 p-3 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all py-6 font-medium text-base gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('setup_btn_loading')}
                </>
              ) : (
                <>
                  <Fingerprint className="h-5 w-5" />
                  {t('setup_btn_create')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
