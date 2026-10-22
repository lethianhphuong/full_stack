import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Container>
      <Box
        sx={{
          py: 12,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          minHeight: '100vh',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          Xin lỗi, không tìm thấy trang!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể bạn đã nhập sai URL? Hãy kiểm tra lại chính tả.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration_404.svg"
          sx={{
            mx: 'auto',
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />

        <Button
          component={RouterLink}
          to="/"
          size="large"
          variant="contained"
        >
          Về trang chủ
        </Button>
      </Box>
    </Container>
  );
}
