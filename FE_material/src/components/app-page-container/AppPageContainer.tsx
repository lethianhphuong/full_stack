import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
import type { CSSObject } from '@mui/material/styles';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { usePreferencesStore } from '@/store';
import { bgBlur } from '@/theme/css';
import AppPageHeader from './AppPageHeader';
import type { AppPageContainerProps } from './types';

export default function AppPageContainer({
  title,
  hideTitle = false,
  subTitle,
  content,
  extra,
  onBack,
  breadcrumb,
  tabList,
  tabActiveKey,
  onTabChange,
  tabBarExtraContent,
  fixedHeader = false,
  loading = false,
  footer,
  maxWidth,
  children,
  sx,
  className,
}: AppPageContainerProps) {
  const theme = useTheme();
  const themeCompact = usePreferencesStore((state) => state.themeCompact);
  const themeLayout = usePreferencesStore((state) => state.themeLayout);
  const { breadcrumbItems, currentRouteTitle } = useBreadcrumb();
  const resolvedMaxWidth = maxWidth ?? (themeCompact ? 'xl' : false);

  const isHorizontal = themeLayout === 'horizontal';
  const hasCustomBreadcrumb = breadcrumb !== undefined && breadcrumb !== false;
  const pageBreadcrumbSx = isHorizontal || hasCustomBreadcrumb
    ? undefined
    : { display: { xs: 'block', lg: 'none' } };

  return (
    <Box
      data-app-page-container
      className={className}
      sx={[
        { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minWidth: 0, minHeight: 0, overflow: 'hidden' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          flexShrink: 0,
          ...(fixedHeader ? {
            ...(bgBlur({ color: theme.palette.background.default, blur: 8, opacity: 0.92 }) as CSSObject),
            borderBottom: 1,
            borderColor: 'divider',
          } : {}),
        }}
      >
        <Container maxWidth={resolvedMaxWidth} disableGutters>
          <AppPageHeader
            title={title === undefined ? currentRouteTitle : title}
            hideTitle={hideTitle}
            subTitle={subTitle}
            content={content}
            extra={extra}
            onBack={onBack}
            breadcrumbItems={breadcrumb === undefined ? breadcrumbItems : breadcrumb}
            breadcrumbSx={pageBreadcrumbSx}
            tabList={tabList}
            tabActiveKey={tabActiveKey}
            onTabChange={onTabChange}
            tabBarExtraContent={tabBarExtraContent}
          />
        </Container>
        {loading && <LinearProgress aria-label="Đang tải nội dung trang" />}
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth={resolvedMaxWidth}
          disableGutters
          sx={{
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            pt: tabList?.length ? 2 : 1,
            pb: 1,
          }}
        >
          {children}
        </Container>
      </Box>

      {footer && (
        <Box
          sx={{
            flexShrink: 0,
            ...(bgBlur({ color: theme.palette.background.paper, blur: 8, opacity: 0.92 }) as CSSObject),
            borderTop: 1,
            borderColor: 'divider',
            boxShadow: theme.customShadows.card,
          }}
        >
          <Container maxWidth={resolvedMaxWidth} disableGutters sx={{ py: 2, minWidth: 0 }}>
            {footer}
          </Container>
        </Box>
      )}
    </Box>
  );
}
