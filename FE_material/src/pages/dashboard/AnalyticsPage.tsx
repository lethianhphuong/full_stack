import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { usePreferencesStore } from '@/store';

// ----------------------------------------------------------------------

export default function AnalyticsPage() {
  const settings = usePreferencesStore();

  return (
    <Container maxWidth={settings.themeCompact ? 'xl' : false}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Phân tích
      </Typography>

      <Typography variant="body1">
        Nội dung trang phân tích sẽ ở đây...
      </Typography>
    </Container>
  );
}
