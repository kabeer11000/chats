// @ts-ignore
import createTheme from "@mui/material/styles/createTheme";

export const createMaterial2Theme = (prefersDarkMode) => createTheme({
    palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
        primary: {
            main: '#5549EA',
        },
        // background: "black",
        secondary: {
            main: '#f50057',
        },
    },
});
