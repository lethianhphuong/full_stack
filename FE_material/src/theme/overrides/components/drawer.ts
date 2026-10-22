import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function drawer(theme: Theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dropdown,
        },
      },
    },
  };
}
