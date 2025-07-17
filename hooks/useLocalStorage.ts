// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

// T es un parámetro genérico para el tipo de dato que guardaremos
function useLocalStorage<T>(key: string, initialValue: T) {
  // El estado se inicializa con una función para que solo se ejecute en el cliente
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Verificamos que estamos en el navegador, ya que localStorage no existe en el servidor
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // useEffect se usa para actualizar localStorage cuando storedValue cambia
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;