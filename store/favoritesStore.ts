import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteRecipeIds: string[];
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteRecipeIds: [],
      toggleFavorite: (id: string) => {
        const { favoriteRecipeIds } = get();
        const newFavorites = favoriteRecipeIds.includes(id)
          ? favoriteRecipeIds.filter((favId) => favId !== id)
          : [...favoriteRecipeIds, id];
        set({ favoriteRecipeIds: newFavorites });
      },
    }),
    {
      name: 'favorite-recipes-storage',
    }
  )
);