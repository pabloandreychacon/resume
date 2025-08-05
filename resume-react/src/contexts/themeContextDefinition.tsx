import { createContext } from "react";
import type { Theme } from "../types";


export type ThemeContextType = {
  theme: Theme;
  setSpecificTheme: (theme: Theme) => void;
  resetToSystemTheme: () => void;
  isUsingSystemTheme: boolean;
};

export const ThemeContext = createContext<ThemeContextType | undefined>({
  theme: 'dark',
  setSpecificTheme: () => { },
  resetToSystemTheme: () => { },
  isUsingSystemTheme: false,
});
