import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function appBar(_theme: Theme) {
  return {
    MuiAppBar: {
      defaultProps: {
        color: 'transparent',
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  };
}
