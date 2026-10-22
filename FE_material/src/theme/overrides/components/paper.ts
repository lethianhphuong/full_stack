import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function paper(theme: Theme) {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: theme.palette.divider,
        },
      },
    },
  };
}
