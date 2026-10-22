import { useState } from 'react';
import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import { PageTransition } from '@/components/page-transition';
import { styled } from '@mui/material/styles';
import Header from './header';
import Nav from './nav';
import { usePreferencesStore } from '@/store';
import { HEADER_MOBILE, HEADER_DESKTOP, HEADER_DESKTOP_HORIZONTAL, NAV_WIDTH, NAV_MINI_WIDTH } from './constants';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflowX: 'clip',
});

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'isNavMini' && prop !== 'isHorizontal',
})<{ isNavMini?: boolean; isHorizontal?: boolean }>(({ theme, isNavMini, isHorizontal }) => ({
  flexGrow: 1,
  minWidth: 0,
  overflow: 'visible',
  height: '100dvh',
  minHeight: 0,
  paddingTop: HEADER_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  // Legacy pages keep bottom spacing; full-height pages use the entire viewport.
  '&:has([data-app-page-container])': {
    paddingTop: HEADER_MOBILE,
    paddingBottom: 0,
  },
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('lg')]: {
    paddingTop: isHorizontal 
      ? HEADER_DESKTOP_HORIZONTAL + 64 + 24
      : HEADER_DESKTOP + 24,
    '&:has([data-app-page-container])': {
      paddingTop: isHorizontal ? HEADER_DESKTOP_HORIZONTAL + 64 : HEADER_DESKTOP,
    },
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    width: isHorizontal 
      ? '100%' 
      : `calc(100% - ${isNavMini ? NAV_MINI_WIDTH : NAV_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      duration: theme.transitions.duration.standard,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const settings = usePreferencesStore();
  const [open, setOpen] = useState(false);
  
  const isNavMini = settings.themeLayout === 'mini';
  const isHorizontal = settings.themeLayout === 'horizontal';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Horizontal layout - menu is now inline with header
  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={handleOpen} isHorizontal />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100dvh',
            minHeight: 0,
            pt: `${HEADER_DESKTOP_HORIZONTAL + 24}px`,
            pb: 10,
            '&:has([data-app-page-container])': { pt: `${HEADER_DESKTOP_HORIZONTAL}px`, pb: 0 },
            px: { xs: 2, lg: 3 },
          }}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Box>
      </>
    );
  }

  // Vertical / Mini layout
  return (
    <StyledRoot>
      <Header onOpenNav={handleOpen} />

      <Nav openNav={open} onCloseNav={handleClose} />

      <Main isNavMini={isNavMini} isHorizontal={false}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Main>
    </StyledRoot>
  );
}
