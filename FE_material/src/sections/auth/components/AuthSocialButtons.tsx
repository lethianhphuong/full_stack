import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Iconify from '@/components/iconify';

const SOCIAL_PROVIDERS = [
  { name: 'Google', icon: 'eva:google-fill' },
  { name: 'GitHub', icon: 'eva:github-fill' },
  { name: 'Twitter', icon: 'eva:twitter-fill' },
] as const;

export default function AuthSocialButtons() {
  return (
    <Stack direction="row" spacing={2}>
      {SOCIAL_PROVIDERS.map((provider) => (
        <Button
          key={provider.name}
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          aria-label={`Tiếp tục với ${provider.name}`}
          sx={{ borderColor: (theme) => alpha(theme.palette.grey[500], 0.16) }}
        >
          <Iconify icon={provider.icon} width={24} />
        </Button>
      ))}
    </Stack>
  );
}
