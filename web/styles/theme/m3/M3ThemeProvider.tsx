import React, {FC, ReactChildren, useContext, useEffect, useMemo} from "react";

// @ts-ignore
import {createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import {getDesignTokens, getThemedComponents} from './M3Theme';
// @ts-ignore
import {deepmerge} from "@mui/utils";
// import { ThemeModeContext } from '../context/ThemeModeContext';
// import { ThemeSchemeContext } from '../context/ThemeSchemeContext';
// @ts-ignore
import {CssBaseline, Theme} from "@mui/material";
import {ThemeModeContext} from "../context/ThemeModeContext";
import {ThemeSchemeContext} from "../context/ThemeSchemeContext";

interface M3ThemeProps {
    children: React.ReactNode,
}

const M3ThemeProvider: FC<M3ThemeProps> = ({children, theme}: { children: ReactChildren, theme: Theme }) => {

    const {themeMode} = useContext(ThemeModeContext);
    const {themeScheme} = useContext(ThemeSchemeContext);

    const m3Theme = useMemo(() => {
        const designTokens = getDesignTokens(theme ?? themeMode, themeScheme[themeMode], themeScheme.tones);
        let newM3Theme = createTheme(designTokens);
        newM3Theme = deepmerge(newM3Theme, getThemedComponents(newM3Theme));
        return newM3Theme;
    }, [themeMode, themeScheme]);
    useEffect(() => {
        if (document) document?.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeScheme[themeMode].surface);
    }, [m3Theme])

    return (
        <ThemeProvider theme={m3Theme}>
            <CssBaseline enableColorScheme/>
            {children}
        </ThemeProvider>
    );
}

export default M3ThemeProvider;