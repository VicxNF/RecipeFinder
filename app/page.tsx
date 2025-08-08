// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import RecipeCardSkeleton from '@/components/RecipeCardSkeleton'; 
import { motion } from 'framer-motion';

type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type Category = {
  strCategory: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, 
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultsTitle, setResultsTitle] = useState('Recetas Populares');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await response.json();
        if (data.meals) {
          setCategories(data.meals);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategories();
  }, []); 

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    setRecipes([]);
    setResultsTitle(`Resultados para "${searchTerm}"`);

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error al buscar recetas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category: string) => {
    setActiveCategory(category); 
    setSearchTerm(''); 
    setLoading(true);
    setRecipes([]);
    setResultsTitle(`Recetas de la categoría "${category}"`);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error al filtrar por categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        const randomRecipeId = data.meals[0].idMeal;
        router.push(`/recipe/${randomRecipeId}`);
      }
    } catch (error) {
      console.error("Error al obtener receta aleatoria:", error);
      setLoading(false);
    }
  };


  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center text-center text-white p-4">
        <div className="absolute inset-0 bg-black/60">
          <Image
            src="/comida.jpg"
            alt="Fondo de comida"
            fill
            className="object-cover opacity-30"
            priority 
          />
        </div>
        
        {/* Contenido del Hero */}
        <div className="relative z-10">
          <motion.h1 
            className="font-serif text-5xl md:text-7xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Encuentra tu Pasión
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Miles de recetas de todo el mundo a un solo clic de distancia.
          </motion.p>
        </div>
      </section>

      <main className="container mx-auto px-4 -mt-20 relative z-20">
        
        <motion.div 
          className="bg-surface/80 backdrop-blur-md p-4 rounded-xl shadow-2xl flex flex-col sm:flex-row gap-4 items-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <form onSubmit={handleSearch} className="flex-grow flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca un plato, un ingrediente..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold p-3 rounded-r-md transition-colors" disabled={loading}>
              Buscar
            </button>
          </form>
          <button onClick={handleRandomRecipe} className="bg-purple-600 hover:bg-purple-700 text-white font-bold p-3 rounded-md w-full sm:w-auto transition-colors" disabled={loading}>
            Sorpréndeme ✨
          </button>
        </motion.div>

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Explora por Categoría</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.strCategory}
                onClick={() => handleCategoryClick(cat.strCategory)}
                className={`py-2 px-5 rounded-full font-semibold transition-all duration-300 transform
                  ${activeCategory === cat.strCategory
                    ? 'bg-accent text-white shadow-lg scale-110'
                    : 'bg-surface text-gray-300 hover:bg-gray-700 hover:-translate-y-1' 
                  }`}
              >
                {cat.strCategory}
              </button>
            ))}
          </div>
        </div>
        
        <h2 className="text-3xl font-serif font-bold mb-6">{resultsTitle}</h2>
        <motion.div
          key={resultsTitle} 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => <RecipeCardSkeleton key={index} />)
            : recipes.map((recipe) => (
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
        
        {!loading && recipes.length === 0 && (
          <p className="font-serif text-center text-gray-400 mt-10">No se encontraron recetas. ¡Prueba otra búsqueda!</p>
        )}
      </main>
    </>
  );
}