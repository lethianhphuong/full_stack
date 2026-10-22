import { useMemo } from 'react';
import type { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { palette } from './palette';
import { createTypography } from './typography';
import { shadows, customShadows } from './shadows';
import { componentsOverrides } from './overrides';
import { usePreferencesStore } from '@/store';
import type { ThemeContrast, ThemeMode } from '@/types/settings';

// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      z1: string;
      z4: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      card: string;
      dropdown: string;
      dialog: string;
      primary: string;
      info: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
    };
  }
  interface ThemeOptions {
    customShadows?: Theme['customShadows'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

type Props = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const settings = usePreferencesStore();

  // Memoize entire theme creation
  const theme = useMemo(() => {
    const basePalette = palette(settings.themeMode);
    
    // Apply contrast settings
    const contrastPalette = applyContrast(basePalette, settings.themeMode, settings.themeContrast);

    const baseTheme = createTheme({
      palette: {
        ...contrastPalette,
        ...(settings.themeColorPresets !== 'default' && {
          primary: createPresetColor(settings.themeColorPresets),
        }),
      },
      typography: createTypography(settings.themeFontFamily, settings.themeFontSize),
      shape: { borderRadius: 8 },
      shadows: shadows(settings.themeMode),
      customShadows: customShadows(settings.themeMode),
      direction: settings.themeDirection,
    } as any);

    // Apply contrast to components
    baseTheme.components = {
      ...componentsOverrides(baseTheme),
      ...(settings.themeContrast === 'bold' && contrastComponentOverrides(baseTheme)),
    } as any;

    return baseTheme;
  }, [
    settings.themeMode, 
    settings.themeColorPresets, 
    settings.themeDirection,
    settings.themeFontFamily,
    settings.themeFontSize,
    settings.themeContrast,
  ]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

// ----------------------------------------------------------------------

function applyContrast(basePalette: any, mode: ThemeMode, contrast: ThemeContrast) {
  if (contrast === 'default') {
    return basePalette;
  }

  // Bold contrast - darker backgrounds for cards/paper
  if (mode === 'dark') {
    return {
      ...basePalette,
      background: {
        ...basePalette.background,
        default: '#0A0A0A', // Darker background
        paper: '#1A1A1A',   // Darker paper
      },
    };
  }

  // Light mode bold contrast
  return {
    ...basePalette,
    background: {
      ...basePalette.background,
      default: '#F4F6F8', // Slightly darker
      paper: '#FFFFFF',
    },
  };
}

// ----------------------------------------------------------------------

function contrastComponentOverrides(theme: any) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        },
        outlined: {
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows?.dropdown || theme.shadows[8],
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows?.dialog || theme.shadows[24],
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    },
  };
}

// ----------------------------------------------------------------------

function createPresetColor(preset: string) {
  const presetColors: Record<string, { lighter: string; light: string; main: string; dark: string; darker: string; contrastText: string }> = {
    cyan: {
      lighter: '#CCF4FE',
      light: '#68CDF9',
      main: '#078DEE',
      dark: '#0351AB',
      darker: '#012972',
      contrastText: '#FFFFFF',
    },
    purple: {
      lighter: '#EBD6FD',
      light: '#B985F4',
      main: '#7635DC',
      dark: '#431A9E',
      darker: '#200A69',
      contrastText: '#FFFFFF',
    },
    blue: {
      lighter: '#D1E9FC',
      light: '#76B0F1',
      main: '#2065D1',
      dark: '#103996',
      darker: '#061B64',
      contrastText: '#FFFFFF',
    },
    orange: {
      lighter: '#FEF4D4',
      light: '#FED680',
      main: '#FDA92D',
      dark: '#B66816',
      darker: '#793908',
      contrastText: '#212B36',
    },
    red: {
      lighter: '#FFE3D5',
      light: '#FFC1AC',
      main: '#FF3030',
      dark: '#B71833',
      darker: '#7A0930',
      contrastText: '#FFFFFF',
    },
  };

  return presetColors[preset] || presetColors.cyan;
}
