import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledRoot = styled(Card)(({ theme }) => ({
  height: 280,
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.grey[900],
  [theme.breakpoints.up('md')]: {
    height: 320,
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  zIndex: 9,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const StyledImage = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '70%',
  height: '100%',
  zIndex: 1,
});

const StyledOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  background: `linear-gradient(to right, ${theme.palette.grey[900]} 30%, ${alpha(theme.palette.grey[900], 0)} 100%)`,
}));

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  img?: string;
  price?: number;
  discount?: number;
};

export default function EcommerceFeaturedProduct({
  title = 'Pegasus Running Shoes',
  description = 'Nike',
  img,
  price = 120,
  discount = 15,
  ...other
}: Props) {
  const discountedPrice = price - (price * discount) / 100;

  return (
    <StyledRoot {...other}>
      <StyledOverlay />

      <StyledImage>
        {img ? (
          <Box
            component="img"
            src={img}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${alpha('#00A76F', 0.2)} 0%, ${alpha('#00A76F', 0.05)} 100%)`,
            }}
          >
            <Typography sx={{ fontSize: 100 }}>👟</Typography>
          </Box>
        )}
      </StyledImage>

      <StyledContent>
        <Typography variant="overline" sx={{ color: 'primary.main', mb: 1 }}>
          {description}
        </Typography>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            ${discountedPrice.toFixed(2)}
          </Typography>
          {discount > 0 && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              ${price.toFixed(2)}
            </Typography>
          )}
        </Stack>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: 'fit-content' }}
        >
          Buy now
        </Button>
      </StyledContent>
    </StyledRoot>
  );
}
