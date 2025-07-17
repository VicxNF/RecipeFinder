// components/Header.tsx
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/solid'; // Necesitaremos instalar heroicons

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-blue-400">
          RecipeFinder
        </Link>
        <nav>
          <Link href="/favorites" className=" font-serif flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
            <HeartIcon className="h-5 w-5" />
            <span>Favoritos</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}