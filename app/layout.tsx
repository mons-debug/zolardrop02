import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RootLayoutClient from './RootLayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZOLAR - Modern Streetwear & Limited Edition Drops',
  description: 'Modern streetwear for people who want more from themselves. Discover exclusive collections: ESSENCE, FRAGMENT, and RECODE. Made for movement.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ZOLAR'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png'
  },
  keywords: ['streetwear', 'fashion', 'modern clothing', 'limited edition', 'Morocco', 'ZOLAR'],
  openGraph: {
    title: 'ZOLAR - Modern Streetwear',
    description: 'Modern streetwear for people who want more from themselves.',
    type: 'website',
    locale: 'en_US'
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
        <meta name="apple-mobile-web-app-title" content="ZOLAR" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
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
