import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function menu(theme: Theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
          borderRadius: 6,
          marginBottom: 4,
          padding: theme.spacing(0.75, 1),
          '&:last-of-type': {
            marginBottom: 0,
          },
          '&.Mui-selected': {
            fontWeight: theme.typography.fontWeightSemiBold,
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },
  };
}
