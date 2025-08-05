import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeContextDefinition';


export const useThemeContextHook = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("ThemeContext must be used within an ThemeContextProvider");
  return context;
}