import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import AppPageBreadcrumbs from './AppPageBreadcrumbs';
import type { AppPageContainerProps, BreadcrumbItem } from './types';

type AppPageHeaderProps = Pick<
  AppPageContainerProps,
  'title' | 'hideTitle' | 'subTitle' | 'content' | 'extra' | 'onBack' | 'tabList' | 'tabActiveKey' | 'onTabChange' | 'tabBarExtraContent'
> & {
  breadcrumbItems: BreadcrumbItem[] | false;
  breadcrumbSx?: SxProps<Theme>;
};

export default function AppPageHeader({
  title,
  hideTitle = false,
  subTitle,
  content,
  extra,
  onBack,
  tabList,
  tabActiveKey,
  onTabChange,
  tabBarExtraContent,
  breadcrumbItems,
  breadcrumbSx,
}: AppPageHeaderProps) {
  const [internalTabKey, setInternalTabKey] = useState<string>();
  const availableTabKeys = tabList?.filter((item) => !item.disabled).map((item) => item.key) ?? [];
  const activeKey = tabActiveKey !== undefined
    ? tabActiveKey
    : internalTabKey && availableTabKeys.includes(internalTabKey)
      ? internalTabKey
      : availableTabKeys[0] ?? false;
  const showTitleRow = !hideTitle || Boolean(subTitle) || Boolean(onBack) || Boolean(extra);

  return (
    <Box sx={{ pt: 1 }}>
      {breadcrumbItems !== false && <AppPageBreadcrumbs items={breadcrumbItems} sx={breadcrumbSx} />}

      {showTitleRow && <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: content || tabList?.length ? 1 : 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          {onBack && (
            <IconButton onClick={onBack} aria-label="Quay lại" edge="start">
              <Iconify icon="solar:arrow-left-bold" width={22} />
            </IconButton>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'baseline' }} spacing={{ xs: 0, sm: 1.5 }}>
              {!hideTitle && <Typography variant="h4" sx={{ overflowWrap: 'anywhere' }}>{title}</Typography>}
              {subTitle && <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{subTitle}</Typography>}
            </Stack>
          </Box>
        </Stack>
        {extra && <Box sx={{ flexShrink: 0, maxWidth: '100%' }}>{extra}</Box>}
      </Stack>}

      {content && <Box sx={{ mb: tabList?.length ? 1 : 2, color: 'text.secondary' }}>{content}</Box>}

      {Boolean(tabList?.length) && (
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1} sx={{ minWidth: 0 }}>
          <Tabs
            value={activeKey}
            onChange={(_, key: string) => {
              if (tabActiveKey === undefined) setInternalTabKey(key);
              onTabChange?.(key);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ minWidth: 0, maxWidth: '100%' }}
          >
            {tabList?.map((item) => (
              <Tab
                key={item.key}
                value={item.key}
                disabled={item.disabled}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box component="span">{item.tab}</Box>
                    {item.badge !== undefined && <Chip label={item.badge} color="primary" size="small" sx={{ height: 22 }} />}
                  </Stack>
                }
              />
            ))}
          </Tabs>
          {tabBarExtraContent && <Box sx={{ flexShrink: 0, pb: { xs: 1, sm: 0 } }}>{tabBarExtraContent}</Box>}
        </Stack>
      )}
    </Box>
  );
}
