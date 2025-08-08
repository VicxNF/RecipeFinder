// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';
import { Playfair_Display, Lato } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
});

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
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-gray-900 text-gray-200 font-sans">
        <Toaster position="top-center" /> 
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}