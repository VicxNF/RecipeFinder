// components/RecipeCardSkeleton.tsx

export default function RecipeCardSkeleton() {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
        {/* Placeholder para la imagen */}
        <div className="w-full h-48 bg-gray-700"></div>
        <div className="p-4">
          {/* Placeholder para el título */}
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }