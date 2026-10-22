import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';
import Iconify from '@/components/iconify';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';

export default function HeaderBreadcrumbs() {
  const { breadcrumbItems } = useBreadcrumb();

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        alignItems: 'center',
        minWidth: 0,
        mr: 2,
      }}
    >
      <Breadcrumbs
        separator={
          <Typography
            variant="body2"
            sx={{
              color: 'text.disabled',
              mx: 0.5,
              userSelect: 'none',
              fontSize: '0.8125rem',
            }}
          >
            /
          </Typography>
        }
        aria-label="Đường dẫn trang"
        sx={{
          minWidth: 0,
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap',
            alignItems: 'center',
          },
          '& .MuiBreadcrumbs-li': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isCurrent = index === breadcrumbItems.length - 1;
          const label = index === 0 ? (
            <>
              <Iconify icon="solar:home-2-bold-duotone" width={18} aria-hidden="true" />
              <span>{item.title}</span>
            </>
          ) : (
            <span>{item.title}</span>
          );

          return item.path && !isCurrent ? (
            <Link
              key={`${item.path}-${index}`}
              component={RouterLink}
              to={item.path}
              underline="hover"
              color="text.secondary"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 0,
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: (theme) => theme.transitions.create('color'),
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {label}
            </Link>
          ) : (
            <Typography
              key={`${item.path ?? index}-${index}`}
              color={isCurrent ? 'text.primary' : 'text.secondary'}
              aria-current={isCurrent ? 'page' : undefined}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 0,
                fontSize: '0.875rem',
                fontWeight: isCurrent ? 700 : 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: { lg: 320, xl: 480 },
              }}
            >
              {label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
