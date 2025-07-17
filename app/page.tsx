// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importamos el hook para la redirección
import RecipeCardSkeleton from '@/components/RecipeCardSkeleton'; // Importamos el skeleton
import { motion } from 'framer-motion';

// Definimos los tipos para mayor claridad
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
      staggerChildren: 0.08, // Hace que las tarjetas aparezcan una tras otra
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
  const [loading, setLoading] = useState(false);
  const [resultsTitle, setResultsTitle] = useState('Recetas Populares');
  const router = useRouter();

  // --- Fetch para las categorías al cargar la página ---
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
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  // --- Función de Búsqueda por Término ---
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

  // --- Función para Filtrar por Categoría ---
  const handleCategoryClick = async (category: string) => {
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

  // --- Función para Obtener una Receta Aleatoria ---
  const handleRandomRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        const randomRecipeId = data.meals[0].idMeal;
        router.push(`/recipe/${randomRecipeId}`); // Redirige a la página de detalles
      }
    } catch (error) {
      console.error("Error al obtener receta aleatoria:", error);
      setLoading(false); // Asegúrate de detener la carga si hay un error
    }
    // No necesitamos poner setLoading(false) en el caso exitoso porque la página cambiará
  };


  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-serif text-center mb-4">Buscador de Recetas</h1>
      <p className="text-center font-serif text-gray-400 mb-8">Encuentra tu próximo plato favorito</p>

      {/* --- Formulario de Búsqueda y Botón Aleatorio --- */}
      <section className="relative h-96 flex flex-col items-center justify-center text-center text-white p-4">
        {/* Imagen de fondo con tinte oscuro */}
        <div className="absolute inset-0">
          <Image
            src="/pexels-ella-olsson-572949-1640774.jpg" // Coloca tu imagen en la carpeta /public
            alt="Fondo de comida"
            layout="fill"
            objectFit="cover"
            className="opacity-40" // Ajusta la opacidad para que no sea tan brillante
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>
        
        {/* Contenido del Hero */}
        <div className="relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-serif mb-4 text-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Encuentra tu Pasión Culinaria
          </motion.h1>
          <motion.p 
            className="text-lg font-serif md:text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Miles de recetas a tu alcance.
          </motion.p>
          
          {/* El buscador ahora vive aquí */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSearch} className="flex w-full max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca un plato (ej. 'Pizza')"
                className="w-full p-2 border border-gray-600 rounded-l-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md" disabled={loading}>
                Buscar
              </button>
            </form>
            <button onClick={handleRandomRecipe} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md w-full sm:w-auto" disabled={loading}>
              Sorpréndeme ✨
            </button>
          </motion.div>
        </div>
      </section>


      {/* --- Filtros por Categoría --- */}
      <div className="mb-10">
        <h2 className="text-xl font-serif text-center mb-4">O explora por categoría</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button key={cat.strCategory} onClick={() => handleCategoryClick(cat.strCategory)} className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-1 px-3 rounded-full transition-colors">
              {cat.strCategory}
            </button>
          ))}
        </div>
      </div>

      {/* --- Título de Resultados y Grid de Recetas --- */}
      <h2 className="text-2xl font-serif mb-6">{resultsTitle}</h2>
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
              // 2. Envolvemos cada tarjeta en su propio 'motion.div' para que herede la animación.
          <motion.div key={recipe.idMeal} variants={cardVariants}>
            <Link href={`/recipe/${recipe.idMeal}`} className="block group"> {/* Añade 'group' */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
                <Image 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal} 
                  width={500} 
                  height={500} 
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" // Efecto de zoom
                />
                {/* Gradiente para legibilidad */}
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />
                
                {/* Texto sobre la imagen */}
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
        <p className=" font-serif text-center text-gray-400 mt-10">No se encontraron recetas. ¡Prueba otra búsqueda!</p>
      )}
    </main>
  );
}