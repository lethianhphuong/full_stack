import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function avatar(theme: Theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 16,
          fontWeight: theme.typography.fontWeightSemiBold,
        },
        colorDefault: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.grey[400],
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        root: {
          justifyContent: 'flex-end',
        },
        avatar: {
          fontSize: 16,
          fontWeight: theme.typography.fontWeightSemiBold,
          '&:first-of-type': {
            fontSize: 12,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
          },
        },
      },
    },
  };
}
