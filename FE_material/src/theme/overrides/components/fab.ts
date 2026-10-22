import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type FabOwnerState = {
  color?: 'default' | 'inherit' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  variant?: 'circular' | 'extended';
  size?: 'small' | 'medium' | 'large';
};

// ----------------------------------------------------------------------

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

export function fab(theme: Theme) {
  const lightMode = theme.palette.mode === 'light';

  const rootStyles = (ownerState: FabOwnerState) => {
    const defaultColor = ownerState.color === 'default';
    const inheritColor = ownerState.color === 'inherit';
    const smallSize = ownerState.size === 'small';
    const mediumSize = ownerState.size === 'medium';
    const extendedVariant = ownerState.variant === 'extended';

    const defaultStyle = {
      '&:hover, &:active': {
        boxShadow: 'none',
      },
      ...(inheritColor && {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.grey[400],
        },
      }),
      ...(defaultColor && {
        boxShadow: theme.customShadows.z8,
        color: lightMode ? theme.palette.grey[800] : theme.palette.common.white,
        backgroundColor: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.grey[300],
        },
      }),
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        boxShadow: theme.customShadows[color],
      }),
    }));

    const size = {
      ...(smallSize && {
        height: 34,
        minHeight: 34,
        width: extendedVariant ? 'auto' : 34,
      }),
      ...(mediumSize && {
        width: extendedVariant ? 'auto' : 40,
        height: 40,
        minHeight: 40,
      }),
    };

    return [defaultStyle, ...colorStyle, size];
  };

  return {
    MuiFab: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: FabOwnerState }) => rootStyles(ownerState),
      },
    },
  };
}
