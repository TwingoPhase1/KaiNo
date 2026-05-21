import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { initElectric } from '@/lib/electric';
import { PwaUpdatePrompt } from '@/components/pwa-update-prompt';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kaino - Liste de courses',
  description: 'Application de gestion de courses ultra-minimaliste et collaborative',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kaino",
  },
};

// Initialize Electric SQL on app startup
if (typeof window !== 'undefined') {
  initElectric().catch(console.error);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icon-512.svg" />
        
        {/* Service Worker PWA Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) {
                      console.log('SW registered successfully with scope:', reg.scope);
                    },
                    function(err) {
                      console.log('SW registration failed:', err);
                    }
                  );
                });
              }
            `
          }}
        />
        
        {/* Anti-FOUC Device Detection and Sniffing Blocking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var ua = navigator.userAgent || '';
                  var theme = 'theme-generic';
                  
                  if (/Samsung|SamsungBrowser|SM-/i.test(ua)) {
                    theme = 'theme-samsung';
                  } else if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
                    theme = 'theme-ios';
                  } else if (/Android/i.test(ua)) {
                    theme = 'theme-android';
                  }
                  
                  // Auto-generate dark theme based on system preference
                  var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var classes = theme;
                  if (isDark) {
                    classes += ' dark';
                  }
                  
                  document.documentElement.className = classes;
                  window.__THEME__ = theme;
                  
                  // Dynamic preference watching
                  if (window.matchMedia) {
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                      var activeDark = e.matches;
                      var newClasses = theme;
                      if (activeDark) {
                        newClasses += ' dark';
                      }
                      document.documentElement.className = newClasses;
                    });
                  }
                } catch (e) {
                  console.error('Theme engine error:', e);
                }
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <PwaUpdatePrompt />
      </body>
    </html>
  );
}
