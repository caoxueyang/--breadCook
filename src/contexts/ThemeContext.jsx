import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTheme, saveTheme } from '../utils/storage';

const ThemeContext = createContext();

const THEMES = {
  pompompurin: {
    key: 'pompompurin',
    name: '布丁狗玛芬',
    emoji: '🐶',
    desc: '暖黄奶油风，温暖可爱',
    preview: { bg: '#FFF8E7', primary: '#F5D76E', text: '#4A3500' }
  },
  hellokitty: {
    key: 'hellokitty',
    name: 'HelloKitty',
    emoji: '🎀',
    desc: '粉红甜美风，少女心满满',
    preview: { bg: '#FFF0F3', primary: '#FF6B8A', text: '#5C1A2A' }
  },
  minimal: {
    key: 'minimal',
    name: '极简',
    emoji: '◻️',
    desc: '黑白灰简洁风，清爽大方',
    preview: { bg: '#FAFAFA', primary: '#1A1A1A', text: '#1A1A1A' }
  }
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
