import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import type { SxProps, Theme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import type { BreadcrumbItem } from './types';

interface AppPageBreadcrumbsProps {
  items: BreadcrumbItem[];
  sx?: SxProps<Theme>;
}

export default function AppPageBreadcrumbs({ items, sx }: AppPageBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <Breadcrumbs
      aria-label="Đường dẫn trang"
      sx={[
        { mb: 1, '& .MuiBreadcrumbs-ol': { flexWrap: 'wrap' } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        const label = index === 0 ? (
          <>
            <Iconify icon="solar:home-2-bold-duotone" width={18} aria-hidden="true" />
            {item.title}
          </>
        ) : item.title;

        return item.path && !isCurrent ? (
          <Link
            key={`${item.path}-${index}`}
            component={RouterLink}
            to={item.path}
            underline="hover"
            color="text.secondary"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}
          >
            {label}
          </Link>
        ) : (
          <Typography
            key={`${item.path ?? index}-${index}`}
            color={isCurrent ? 'text.primary' : 'text.secondary'}
            aria-current={isCurrent ? 'page' : undefined}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, minWidth: 0, overflowWrap: 'anywhere' }}
          >
            {label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}
