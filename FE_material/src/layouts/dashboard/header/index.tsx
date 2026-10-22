import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { alpha, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import Logo from '../../../components/logo';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import NavHorizontalInline from '../nav/NavHorizontalInline';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import { usePreferencesStore } from '@/store';
import { HEADER_MOBILE, HEADER_DESKTOP, HEADER_DESKTOP_HORIZONTAL, NAV_WIDTH, NAV_MINI_WIDTH } from '../constants';

// ----------------------------------------------------------------------

const StyledRoot = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  backgroundColor: alpha(theme.palette.background.default, 0.8),
}));

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'isHorizontal',
})<{ isHorizontal?: boolean }>(({ theme, isHorizontal }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: isHorizontal ? HEADER_DESKTOP_HORIZONTAL : HEADER_DESKTOP,
    padding: theme.spacing(0, 3),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  onOpenNav: () => void;
  isHorizontal?: boolean;
};

export default function Header({ onOpenNav, isHorizontal = false }: Props) {
  const settings = usePreferencesStore();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const isMini = settings.themeLayout === 'mini';

  const renderContent = (
    <>
      {isHorizontal && isDesktop && (
        <Box sx={{ mr: 2.5, display: 'flex', alignItems: 'center' }}>
          <Logo />
        </Box>
      )}

      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="solar:hamburger-menu-bold-duotone" width={24} />
        </IconButton>
      )}

      {/* Horizontal Nav Menu - inline with header */}
      {isHorizontal && isDesktop && (
        <Box sx={{ flex: 1, minWidth: 0, mx: 2 }}>
          <NavHorizontalInline />
        </Box>
      )}

      {/* Breadcrumbs for non-horizontal layout */}
      {!isHorizontal && <HeaderBreadcrumbs />}

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
        {/* Searchbar (Ctrl + K) */}
        <Searchbar />

        {/* Language Selector */}
        <IconButton sx={{ width: 40, height: 40 }}>
          <Box
            component="img"
            src="/assets/icons/flags/ic_flag_en.svg"
            alt="EN"
            sx={{ width: 24, height: 24, borderRadius: '50%' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </IconButton>

        {/* Notifications */}
        <NotificationsPopover />

        {/* Contacts */}
        <IconButton sx={{ width: 40, height: 40 }}>
          <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
        </IconButton>

        {/* Settings */}
        <IconButton 
          onClick={settings.onToggle} 
          sx={{ 
            width: 40, 
            height: 40,
            '& svg': {
              animation: 'spin 3s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            },
          }}
        >
          <Iconify icon="solar:settings-bold-duotone" width={24} />
        </IconButton>

        {/* Account */}
        <AccountPopover />
      </Stack>
    </>
  );

  // Horizontal layout - full width header
  if (isHorizontal) {
    return (
      <StyledRoot>
        <Container maxWidth="xl">
          <StyledToolbar disableGutters isHorizontal>
            {renderContent}
          </StyledToolbar>
        </Container>
      </StyledRoot>
    );
  }

  // Vertical / Mini layout
  return (
    <StyledRoot
      sx={{
        width: {
          lg: `calc(100% - ${isMini ? NAV_MINI_WIDTH : NAV_WIDTH}px)`,
        },
        ml: {
          lg: `${isMini ? NAV_MINI_WIDTH : NAV_WIDTH}px`,
        },
      }}
    >
      <StyledToolbar>
        {renderContent}
      </StyledToolbar>
    </StyledRoot>
  );
}
