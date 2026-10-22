import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  height: 280,
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  [theme.breakpoints.up('md')]: {
    height: 320,
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  zIndex: 9,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5),
    maxWidth: '60%',
  },
}));

const StyledIllustration = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    position: 'absolute',
    right: 20,
    bottom: 0,
    width: 260,
    height: 260,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
}));

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  right: 0,
  width: 260,
  height: '100%',
  position: 'absolute',
  background: `linear-gradient(to right, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(theme.palette.primary.darker, 0.24)} 100%)`,
}));

// Circle decorations
const CircleDecoration = styled('span')(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: alpha(theme.palette.common.white, 0.08),
}));

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  subheader?: string;
  description?: string;
  action?: React.ReactNode;
  img?: string;
};

export default function EcommerceWelcome({
  title = 'Xin chúc mừng! \nJaydon Frankie',
  subheader,
  description = 'Người bán hàng xuất sắc nhất tháng. Bạn đã đạt 57.6% doanh số bán hàng hôm nay.',
  action,
  img,
  ...other
}: Props) {
  return (
    <StyledRoot {...other}>
      {/* Circle decorations */}
      <CircleDecoration sx={{ top: -40, right: 80, width: 160, height: 160 }} />
      <CircleDecoration sx={{ top: 60, right: -20, width: 120, height: 120 }} />
      <CircleDecoration sx={{ bottom: -60, left: '40%', width: 200, height: 200, opacity: 0.5 }} />

      <StyledOverlay />

      <StyledContent>
        <Typography
          variant="h4"
          sx={{
            color: 'common.white',
            whiteSpace: 'pre-line',
            mb: 2,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: alpha('#fff', 0.72),
            maxWidth: 360,
            mb: 3,
          }}
        >
          {description}
        </Typography>

        {action || (
          <Button
            variant="contained"
            sx={{
              bgcolor: 'common.white',
              color: 'primary.dark',
              width: 'fit-content',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Bắt đầu
          </Button>
        )}
      </StyledContent>

      <StyledIllustration>
        {img ? (
          <Box component="img" src={img} alt="welcome" sx={{ width: '100%', height: 'auto' }} />
        ) : (
          // Placeholder illustration - woman with laptop
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: alpha('#fff', 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: 80 }}>👩‍💻</Typography>
          </Box>
        )}
      </StyledIllustration>
    </StyledRoot>
  );
}
