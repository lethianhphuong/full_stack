import { GlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function NProgressStyles() {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '#nprogress': {
          pointerEvents: 'none',
        },
        '#nprogress .bar': {
          top: 0,
          left: 0,
          width: '100%',
          height: 3,
          zIndex: 9999,
          position: 'fixed',
          backgroundColor: theme.palette.primary.main,
          boxShadow: `0 0 2px ${theme.palette.primary.main}`,
        },
        '#nprogress .peg': {
          right: 0,
          width: 100,
          height: '100%',
          display: 'block',
          position: 'absolute',
          boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
          opacity: 1,
          transform: 'rotate(3deg) translate(0px, -4px)',
        },
      }}
    />
  );
}

export default NProgressStyles;
