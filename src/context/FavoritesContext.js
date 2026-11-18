import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@livro-receitas:favoritos';

const FavoritesContext = createContext(null);

// Guarda a lista de receitas favoritas e salva no AsyncStorage,
// para que continue lá depois de fechar e abrir o app.
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 1) Ao abrir o app, lê os favoritos salvos no celular
  useEffect(() => {
    async function loadFavorites() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.warn('Não foi possível carregar os favoritos', error);
      } finally {
        setLoaded(true);
      }
    }
    loadFavorites();
  }, []);

  // 2) Sempre que a lista muda, salva de novo no celular
  useEffect(() => {
    if (!loaded) return; // não sobrescreve antes de terminar de carregar
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch((error) =>
      console.warn('Não foi possível salvar os favoritos', error)
    );
  }, [favorites, loaded]);

  function isFavorite(id) {
    return favorites.some((meal) => meal.idMeal === id);
  }

  // Adiciona sem mutar o array: cria um novo array com spread
  function addFavorite(meal) {
    const item = { idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb };
    setFavorites((current) => [...current, item]);
  }

  // Remove sem mutar o array: filter devolve um novo array
  function removeFavorite(id) {
    setFavorites((current) => current.filter((meal) => meal.idMeal !== id));
  }

  function toggleFavorite(meal) {
    if (isFavorite(meal.idMeal)) {
      removeFavorite(meal.idMeal);
    } else {
      addFavorite(meal);
    }
  }

  function clearFavorites() {
    setFavorites([]);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
