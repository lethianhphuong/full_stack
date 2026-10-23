import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

interface RouterStatusBarProps {
  totalEntries: number;
  totalConfiguredEntries: number;
}

export default function RouterStatusBar({ totalEntries, totalConfiguredEntries }: RouterStatusBarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 1.25,
        px: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.neutral, 0.65),
      }}
    >
      {/* Left Info */}
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12 }}>
          Hiển thị <strong>{totalEntries}</strong>/{totalConfiguredEntries} mục cấu hình điều hướng
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'success.main',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: 12,
            }}
          >
            Dữ liệu mock độc lập, không tác động router hoặc sidebar thật
          </Typography>
        </Stack>
      </Stack>

      {/* Right source hint */}
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12 }}>
          Reload để quay về dữ liệu mock ban đầu
        </Typography>
      </Stack>
    </Box>
  );
}
