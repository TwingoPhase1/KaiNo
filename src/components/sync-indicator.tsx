'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Users } from 'lucide-react';

interface SyncIndicatorProps {
  compact?: boolean;
  peopleCount?: number;
}

export function SyncIndicator({ compact = false, peopleCount = 1 }: SyncIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial status
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (compact) {
    return (
      <div 
        className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-md shadow-sm text-slate-200 cursor-default select-none"
        title={isOnline ? `Synchronisé - ${peopleCount} personne${peopleCount > 1 ? 's' : ''} sur cette liste` : `Hors-ligne - ${peopleCount} personne${peopleCount > 1 ? 's' : ''} sur cette liste`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          )}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
          <Users className="w-3 h-3 text-indigo-400" />
          <span>{peopleCount}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-md bg-secondary text-secondary-foreground" title={isOnline ? 'Synchronisé avec le serveur' : 'Hors-ligne - Synchronisation en attente'}>
      {isOnline ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <Wifi className="w-3 h-3 text-green-500" />
          <span className="hidden sm:inline text-green-500">Synchronisé</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <WifiOff className="w-3 h-3 text-red-500" />
          <span className="hidden sm:inline text-red-500">Mode hors-ligne</span>
        </>
      )}
    </div>
  );
}
