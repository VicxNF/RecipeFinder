'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RecipeCardSkeleton from '@/components/RecipeCardSkeleton';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store/favoritesStore';

type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function FavoritesPage() {
  const favoriteRecipeIds = useFavoritesStore((state) => state.favoriteRecipeIds);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteRecipeIds.length === 0) {
      setFavoriteRecipes([]); 
      setLoading(false);
      return;
    }

    const fetchFavoriteRecipes = async () => {
      setLoading(true);
      try {
        const recipePromises = favoriteRecipeIds.map(id =>
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(res => res.json())
            .then(data => data.meals[0]) 
        );
        const recipes = await Promise.all(recipePromises);
        setFavoriteRecipes(recipes.filter(Boolean));
      } catch (error) {
        console.error("Error al obtener recetas favoritas:", error);
        setFavoriteRecipes([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [favoriteRecipeIds]);

  return (
    <main className="container mx-auto p-4 py-12">
      <h1 className="text-5xl font-serif font-bold text-center mb-12 text-white">Mis Recetas Favoritas</h1>
      
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: favoriteRecipeIds.length || 4 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && favoriteRecipes.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {favoriteRecipes.map((recipe) => (
            <motion.div key={recipe.idMeal} variants={cardVariants}>
              <Link href={`/recipe/${recipe.idMeal}`} className="block group">
                <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
                  <Image 
                    src={recipe.strMealThumb} 
                    alt={recipe.strMeal} 
                    width={500} 
                    height={500} 
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="font-serif text-xl font-bold text-white truncate transition-colors duration-300 group-hover:text-accent">
                      {recipe.strMeal}
                    </h2>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && favoriteRecipes.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-lg mb-2">Aún no has guardado ninguna receta favorita.</p>
          <Link href="/" className="text-accent hover:underline font-semibold">
            ¡Empieza a explorar!
          </Link>
        </div>
      )}
    </main>
  );
}