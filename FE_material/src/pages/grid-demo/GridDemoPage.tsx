import { useState, lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';

// Lazy load tab components
const BasicTableDemo = lazy(() => import('./tabs/BasicTableDemo'));
const RowSelectionDemo = lazy(() => import('./tabs/RowSelectionDemo'));
const ColumnPinningDemo = lazy(() => import('./tabs/ColumnPinningDemo'));
const GroupingDemo = lazy(() => import('./tabs/GroupingDemo'));
const RowActionsDemo = lazy(() => import('./tabs/RowActionsDemo'));
const ServerSideDemo = lazy(() => import('./tabs/ServerSideDemo'));
const ExportDemo = lazy(() => import('./tabs/ExportDemo'));
const VirtualizationDemo = lazy(() => import('./tabs/VirtualizationDemo'));

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'basic',
    label: 'Cơ bản',
    icon: 'solar:widget-bold-duotone',
    component: BasicTableDemo,
    description: 'Sắp xếp, Lọc, Phân trang',
  },
  {
    value: 'selection',
    label: 'Chọn hàng',
    icon: 'solar:check-square-bold-duotone',
    component: RowSelectionDemo,
    description: 'Checkbox selection',
  },
  {
    value: 'pinning',
    label: 'Ghim cột',
    icon: 'solar:pin-bold-duotone',
    component: ColumnPinningDemo,
    description: 'Column pinning & resizing',
  },
  {
    value: 'grouping',
    label: 'Nhóm',
    icon: 'solar:folder-favourite-bookmark-bold-duotone',
    component: GroupingDemo,
    description: 'Row grouping & aggregation',
  },
  {
    value: 'actions',
    label: 'Hành động',
    icon: 'solar:menu-dots-bold-duotone',
    component: RowActionsDemo,
    description: 'CRUD row actions',
  },
  {
    value: 'server',
    label: 'Server-Side',
    icon: 'solar:server-square-bold-duotone',
    component: ServerSideDemo,
    description: 'Server-side pagination',
  },
  {
    value: 'export',
    label: 'Xuất file',
    icon: 'solar:export-bold-duotone',
    component: ExportDemo,
    description: 'Export to CSV',
  },
  {
    value: 'virtualization',
    label: 'Virtualization',
    icon: 'solar:layers-bold-duotone',
    component: VirtualizationDemo,
    description: '1000+ rows',
  },
];

// ----------------------------------------------------------------------

export default function GridDemoPage() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('basic');

  const currentTabConfig = TABS.find((tab) => tab.value === currentTab);
  const TabComponent = currentTabConfig?.component;

  return (
    <Container maxWidth="xl" sx={{ pb: 5 }}>
      {/* Header */}
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">Material React Table Demo</Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Trang chủ
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'text.disabled',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Components
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'text.disabled',
            }}
          />
          <Typography variant="body2">Data Table</Typography>
        </Stack>
      </Stack>

      {/* Info Card */}
      <Card
        sx={{
          mb: 3,
          p: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.24)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:table-bold-duotone" width={24} sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Material React Table
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DataTable component wrapper với localization tiếng Việt, MUI theming, và các preset thường dùng.
              Xem tài liệu đầy đủ tại{' '}
              <Box
                component="a"
                href="https://www.material-react-table.com/"
                target="_blank"
                rel="noopener"
                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                material-react-table.com
              </Box>
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Tabs Card */}
      <Card>
        <Tabs
          value={currentTab}
          onChange={(_, value) => setCurrentTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            bgcolor: alpha(theme.palette.grey[500], 0.08),
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon={tab.icon} width={20} />
                  <span>{tab.label}</span>
                </Stack>
              }
              sx={{
                minHeight: 56,
                textTransform: 'none',
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Suspense
            fallback={
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Đang tải...
                </Typography>
              </Box>
            }
          >
            {TabComponent && <TabComponent />}
          </Suspense>
        </Box>
      </Card>
    </Container>
  );
}
