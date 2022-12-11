// @ts-ignore
import {ThemeOptions} from "@mui/material/styles";
// @ts-ignore
import {alpha, darken, lighten, PaletteColor, Theme} from '@mui/material';
interface M3Tone {
    0: string,
    10: string,
    20: string,
    30: string,
    40: string,
    50: string,
    60: string,
    70: string,
    80: string,
    90: string,
    95: string,
    99: string,
    100: string
}

export interface M3ThemeTones {
    primary: M3Tone;
    secondary: M3Tone;
    tertiary: M3Tone;
    neutral: M3Tone;
    neutralVariant: M3Tone;
    error: M3Tone;
}

export interface M3ColorTokens {
    primary: string,
    onPrimary: string,

    primaryContainer: string,
    onPrimaryContainer: string,

    secondary: string,
    onSecondary: string,

    secondaryContainer: string,
    onSecondaryContainer: string,

    tertiary: string,
    onTertiary: string,

    tertiaryContainer: string,
    onTertiaryContainer: string,

    error: string,
    onError: string,

    errorContainer: string,
    onErrorContainer: string,

    background: string,
    onBackground: string,

    surface: string,
    onSurface: string,

    surfaceVariant: string,
    onSurfaceVariant: string,

    inverseSurface: string,
    inverseOnSurface: string,

    inversePrimary: string,
    surfaceTint?: string,

    outline: string,
    shadow: string,
}

export type M3ThemeMode = 'dark' | 'light';

export interface M3ThemeScheme {
    light: M3ColorTokens,
    dark: M3ColorTokens,
    tones?: M3ThemeTones
}

