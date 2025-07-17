// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Importamos el Header
import { Toaster } from 'react-hot-toast';
import { Playfair_Display, Lato } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'], variable: '--font-playfair' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato' });

export const metadata: Metadata = {
  title: 'Recipe Finder',
  description: 'Encuentra tu próxima receta favorita',
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`}>
      <body className={inter.className}>
        <Toaster position="top-center" /> {/* Configura las notificaciones */}
        <Header /> {/* Añadimos el Header aquí */}
        {children}
      </body>
    </html>
  );
}