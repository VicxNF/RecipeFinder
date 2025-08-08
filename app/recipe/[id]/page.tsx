'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useLocalStorage from '@/hooks/useLocalStorage';
import { HeartIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useFavoritesStore } from '@/store/favoritesStore';

type RecipeDetails = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  [key: string]: string | null;
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
};

export default function RecipeDetailsPage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { favoriteRecipeIds, toggleFavorite } = useFavoritesStore();
  const recipeId = params.id;

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        setRecipe(data.meals ? data.meals[0] : null);
      } catch (error) {
        console.error("Error al obtener detalles de la receta:", error);
      } finally {
        setLoading(false);
      }
    };
    if (recipeId) {
      fetchRecipeDetails();
    } else {
      setLoading(false);
    }
  }, [recipeId]);

  if (loading) {
    return <div className="text-center mt-20">Cargando...</div>;
  }
  
  if (!recipe) {
    return <div className="text-center mt-20">Receta no encontrada</div>;
  }

  const isFavorite = recipe ? favoriteRecipeIds.includes(recipe.idMeal) : false;

  const handleToggleFavorite = () => {
    if (!recipe) return;

    toggleFavorite(recipe.idMeal);

    if (!isFavorite) {
      toast.success(`"${recipe.strMeal}" guardada en favoritos!`);
    } else {
      toast.error(`"${recipe.strMeal}" eliminada de favoritos.`);
    }
  };

  const ingredients = [];
  if (recipe) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '' && measure && measure.trim() !== '') {
        ingredients.push(`${measure.trim()} ${ingredient}`);
      } else if (ingredient && ingredient.trim() !== '') {
        ingredients.push(ingredient);
      }
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/" className="text-accent hover:underline mb-6 inline-flex items-center gap-2 font-semibold transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M15.75 10a.75.75 0 0 1-.75.75H6.81l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 1 1 1.06 1.06L6.81 9.25h8.19a.75.75 0 0 1 .75.75Z" clipRule="evenodd" /></svg>
        Volver a la búsqueda
      </Link>

      {loading && (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <p className="text-accent font-semibold text-xl mb-4">Cargando detalles de la receta...</p>
          <div className="animate-pulse w-full max-w-md">
             <div className="w-full h-64 bg-gray-800/70 rounded-lg mb-4"></div>
             <div className="w-3/4 h-8 bg-gray-800/70 rounded-md mb-2"></div>
             <div className="w-1/2 h-6 bg-gray-800/70 rounded-md"></div>
          </div>
        </div>
      )}

      {!loading && !recipe && (
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold text-accent mb-4">¡Oh no!</h1>
          <p className="text-gray-400">La receta que buscas no pudo ser encontrada.</p>
          <Link href="/" className="text-accent hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      )}

      {!loading && recipe && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-1">
            <motion.div 
              className="relative group"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <Image
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                width={700}
                height={700}
                className="w-full rounded-xl shadow-xl"
                priority 
              />
              <button 
                onClick={handleToggleFavorite} 
                className="absolute top-4 right-4 bg-black/60 p-3 rounded-full hover:bg-black/80 transition-all duration-300 transform group-hover:scale-110 z-10"
              >
                <HeartIcon className={`h-8 w-8 ${isFavorite ? 'text-red-500 animate-pulse' : 'text-white'}`} />
              </button>
            </motion.div>

            <motion.div 
              className="mt-8 bg-surface/80 p-6 rounded-xl shadow-lg"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-serif font-bold mb-4 border-b-2 border-accent pb-2">Ingredientes</h2>
              <ul className="space-y-3 list-none">
                {ingredients.map((ing, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="text-accent font-bold mr-3">✓</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="lg:col-span-2">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-5xl font-serif font-bold mb-3 text-white leading-tight">{recipe.strMeal}</h1>
              <p className="text-accent font-semibold mb-6 text-lg">Categoría: {recipe.strCategory} | Origen: {recipe.strArea}</p>
            </motion.div>

            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-serif font-bold mb-6 border-b-2 border-accent pb-2">Instrucciones</h2>
              <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed max-w-none">
                {recipe.strInstructions.split('\n').filter(instr => instr.trim() !== '').map((instruction, index) => (
                  <p key={index}>{instruction}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}