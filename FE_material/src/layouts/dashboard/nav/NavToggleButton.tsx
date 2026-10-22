import IconButton from '@mui/material/IconButton';
import { alpha, styled } from '@mui/material/styles';
import { usePreferencesStore } from '@/store';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;
const NAV_MINI_WIDTH = 88;

const StyledToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.appBar + 1,
  top: 32,
  padding: 4,
  width: 26,
  height: 26,
  borderRadius: '50%',
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.24)}`,
  boxShadow: theme.customShadows?.z8,
  transition: theme.transitions.create(['left'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

// ----------------------------------------------------------------------

export default function NavToggleButton() {
  const themeLayout = usePreferencesStore((state) => state.themeLayout);
  const onUpdate = usePreferencesStore((state) => state.onUpdate);
  
  const isNavMini = themeLayout === 'mini';

  const handleToggle = () => {
    onUpdate('themeLayout', isNavMini ? 'vertical' : 'mini');
  };

  // Don't show toggle button in horizontal layout
  if (themeLayout === 'horizontal') {
    return null;
  }

  return (
    <StyledToggleButton
      onClick={handleToggle}
      sx={{
        left: isNavMini ? NAV_MINI_WIDTH - 13 : NAV_WIDTH - 13,
        display: { xs: 'none', lg: 'inline-flex' },
      }}
    >
      <Iconify
        icon={isNavMini ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
        width={16}
      />
    </StyledToggleButton>
  );
}
