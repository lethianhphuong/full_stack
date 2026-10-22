import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledRoot = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  color: theme.palette.primary.dark,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const StyledBg = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: -1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: theme.palette.primary.light,
  '&:before': {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -2,
    content: '""',
    opacity: 0.2,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  img?: string;
  action?: React.ReactNode;
};

export default function AppWelcome({ title, description, action, img, ...other }: Props) {
  return (
    <StyledRoot {...other}>
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: 3,
            md: 5,
          },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            maxWidth: 360,
            mb: { xs: 3, xl: 5 },
          }}
        >
          {description}
        </Typography>

        {action && action}
      </Stack>

      {img && (
        <Box
          component="img"
          alt="welcome"
          src={img}
          sx={{
            p: 3,
            right: 0,
            bottom: 0,
            width: 360,
            position: {
              xs: 'relative',
              md: 'absolute',
            },
          }}
        />
      )}

      <StyledBg />
    </StyledRoot>
  );
}
