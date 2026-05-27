import type { Metadata } from 'next';
import './globals.css';
import { initElectric } from '@/lib/electric';
import { PwaUpdatePrompt } from '@/components/pwa-update-prompt';

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
        
        {/* Dynamic theme-color meta tags for status bar fusion */}
        <meta name="theme-color" content="#f2f2f7" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        
        {/* Service Worker PWA Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('SW registered successfully with scope:', reg.scope); },
                    function(err) { console.log('SW registration failed:', err); }
                  );
                });
              }
            `
          }}
        />
        
        {/* Anti-FOUC Device Detection + Dark Mode + Dynamic theme-color Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = null;
                  try { theme = localStorage.getItem('kaino-dev-theme'); } catch (e) {}
                  
                  if (!theme) {
                    var ua = navigator.userAgent || '';
                    theme = 'theme-generic';
                    if (/Samsung|SamsungBrowser|SM-/i.test(ua)) { theme = 'theme-samsung'; }
                    else if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) { theme = 'theme-ios'; }
                    else if (/Android/i.test(ua)) { theme = 'theme-android'; }
                  }
                  
                  var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var classes = theme;
                  if (isDark) { classes += ' dark'; }
                  
                  document.documentElement.className = classes;
                  window.__THEME__ = theme;
                  
                  // Update meta theme-color based on detected theme + dark mode
                  var themeColors = {
                    'theme-ios':     { light: '#f2f2f7', dark: '#000000' },
                    'theme-samsung': { light: '#f2f3f7', dark: '#121212' },
                    'theme-android': { light: '#fef7ff', dark: '#141218' },
                    'theme-generic': { light: '#f8f9fa', dark: '#030712' }
                  };
                  var colors = themeColors[theme] || themeColors['theme-generic'];
                  var metas = document.querySelectorAll('meta[name="theme-color"]');
                  if (metas.length >= 2) {
                    metas[0].content = colors.light;
                    metas[1].content = colors.dark;
                  }
                  
                  // Dynamic preference watching
                  if (window.matchMedia) {
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                      var activeDark = e.matches;
                      var newClasses = theme;
                      if (activeDark) { newClasses += ' dark'; }
                      document.documentElement.className = newClasses;
                    });
                  }
                } catch (e) { console.error('Theme engine error:', e); }
              })();
            `
          }}
        />
      </head>
      <body>
        {children}
        <PwaUpdatePrompt />
      </body>
    </html>
  );
}
