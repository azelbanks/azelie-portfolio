import type { Metadata, Viewport } from 'next';
import { ModeProvider } from '@/components/layout/ModeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Azélie Bernard | Stratégie × Data × IA',
  description:
    "Portfolio d'Azélie Bernard — De l'ingénierie de projets européens au Machine Learning. Là où la stratégie rencontre le code. 8 ans d'expérience en gestion de projets complexes.",
  keywords: [
    'Azélie Bernard',
    'Data Engineer',
    'Chef de Projet IA',
    'Machine Learning',
    'Bordeaux',
    'Portfolio',
    'Big Data',
    'Erasmus+',
    'Gestion de projet',
  ],
  authors: [{ name: 'Azélie Bernard' }],
  creator: 'Azélie Bernard',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://azelie-bernard.com',
    siteName: 'Azélie Bernard Portfolio',
    title: 'Azélie Bernard | Là où la stratégie rencontre le code',
    description:
      "Portfolio interactif — De l'ingénierie de projets européens au Machine Learning.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Azélie Bernard - Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azélie Bernard | Stratégie × Data × IA',
    description: 'Là où la stratégie rencontre le code.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFEF9' },
    { media: '(prefers-color-scheme: dark)', color: '#05050A' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preload fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ModeProvider>
          {children}
        </ModeProvider>
      </body>
    </html>
  );
}
