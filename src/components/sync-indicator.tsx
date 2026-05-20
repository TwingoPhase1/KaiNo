'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function SyncIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

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
