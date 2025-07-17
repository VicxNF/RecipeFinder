// app/recipe/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useLocalStorage from '@/hooks/useLocalStorage';
import { HeartIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

type RecipeDetails = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  [key: string]: string | null; // Para los ingredientes
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function RecipeDetailsPage({ params }: PageProps) {
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage<string[]>('favoriteRecipes', []);
  const [recipeId, setRecipeId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setRecipeId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!recipeId) return;

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
    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return <div className="text-center mt-20">Cargando...</div>;
  }
  
  if (!recipe) {
    return <div className="text-center mt-20">Receta no encontrada</div>;
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }
  const handleToggleFavorite = () => {
    const isCurrentlyFavorite = favoriteRecipes.includes(recipe.idMeal);
    if (!isCurrentlyFavorite) {
      setFavoriteRecipes([...favoriteRecipes, recipe.idMeal]);
      toast.success('¡Guardada en favoritos!');
    } else {
      toast.error('Eliminada de favoritos.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href="/" className="text-blue-400 hover:underline mb-6 inline-block">
        ← Volver a la búsqueda
      </Link>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="relative">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            width={1200}
            height={600}
            className="w-full h-64 md:h-96 object-cover"
          />
          <button onClick={handleToggleFavorite} className="absolute top-4 right-4 bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition-all">
            <HeartIcon className={`h-8 w-8 ${favoriteRecipes.includes(recipe.idMeal) ? 'text-red-500' : 'text-white'}`} />
          </button>
        </div>
        <div className="p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.strMeal}</h1>
          <p className="text-gray-400 mb-4">
            Categoría: {recipe.strCategory} | Origen: {recipe.strArea}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-semibold mb-3 border-b-2 border-blue-500 pb-1">Ingredientes</h2>
              <ul className="list-disc list-inside space-y-1">
                {ingredients.map((ing, index) => <li key={index}>{ing}</li>)}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-3 border-b-2 border-blue-500 pb-1">Instrucciones</h2>
              {recipe.strInstructions.split('\r\n').filter(instr => instr.trim() !== '').map((instruction, index) => (
                <p key={index} className="mb-4 text-gray-300 leading-relaxed">{instruction}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}