import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import type { SubheaderSection } from '../types';

interface RouterSubheaderBannerProps {
  section: SubheaderSection;
  colSpan?: number;
}

export default function RouterSubheaderBanner({ section, colSpan = 8 }: RouterSubheaderBannerProps) {
  const theme = useTheme();

  return (
    <TableRow
      sx={{
        backgroundColor: alpha(theme.palette.success.main, 0.08),
        borderTop: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
        borderBottom: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
      }}
    >
      <TableCell colSpan={colSpan} sx={{ py: 1.25, px: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
            <Iconify
              icon="solar:bookmark-opened-bold"
              width={18}
              sx={{ color: 'success.main', flexShrink: 0 }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: 'success.dark',
                fontSize: 12.5,
                letterSpacing: 0.5,
              }}
            >
              SUBHEADER: {section.title}
            </Typography>
          </Stack>

          <Chip
            label={`${section.routeCount} route`}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 500,
              backgroundColor: alpha(theme.palette.grey[500], 0.12),
              color: 'text.secondary',
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
