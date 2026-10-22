import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function pagination(theme: Theme) {
  return {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            fontWeight: theme.typography.fontWeightSemiBold,
          },
        },
        textPrimary: {
          '&.Mui-selected': {
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.16),
            },
          },
        },
        outlined: {
          borderColor: alpha(theme.palette.grey[500], 0.24),
        },
        outlinedPrimary: {
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderColor: alpha(theme.palette.primary.main, 0.24),
          },
        },
      },
    },
  };
}
