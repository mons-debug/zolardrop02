import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RootLayoutClient from './RootLayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zolar Drop 02 - Exclusive Limited Edition Drops',
  description: 'Discover exclusive limited edition products with premium quality and unique designs',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zolar Admin'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png'
  }
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zolar Admin" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('✅ ServiceWorker registration successful:', registration.scope);
                    },
                    function(err) {
                      console.log('❌ ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
