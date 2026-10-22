import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../components/iconify';
import { AuthSocialButtons } from '@/sections/auth/components';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Bắt đầu hoàn toàn miễn phí</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Đã có tài khoản?
        </Typography>
        <Link 
          component={RouterLink} 
          to="/auth/login" 
          variant="subtitle2"
          sx={{ color: 'primary.main' }}
        >
          Đăng nhập
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField name="firstName" label="Họ" fullWidth />
          <TextField name="lastName" label="Tên" fullWidth />
        </Stack>

        <TextField name="email" label="Địa chỉ email" fullWidth />

        <TextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
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
          Tạo tài khoản
        </LoadingButton>
      </Stack>
    </form>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      Bằng việc đăng ký, tôi đồng ý với{' '}
      <Link underline="always" color="text.primary">
        Điều khoản dịch vụ
      </Link>
      {' và '}
      <Link underline="always" color="text.primary">
        Chính sách bảo mật
      </Link>
      .
    </Typography>
  );

  return (
    <>
      {renderHead}

      <AuthSocialButtons />

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          HOẶC
        </Typography>
      </Divider>

      {renderForm}

      {renderTerms}
    </>
  );
}
