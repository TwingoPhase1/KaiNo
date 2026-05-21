'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function PwaUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const handleNewSW = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShowUpdatePrompt(true);
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShowUpdatePrompt(true);
          }
        });
      });
    };

    navigator.serviceWorker.ready.then(handleNewSW);

    const checkForUpdates = setInterval(() => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.update().catch(console.error);
      });
    }, 60000);

    return () => clearInterval(checkForUpdates);
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 bg-indigo-500/20 p-2 rounded-lg">
            <RefreshCw className="h-5 w-5 text-indigo-400 animate-spin" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-100">Mise à jour disponible</h3>
            <p className="text-xs text-slate-400 mt-1">
              Une nouvelle version de Kaino est prête !
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUpdatePrompt(false)}
            className="flex-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Plus tard
          </Button>
          <Button
            size="sm"
            onClick={handleUpdate}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Mettre à jour
          </Button>
        </div>
      </div>
    </div>
  );
}
