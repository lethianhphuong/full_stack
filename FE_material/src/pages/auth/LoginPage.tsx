import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Iconify from '../../components/iconify';
import { AuthSocialButtons } from '@/sections/auth/components';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Đăng nhập vào Minimal</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Người dùng mới?
        </Typography>
        <Link 
          component={RouterLink} 
          to="/auth/register" 
          variant="subtitle2"
          sx={{ color: 'primary.main' }}
        >
          Tạo tài khoản
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <TextField
          name="email"
          label="Địa chỉ email"
          defaultValue="demo@minimals.cc"
          fullWidth
        />

        <TextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          defaultValue="demo1234"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={20} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2.5 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ghi nhớ đăng nhập
            </Typography>
          }
        />

        <Link
          component={RouterLink}
          to="/auth/forgot-password"
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ fontWeight: 600 }}
        >
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={loading}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) =>
            theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) =>
              theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
          },
        }}
        >
          Đăng nhập
        </LoadingButton>
    </form>
  );

  return (
    <>
      {renderHead}

      <Alert severity="info" sx={{ mb: 3 }}>
        Sử dụng email: <strong>demo@minimals.cc</strong> / mật khẩu: <strong>demo1234</strong>
      </Alert>

      {renderForm}

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          HOẶC
        </Typography>
      </Divider>

      <AuthSocialButtons />
    </>
  );
}