export const DEFAULT_M3_THEME_SCHEME: M3ThemeScheme = {
    "light": {
        "primary": "#644abd",
        "onPrimary": "#ffffff",
        "primaryContainer": "#e8ddff",
        "onPrimaryContainer": "#1d0061",
        "secondary": "#605b70",
        "onSecondary": "#ffffff",
        "secondaryContainer": "#e7dff8",
        "onSecondaryContainer": "#1d192b",
        "tertiary": "#7c5262",
        "onTertiary": "#ffffff",
        "tertiaryContainer": "#ffd8e6",
        "onTertiaryContainer": "#30111f",
        "error": "#ba1b1b",
        "onError": "#ffffff",
        "errorContainer": "#ffdad4",
        "onErrorContainer": "#410001",
        "background": "#fffbff",
        "onBackground": "#1c1b1e",
        "surface": "#fffbff",
        "onSurface": "#1c1b1e",
        "surfaceVariant": "#e6e0ec",
        "onSurfaceVariant": "#48454f",
        "outline": "#79757f",
        "shadow": "#000000",
        "inverseSurface": "#313033",
        "inverseOnSurface": "#f4eff4",
        "inversePrimary": "#cdbdff"
    },
    "dark": {
        "primary": "#cdbdff",
        "onPrimary": "#350f8d",
        "primaryContainer": "#4c30a3",
        "onPrimaryContainer": "#e8ddff",
        "secondary": "#cac3dc",
        "onSecondary": "#322e41",
        "secondaryContainer": "#494459",
        "onSecondaryContainer": "#e7dff8",
        "tertiary": "#efb8cb",
        "onTertiary": "#492534",
        "tertiaryContainer": "#623b4a",
        "onTertiaryContainer": "#ffd8e6",
        "error": "#ffb4a9",
        "onError": "#680003",
        "errorContainer": "#930006",
        "onErrorContainer": "#ffb4a9",
        "background": "#1c1b1e",
        "onBackground": "#e6e1e6",
        "surface": "#1c1b1e",
        "onSurface": "#e6e1e6",
        "surfaceVariant": "#48454f",
        "onSurfaceVariant": "#c9c4cf",
        "outline": "#938f99",
        "shadow": "#000000",
        "inverseSurface": "#e6e1e6",
        "inverseOnSurface": "#313033",
        "inversePrimary": "#644abd"
    },
    "tones": {
        "primary": {
            "0": "#000000",
            "10": "#1d0061",
            "20": "#350f8d",
            "30": "#4c30a3",
            "40": "#644abd",
            "50": "#7d64d8",
            "60": "#977ef4",
            "70": "#b39dff",
            "80": "#cdbdff",
            "90": "#e8ddff",
            "95": "#f6eeff",
            "99": "#fffbff",
            "100": "#ffffff"
        },
        "secondary": {
            "0": "#000000",
            "10": "#1d192b",
            "20": "#322e41",
            "30": "#494459",
            "40": "#605b70",
            "50": "#7a748b",
            "60": "#938da4",
            "70": "#aea8c0",
            "80": "#cac3dc",
            "90": "#e7dff8",
            "95": "#f6eeff",
            "99": "#fffbff",
            "100": "#ffffff"
        },
        "tertiary": {
            "0": "#000000",
            "10": "#30111f",
            "20": "#492534",
            "30": "#623b4a",
            "40": "#7c5262",
            "50": "#986a7b",
            "60": "#b48395",
            "70": "#d09daf",
            "80": "#efb8cb",
            "90": "#ffd8e6",
            "95": "#ffecf2",
            "99": "#fcfcfc",
            "100": "#ffffff"
        },
        "neutral": {
            "0": "#000000",
            "10": "#1c1b1e",
            "20": "#313033",
            "30": "#48464a",
            "40": "#605d62",
            "50": "#79767a",
            "60": "#939094",
            "70": "#aeaaaf",
            "80": "#c9c5c9",
            "90": "#e6e1e6",
            "95": "#f4eff4",
            "99": "#fffbff",
            "100": "#ffffff"
        },
        "neutralVariant": {
            "0": "#000000",
            "10": "#1c1a22",
            "20": "#312f37",
            "30": "#48454f",
            "40": "#605d66",
            "50": "#79757f",
            "60": "#938f99",
            "70": "#aea9b4",
            "80": "#c9c4cf",
            "90": "#e6e0ec",
            "95": "#f5effa",
            "99": "#fffbff",
            "100": "#ffffff"
        },
        "error": {
            "0": "#000000",
            "10": "#410001",
            "20": "#680003",
            "30": "#930006",
            "40": "#ba1b1b",
            "50": "#dd3730",
            "60": "#ff5449",
            "70": "#ff897a",
            "80": "#ffb4a9",
            "90": "#ffdad4",
            "95": "#ffede9",
            "99": "#fcfcfc",
            "100": "#ffffff"
        }
    }
};
// @ts-ignore
declare module '@mui/material/styles/createPalette' {
    interface Palette {
        //primary: string,
        onPrimary: PaletteColor,

        primaryContainer: PaletteColor,
        onPrimaryContainer: PaletteColor,

        //secondary: string,
        onSecondary: PaletteColor,

        secondaryContainer: PaletteColor,
        onSecondaryContainer: PaletteColor,

        tertiary: PaletteColor,
        onTertiary: PaletteColor,

        tertiaryContainer: PaletteColor,
        onTertiaryContainer: PaletteColor,

        //error: string,
        onError: PaletteColor,

        errorContainer: PaletteColor,
        onErrorContainer: PaletteColor,

        background2: PaletteColor,
        onBackground: PaletteColor,

        surface: PaletteColor,
        onSurface: PaletteColor,

        surfaceVariant: PaletteColor,
        onSurfaceVariant: PaletteColor,

        inverseSurface: PaletteColor,
        inverseOnSurface: PaletteColor,
        inversePrimary: PaletteColor,

        surfaceTint: string,

        outline: string,
        shadow: string,
    }
}
// @ts-ignore
declare module '@mui/material/styles/createTheme' {
    interface ThemeOptions {
        tones?: M3ThemeTones
    }

