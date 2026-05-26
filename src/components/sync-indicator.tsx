'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SyncIndicatorProps {
  compact?: boolean;
  peopleCount?: number;
}

export function SyncIndicator({ compact = false, peopleCount = 1 }: SyncIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const { t } = useTranslation();

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
        className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-md shadow-sm text-slate-200 cursor-default select-none animate-in fade-in zoom-in-95 duration-200"
        title={isOnline ? t('sync_title_compact_online').replace('{count}', String(peopleCount)) : t('sync_title_compact_offline').replace('{count}', String(peopleCount))}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span>
          )}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>{peopleCount}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-2.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/40 backdrop-blur-md shadow-sm text-slate-200 cursor-default select-none animate-in fade-in zoom-in-95 duration-200" 
      title={isOnline ? t('sync_title_online') : t('sync_title_offline')}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {isOnline ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span>
        )}
      </span>
      <span className="text-[11px] text-slate-300 font-medium tracking-wide">
        {isOnline ? t('online') : t('offline')}
      </span>
    </div>
  );
}

