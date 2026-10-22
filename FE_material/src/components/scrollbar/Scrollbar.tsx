import { memo, forwardRef } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledScrollbar = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.grey[500], 0.1),
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.grey[500], 0.3),
    '&:hover': {
      backgroundColor: alpha(theme.palette.grey[500], 0.5),
    },
  },
}));

// ----------------------------------------------------------------------

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const Scrollbar = forwardRef<HTMLDivElement, Props>(({ children, sx }, ref) => {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (mobile) {
    return (
      <Box ref={ref} sx={{ overflow: 'auto', ...sx }}>
        {children}
      </Box>
    );
  }

  return (
    <StyledScrollbar ref={ref} sx={sx}>
      {children}
    </StyledScrollbar>
  );
});

export default memo(Scrollbar);
