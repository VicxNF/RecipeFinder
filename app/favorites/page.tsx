// app/favorites/page.tsx
'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import Link from 'next/link';
import Image from 'next/image';
import RecipeCardSkeleton from '@/components/RecipeCardSkeleton';

type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function FavoritesPage() {
  const [favoriteIds] = useLocalStorage<string[]>('favoriteRecipes', []);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo ejecutamos si hay IDs de favoritos
    if (favoriteIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        // Creamos un array de promesas, una por cada ID
        const recipePromises = favoriteIds.map(id =>
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(res => res.json())
            .then(data => data.meals[0])
        );
        // Esperamos a que todas las promesas se resuelvan
        const recipes = await Promise.all(recipePromises);
        setFavoriteRecipes(recipes.filter(Boolean)); // Filtramos posibles resultados nulos
      } catch (error) {
        console.error("Error al obtener recetas favoritas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Mis Recetas Favoritas</h1>
      
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: favoriteIds.length || 4 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && favoriteRecipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteRecipes.map((recipe) => (
            <Link href={`/recipe/${recipe.idMeal}`} key={recipe.idMeal}>
              <div className="bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <Image src={recipe.strMealThumb} alt={recipe.strMeal} width={500} height={500} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h2 className="font-semibold text-lg truncate">{recipe.strMeal}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && favoriteRecipes.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          <p>Aún no has guardado ninguna receta favorita.</p>
          <Link href="/" className="text-blue-400 hover:underline mt-2 inline-block">
            ¡Empieza a explorar!
          </Link>
        </div>
      )}
    </main>
  );
}