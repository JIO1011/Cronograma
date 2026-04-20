import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Configuración de la fuente Inter optimizada
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Cronograma | Sistema de Horarios UPS',
  description: 'Sistema web moderno para gestionar y visualizar los horarios de prácticas de laboratorios de la Universidad Politécnica Salesiana en tiempo real.',
  keywords: ['horarios', 'laboratorio', 'ups', 'universidad politécnica salesiana', 'prácticas', 'cronograma'],
  authors: [{ name: 'JIO', url: 'https://ups.edu.ec' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Cronograma UPS - Horarios de Laboratorios',
    description: 'Consulta los horarios actualizados de los laboratorios.',
    url: 'https://ups.edu.ec',
    siteName: 'Cronograma UPS',
    locale: 'es_EC',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-EC" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-[#f4f5f7]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
