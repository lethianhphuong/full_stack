import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import Logo from '../../components/logo';
import { Outlet } from 'react-router-dom';

// ----------------------------------------------------------------------

const StyledRoot = styled('main')(() => ({
  height: '100%',
  display: 'flex',
  position: 'relative',
}));

const StyledSection = styled('div')(({ theme }) => ({
  display: 'none',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  width: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 2),
  [theme.breakpoints.up('md')]: {
    flexShrink: 0,
    padding: theme.spacing(20, 8, 0, 8),
  },
}));

// Circle decorations
const CircleDecoration = styled('span')(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: alpha(theme.palette.common.white, 0.08),
}));

// Grid pattern overlay
const GridPattern = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `linear-gradient(${alpha(theme.palette.common.white, 0.05)} 1px, transparent 1px),
                    linear-gradient(90deg, ${alpha(theme.palette.common.white, 0.05)} 1px, transparent 1px)`,
  backgroundSize: '40px 40px',
  opacity: 0.5,
}));

// ----------------------------------------------------------------------

export default function AuthLayout() {
  return (
    <StyledRoot>
      {/* Logo */}
      <Box
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      >
        <Logo />
      </Box>

      {/* Left Section - Decorative */}
      <StyledSection>
        <GridPattern />
        
        {/* Decorative circles */}
        <CircleDecoration sx={{ top: -100, right: -100, width: 400, height: 400 }} />
        <CircleDecoration sx={{ bottom: -150, left: -100, width: 500, height: 500 }} />
        <CircleDecoration sx={{ top: '40%', left: '10%', width: 200, height: 200 }} />
        <CircleDecoration sx={{ bottom: '20%', right: '15%', width: 150, height: 150, opacity: 0.5 }} />

        {/* Content */}
        <Stack
          spacing={4}
          sx={{
            zIndex: 10,
            maxWidth: 480,
            px: 5,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'common.white',
              fontWeight: 700,
            }}
          >
            Hi, Welcome back
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: alpha('#fff', 0.72),
              maxWidth: 360,
              mx: 'auto',
            }}
          >
            More effectively with optimized workflows.
          </Typography>

          {/* Illustration placeholder */}
          <Box
            sx={{
              mt: 5,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: alpha('#fff', 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `dashed 2px ${alpha('#fff', 0.24)}`,
              }}
            >
              <Box
                sx={{
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  background: alpha('#fff', 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: 100 }}>
                  🚀
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </StyledSection>

      {/* Right Section - Form */}
      <StyledContent>
        <Outlet />
      </StyledContent>
    </StyledRoot>
  );
}
