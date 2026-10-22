import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function badge(_theme: Theme) {
  return {
    MuiBadge: {
      styleOverrides: {
        dot: {
          width: 10,
          height: 10,
          borderRadius: '50%',
        },
      },
    },
  };
}
