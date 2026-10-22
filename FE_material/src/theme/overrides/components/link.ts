import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function link(_theme: Theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
  };
}
