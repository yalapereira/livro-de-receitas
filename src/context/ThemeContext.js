import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from '../theme/colors';

const STORAGE_KEY = '@livro-receitas:tema';

const ThemeContext = createContext(null);

// Guarda se o tema escuro está ligado e salva a escolha no AsyncStorage.
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // Ao abrir o app, lê o tema salvo
  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setIsDark(saved === 'dark');
        }
      } catch (error) {
        console.warn('Não foi possível carregar o tema', error);
      }
    }
    loadTheme();
  }, []);

  async function toggleTheme() {
    const newValue = !isDark;
    setIsDark(newValue);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newValue ? 'dark' : 'light');
    } catch (error) {
      console.warn('Não foi possível salvar o tema', error);
    }
  }

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
