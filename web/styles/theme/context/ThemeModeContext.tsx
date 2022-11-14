import {createContext, FC, ReactNode, useEffect, useState} from 'react';
import {M3ThemeMode} from '../m3/M3Theme';
// @ts-ignore
import useMediaQuery from "@mui/material/useMediaQuery";

export interface ThemeModeContextType {
    themeMode: M3ThemeMode,
    toggleThemeMode: () => void,
    resetThemeMode: () => void
}

const DEFAULT_MODE: M3ThemeMode = "light";
const THEME_MODE_KEY = 'ThemeMode';

export const ThemeModeContext = createContext<ThemeModeContextType>({
    themeMode: DEFAULT_MODE,
    toggleThemeMode: () => {
    },
    resetThemeMode: () => {
    }
});


const ThemeModeProvider: FC<{ children: ReactNode }> = ({children}) => {
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const [themeMode, setThemeMode] = useState<M3ThemeMode>("light");

    useEffect(() => {
        console.log("theme changed", prefersDark ? "dark" : "light")
        setThemeMode(prefersDark ? "dark" : "light");
    }, [prefersDark]);
    useEffect(() => {
        if (localStorage.getItem(THEME_MODE_KEY)) {
            const localMode = JSON.parse(localStorage.getItem(THEME_MODE_KEY) || '{}');
            setThemeMode(localMode);
        }
    }, []);

    const toggleThemeMode = () => {
        // const value = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(themeMode);
        localStorage.setItem(THEME_MODE_KEY, JSON.stringify(themeMode));
    }

    const resetThemeMode = () => {
        setThemeMode('light');
        localStorage.setItem(THEME_MODE_KEY, JSON.stringify(DEFAULT_MODE));
    }

    return (
        <ThemeModeContext.Provider value={{themeMode, toggleThemeMode, resetThemeMode}}>
            {children}
        </ThemeModeContext.Provider>
    )
}

export default ThemeModeProvider;