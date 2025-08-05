import React, { useState, useEffect } from 'react';
import { ThemeContext } from './themeContextDefinition';

import type { Theme } from '../types';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isUsingSystemTheme, setUsingSystemTheme] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      setUsingSystemTheme(false);
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
      setUsingSystemTheme(true);
    }
  }, []);

  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setUsingSystemTheme(false);
  };

  const resetToSystemTheme = () => {
    localStorage.removeItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
    setUsingSystemTheme(true);
  };

  return (
    <ThemeContext.Provider value={{ theme, setSpecificTheme, resetToSystemTheme, isUsingSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