    interface Theme {
        tones?: M3ThemeTones
    }
}
// @ts-ignore
declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        elevated: true;
        filled: true;
        tonal: true;
    }

    interface ButtonPropsColorOverrides {
        tertiary: true;
        surface: true;
    }
}
// @ts-ignore
declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        filled: true;
    }
}
// @ts-ignore
declare module '@mui/material/Fab' {
    interface FabPropsVariantOverrides {
        primary: true;
        secondary: true;
        tertiary: true;
        surface: true;
    }

    interface FabPropsColorOverrides {
        tertiary: true,
        surface: true,
    }
}

export const getDesignTokens = (mode: M3ThemeMode, scheme: M3ColorTokens, tones?: M3ThemeTones) => {
    return ({
        palette: {
            mode: mode,
            primary: {
                main: scheme.primary,
                contrastText: scheme.onPrimary
            },
            onPrimary: {
                main: scheme.onPrimary,
                contrastText: scheme.primary
            },
            primaryContainer: {
                main: scheme.primaryContainer,
                contrastText: scheme.onPrimaryContainer
            },
            onPrimaryContainer: {
                main: scheme.onPrimaryContainer,
                contrastText: scheme.primaryContainer
            },
            secondary: {
                main: scheme.secondary,
                contrastText: scheme.onSecondary
            },
            onSecondary: {
                main: scheme.onSecondary,
                contrastText: scheme.secondary
            },
            secondaryContainer: {
                main: scheme.secondaryContainer,
                contrastText: scheme.onSecondaryContainer
            },
            onSecondaryContainer: {
                main: scheme.onSecondaryContainer,
                contrastText: scheme.secondaryContainer
            },
            tertiary: {
                main: scheme.tertiary,
                contrastText: scheme.onTertiary
            },
            onTertiary: {
                main: scheme.onTertiary,
                contrastText: scheme.tertiary
            },
            tertiaryContainer: {
                main: scheme.tertiaryContainer,
                contrastText: scheme.onTertiaryContainer
            },
            onTertiaryContainer: {
                main: scheme.onTertiaryContainer,
                contrastText: scheme.tertiary
            },
            error: {
                main: scheme.error,
                contrastText: scheme.onError
            },
            onError: {
                main: scheme.onError,
                contrastText: scheme.error
            },
            errorContainer: {
                main: scheme.errorContainer,
                contrastText: scheme.onErrorContainer
            },
            onErrorContainer: {
                main: scheme.onErrorContainer,
                contrastText: scheme.errorContainer
            },
            background2: {
                main: scheme.background,
                contrastText: scheme.onBackground
            },
            onBackground: {
                main: scheme.onBackground,
                contrastText: scheme.background
            },
            surface: {
                main: scheme.surface,
                contrastText: scheme.onSurface
            },
            onSurface: {
                main: scheme.onSurface,
                contrastText: scheme.surface
            },
            surfaceVariant: {
                main: scheme.surfaceVariant,
                contrastText: scheme.onSurfaceVariant
            },
            onSurfaceVariant: {
                main: scheme.onSurfaceVariant,
                contrastText: scheme.surfaceVariant
            },
            inverseSurface: {
                main: scheme.inverseSurface || (mode === 'light' ? tones?.neutral[20] : tones?.neutral[90]),
                contrastText: scheme.inverseOnSurface || (mode === 'light' ? tones?.neutral[95] : tones?.neutral[20])
            },
            inverseOnSurface: {
                main: scheme.inverseOnSurface || (mode === 'light' ? tones?.neutral[95] : tones?.neutral[20]),
                contrastText: scheme.inverseSurface || (mode === 'light' ? tones?.neutral[20] : tones?.neutral[90])
            },
            inversePrimary: {
                main: scheme.inversePrimary || (mode === 'light' ? tones?.neutral[80] : tones?.neutral[40]),
                contrastText: scheme.primary
            },

            surfaceTint: scheme.primary,
            outline: scheme.outline,
            shadow: scheme.shadow,

            background: {
                default: scheme.background,
                paper: scheme.surface
            },
            common: {
                white: scheme.background,
                black: scheme.onBackground,
            },
            text: {
                primary: scheme.onSurface,
                secondary: scheme.onSecondaryContainer,

            },
            divider: scheme.outline
        },
        tones
    } as ThemeOptions);
};

