import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type ChipOwnerState = {
  color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'soft';
};

// ----------------------------------------------------------------------

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

export function chip(theme: Theme) {
  const lightMode = theme.palette.mode === 'light';

  const rootStyles = (ownerState: ChipOwnerState) => {
    const defaultColor = ownerState.color === 'default';
    const filledVariant = ownerState.variant === 'filled';
    const softVariant = ownerState.variant === 'soft';

    const defaultStyle = {
      ...(defaultColor && {
        '& .MuiChip-avatar': {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.grey[500], 0.48),
        },
        ...(filledVariant && {
          backgroundColor: alpha(theme.palette.grey[500], 0.16),
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[500], 0.32),
          },
        }),
        ...(softVariant && {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.grey[500], 0.16),
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[500], 0.32),
          },
        }),
      }),
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
      '& .MuiChip-avatar': {
          color: theme.palette[color].light,
          backgroundColor: theme.palette[color].dark,
        },
        ...(softVariant && {
          color: theme.palette[color][lightMode ? 'dark' : 'light'],
          backgroundColor: alpha(theme.palette[color].main, 0.16),
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.32),
          },
        }),
      }),
    }));

    return [defaultStyle, ...colorStyle];
  };

  return {
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ChipOwnerState }) => rootStyles(ownerState),
      },
    },
  };
}
