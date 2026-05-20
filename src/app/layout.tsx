import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { initElectric } from '@/lib/electric';

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
        
        {/* Anti-FOUC Device Detection and Sniffing Blocking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var ua = navigator.userAgent || '';
                  var theme = 'theme-generic';
                  
                  if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
                    theme = 'theme-ios';
                  } else if (/Samsung|SamsungBrowser/i.test(ua)) {
                    theme = 'theme-samsung';
                  } else if (/Android/i.test(ua)) {
                    theme = 'theme-android';
                  }
                  
                  document.documentElement.className = theme;
                  window.__THEME__ = theme;
                } catch (e) {
                  console.error('Theme engine error:', e);
                }
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