export const getThemedComponents = (theme: Theme): { components: Theme['components'] } => {
    return {
        components: {
            MuiCssBaseline: {
                defaultProps: {
                    enableColorScheme: true
                }
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        // borderColor: "rgba(white, white, white, 0.1)"
                        borderColor: theme.palette.outline,
                        backgroundColor: theme.palette.outline
                    }
                }
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(1),
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        marginLeft: theme.spacing(1),
                    },
                    indicator: {
                        height: 3,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        margin: '0 16px',
                        minWidth: 0,
                        padding: 0,
                        [theme.breakpoints.up('md')]: {
                            padding: 0,
                            minWidth: 0,
                        },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: theme.palette.surface.main,
                        color: theme.palette.onSurface.main,
                        transition: theme.transitions.create(
                            ['background-color', 'box-shadow', 'color'],
                            {
                                duration: theme.transitions.duration.short,
                            },
                        ),
                    },
                    colorDefault: {
                        background: theme.palette.surface.main,
                        color: theme.palette.onSurface.main,
                        transition: theme.transitions.create(
                            ['background-color', 'box-shadow', 'color'],
                            {
                                duration: theme.transitions.duration.short,
                            },
                        ),
                    },
                    colorPrimary: {
                        background: theme.palette.mode == 'light' ? lighten(theme.palette.primary.main, 0.85) : darken(theme.palette.primary.main, 0.8),
                        color: theme.palette.surface.contrastText,
                        transition: theme.transitions.create(
                            ['background-color', 'box-shadow', 'color'],
                            {
                                duration: theme.transitions.duration.short,
                            },
                        ),
                    }
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    },
                    outlined: {
                        borderColor: theme.palette.outline,
                        background: theme.palette.surface.main,
                    },
                },
                variants: [
                    {
                        props: {variant: 'elevated'},
                        style: {
                            boxShadow: theme.shadows[1],
                            background: alpha(theme.palette.primary.main, 0.05),
                            color: theme.palette.primary.main,
                            '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.15),
                            }
                        }
                    },
                    {
                        props: {variant: 'filled'},
                        style: {
                            background: theme.palette.primary.main,
                            color: theme.palette.onPrimary.main,
                            '&:hover': {
                                boxShadow: theme.shadows[1],
                                background: alpha(theme.palette.primary.main, 0.85),
                            }
                        }
                    },
                    {
                        props: {variant: 'tonal'},
                        style: {
                            background: theme.palette.secondaryContainer.main,
                            color: theme.palette.onSecondaryContainer.main,
                            '&:hover': {
                                boxShadow: theme.shadows[1],
                                background: alpha(theme.palette.secondaryContainer.main, 0.8),
                            }
                        }
                    }
                ]
            },
            MuiFab: {
                styleOverrides: {
                    root: {
                        borderRadius: '18px',
                    }
                },
                variants: [
                    {
                        props: {variant: 'primary'},
                        style: {
                            boxShadow: theme.shadows[3],
                            background: theme.palette.primaryContainer.main,
                            color: theme.palette.onPrimaryContainer.main,
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: theme.palette.mode === 'dark' ?
                                    lighten(theme.palette.primaryContainer.main, 0.08) :
                                    darken(theme.palette.primaryContainer.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'extended', color: 'primary'},
                        style: {
                            boxShadow: theme.shadows[3],
                            background: theme.palette.primaryContainer.main,
                            color: theme.palette.onPrimaryContainer.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: theme.palette.mode === 'dark' ?
                                    lighten(theme.palette.primaryContainer.main, 0.08) :
                                    darken(theme.palette.primaryContainer.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'secondary'},
                        style: {
                            boxShadow: theme.shadows[3],
                            background: theme.palette.secondaryContainer.main,
                            color: theme.palette.onSecondaryContainer.main,
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: theme.palette.mode === 'dark' ?
                                    lighten(theme.palette.secondaryContainer.main, 0.08) :
                                    darken(theme.palette.secondaryContainer.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'extended', color: 'secondary'},
                        style: {
                            boxShadow: theme.shadows[3],
                            background: theme.palette.secondaryContainer.main,
                            color: theme.palette.onSecondaryContainer.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: theme.palette.mode === 'dark' ?
                                    lighten(theme.palette.secondaryContainer.main, 0.08) :
                                    darken(theme.palette.secondaryContainer.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'tertiary'},
                        style: {
                            boxShadow: theme.shadows[3],
                            background: theme.palette.tertiaryContainer.main,
                            color: theme.palette.onTertiaryContainer.main,
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: theme.palette.mode === 'dark' ?
                                    lighten(theme.palette.tertiaryContainer.main, 0.08) :
                                    darken(theme.palette.tertiaryContainer.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'extended', color: 'tertiary'},
                        style: {
                            boxShadow: theme.shadows[3],
                            background: theme.palette.tertiaryContainer.main,
                            color: theme.palette.onTertiaryContainer.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: theme.palette.mode === 'dark' ?
                                    lighten(theme.palette.tertiaryContainer.main, 0.08) :
                                    darken(theme.palette.tertiaryContainer.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'surface'},
                        style: {
                            boxShadow: theme.shadows[3],
                            //background: theme.palette.surface.main,
                            background: alpha(theme.palette.primary.main, 0.05),
                            color: theme.palette.primary.main,
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: alpha(theme.palette.primary.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'extended', color: 'surface'},
                        style: {
                            boxShadow: theme.shadows[3],
                            //background: theme.palette.surface.main,
                            background: alpha(theme.palette.primary.main, 0.05),
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                background: alpha(theme.palette.primary.main, 0.08),
                            }
                        }
                    }
                ]
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: '20px',
                        padding: '10px 8px'
                    }
                },
                variants: [
                    {
                        props: {variant: 'elevation'},
                        style: {
                            boxShadow: theme.shadows[1],
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            transition: theme.transitions.create(
                                ['background-color', 'box-shadow', 'border-color', 'color'],
                                {
                                    duration: theme.transitions.duration.short,
                                },
                            ),
                            '&:hover': {
                                boxShadow: theme.shadows[2],
                                background: alpha(theme.palette.primary.main, 0.08),
                            }
                        }
                    },
                    {
                        props: {variant: 'filled'},
                        style: {
                            backgroundColor: theme.palette.surfaceVariant.main,
                            transition: theme.transitions.create(
                                ['background-color', 'box-shadow', 'border-color', 'color'],
                                {
                                    duration: theme.transitions.duration.short,
                                },
                            ),
                            '&:hover': {
                                boxShadow: theme.shadows[1],
                                background: alpha(theme.palette.surfaceVariant.main, 0.8),
                            }
                        }
                    },
                    {
                        props: {variant: 'outlined'},
                        style: {
                            backgroundColor: theme.palette.surface.main,
                            borderColor: theme.palette.outline,
                            transition: theme.transitions.create(
                                ['background-color', 'box-shadow', 'border-color', 'color'],
                                {
                                    duration: theme.transitions.duration.short,
                                },
                            ),
                            '&:hover': {
                                boxShadow: theme.shadows[1],
                                background: alpha(theme.palette.onSurface.main, 0.05),
                            },
                        }
                    }
                ]
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        background: theme.palette.mode === 'dark' ?
                            darken(theme.palette.primary.main, 0.9) :
                            lighten(theme.palette.primary.main, 0.9),
                        color: theme.palette.onSurface.main
                    },
                    outlined: {
                        borderColor: theme.palette.outline,
                        background: theme.palette.surface.main,
                    }
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    root: {
                        //background: theme.palette.surface.main,
                        //color: theme.palette.onSurface.main,
                    },
                    paper: {
                        border: '0px',
                        //background: theme.palette.mode == 'light' ? lighten(theme.palette.primary.main, 0.85) : darken(theme.palette.primary.main, 0.8),
                        //color: theme.palette.surface.contrastText,
                        background: theme.palette.surface.main,
                        color: theme.palette.onSurface.main,
                    }
                }
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        paddingTop: 1,
                        paddingBottom: 1,
                        '& .MuiListItemButton-root': {
                            paddingTop: 8,
                            paddingBottom: 8
                        }
                    }
                }
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 50,
                        '&.Mui-selected': {
                            color: theme.palette.onSecondaryContainer.main,
                            background: theme.palette.secondaryContainer.main,
                            '& > .MuiListItemText-root > .MuiTypography-root': {
                                fontWeight: 'bold'
                            },
                        }
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        color: 'inherit',
                        minWidth: 32,
                        marginRight: "0.5rem",
                        '&.Mui-selected': {
                            fontWeight: 'bold'
                        },
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        background: theme.palette.secondaryContainer.main,
                        color: theme.palette.secondaryContainer.contrastText
                    }
                }
            },
            MuiAccordion: {
                styleOverrides: {
                    root: {
                        '&:before': {
                            backgroundColor: theme.palette.surfaceVariant.main
                        },
                        '&.Mui-disabled': {
                            backgroundColor: theme.palette.inverseOnSurface.main,
                            color: theme.palette.inverseSurface.main,
                        }
                    }
                },
            },
            MuiSnackbarContent: {
                styleOverrides: {
                    root: {
                        backgroundColor: theme.palette.inverseSurface.main,
                    },
                    message: {
                        color: theme.palette.inverseOnSurface.main
                    },
                    action: {
                        color: theme.palette.inversePrimary.main
                    }
                }
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        width: 42,
                        height: 26,
                        padding: 0,
                        marginLeft: 12,
                        marginRight: 8,
                        '& .MuiSwitch-switchBase': {
                            padding: 0,
                            margin: 7,
                            transitionDuration: '100ms',
                            '&.Mui-checked': {
                                transform: 'translateX(16px)',
                                margin: 4,
                                '& + .MuiSwitch-track': {
                                    backgroundColor: theme.palette.primary.main,
                                    opacity: 1,
                                    border: 0,
                                },
                                '& .MuiSwitch-thumb': {
                                    color: theme.palette.onPrimary.main,
                                    width: 18,
                                    height: 18,
                                },
                                /*'& .MuiSwitch-thumb:before': {
                                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                                        theme.palette.primary.main,
                                    )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                                },
                                '&.Mui-disabled .MuiSwitch-thumb:before': {
                                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                                        alpha(theme.palette.onSurfaceVariant.main, 0.28),
                                    )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                                },*/
                                '&.Mui-disabled + .MuiSwitch-track': {
                                    backgroundColor: alpha(theme.palette.onSurface.main, 0.1),
                                },
                                '&.Mui-disabled .MuiSwitch-thumb': {
                                    color: alpha(theme.palette.surface.main, 0.8),
                                },
                            },
                            '&.Mui-focusVisible .MuiSwitch-thumb': {
                                color: theme.palette.primary.main,
                                border: `6px solid ${theme.palette.primary.contrastText}`,
                            },
                            '&.Mui-disabled .MuiSwitch-thumb': {
                                color: alpha(theme.palette.onSurface.main, 0.3),
                            },
                        },
                        '& .MuiSwitch-thumb': {
                            boxSizing: 'border-box',
                            color: theme.palette.outline,
                            width: 12,
                            height: 12,
                            '&:before': {
                                content: "''",
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                left: 0,
                                top: 0,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            },
                        },
                        '& .MuiSwitch-track': {
                            borderRadius: 26 / 2,
                            border: `1px solid ${theme.palette.outline}`,
                            backgroundColor: theme.palette.surfaceVariant.main,
                            opacity: 1,
                            transition: theme.transitions.create(['background-color'], {
                                duration: 500,
                            }),
                        },
                    },
                }
            }
        }
    };
};