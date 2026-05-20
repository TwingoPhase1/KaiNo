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
      // 1. Get registration options from server
      const respOptions = await fetch(`/api/auth/register-options?username=${encodeURIComponent(username.trim())}`);
      if (!respOptions.ok) {
        const data = await respOptions.json();
        throw new Error(data.error || t('error_register_options'));
      }

      const options = await respOptions.json();

      // 2. Trigger browser Passkey creation prompt
      let registrationResponse;
      try {
        registrationResponse = await startRegistration(options);
      } catch (authError: any) {
        console.warn('WebAuthn registration cancelled or failed:', authError);
        throw new Error(t('register_error_cancelled'));
      }

      // 3. Verify registration response on server
      const respVerify = await fetch('/api/auth/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationResponse),
      });

      if (!respVerify.ok) {
        const data = await respVerify.json();
        throw new Error(data.error || t('error_register_verify'));
      }

      // Successful registration! Set flag and redirect
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
          <div className="text-slate-400 font-medium animate-pulse">Kaino...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 backdrop-blur-xl text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <Fingerprint className="h-8 w-8 text-indigo-400 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 via-indigo-100 to-white bg-clip-text text-transparent">
            {t('setup_title')}
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            {t('setup_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePasskey} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-300">
                {t('setup_username_label')}
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-800/80 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder={t('setup_username_placeholder')}
              />
            </div>

            {error && (
              <div className="text-sm bg-rose-950/50 border border-rose-800/50 text-rose-300 p-3 rounded-lg flex items-center gap-2">
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
