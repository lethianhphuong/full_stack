import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AppPageContainer } from '@/components';
import type { AppPageTabItem, BreadcrumbItem } from '@/components';
import Iconify from '@/components/iconify';
import CheatsheetTab from './CheatsheetTab';
import PlaygroundTab from './PlaygroundTab';
import type { PlaygroundSettings } from './PlaygroundTab';
import UseCasesTab from './UseCasesTab';
import type { DemoScenario } from './UseCasesTab';

type DemoTab = 'playground' | 'use-cases' | 'cheatsheet';

const INITIAL_SETTINGS: PlaygroundSettings = {
  titleMode: 'route',
  breadcrumbMode: 'route',
  widthMode: 'auto',
  hideTitle: false,
  showSubTitle: true,
  showBack: false,
  showExtra: true,
  showContent: true,
  showTabExtra: true,
  disableCheatsheet: false,
  fixedHeader: false,
  loading: false,
  showFooter: false,
};

const CUSTOM_BREADCRUMB: BreadcrumbItem[] = [
  { title: 'Trang chủ', path: '/' },
  { title: 'DEMO PROJECT' },
  { title: 'Khu thử nghiệm' },
];

export default function AppPageContainerDemoView() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<DemoTab>('playground');
  const [settings, setSettings] = useState<PlaygroundSettings>(INITIAL_SETTINGS);
  const [scenario, setScenario] = useState<DemoScenario>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const isPlayground = activeTab === 'playground';
  const isUseCases = activeTab === 'use-cases';
  const detailScenario = isUseCases && scenario === 'detail';
  const listScenario = isUseCases && scenario === 'list';
  const dashboardScenario = isUseCases && scenario === 'dashboard';

  const tabs: AppPageTabItem[] = [
    { key: 'playground', tab: 'Playground', badge: 'LIVE' },
    { key: 'use-cases', tab: 'Use Cases', badge: 3 },
    { key: 'cheatsheet', tab: 'Props & Code', disabled: isPlayground && settings.disableCheatsheet },
  ];

  const title = isPlayground
    ? settings.titleMode === 'route'
      ? undefined
      : settings.titleMode === 'custom'
        ? 'Trang demo tùy chỉnh'
        : (
          <Stack component="span" direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:layers-minimalistic-bold-duotone" width={30} sx={{ color: 'primary.main' }} />
            <Box component="span">Tiêu đề ReactNode</Box>
          </Stack>
        )
    : isUseCases
      ? scenario === 'list' ? 'Danh sách bản ghi' : scenario === 'detail' ? 'Chi tiết hồ sơ' : 'Tổng quan hoạt động'
      : undefined;

  const breadcrumb = isPlayground
    ? settings.breadcrumbMode === 'hidden' ? false : settings.breadcrumbMode === 'custom' ? CUSTOM_BREADCRUMB : undefined
    : undefined;

  const content = isPlayground && settings.showContent ? (
    <Alert severity="info" sx={{ mt: 1 }}>
      Đây là vùng content dưới tiêu đề. Thử tắt ở Playground để thấy khoảng cách header thay đổi.
    </Alert>
  ) : dashboardScenario ? (
    <Grid container spacing={2} sx={{ pt: 1 }}>
      {[
        ['Bản ghi', '128', 'solar:documents-bold-duotone'],
        ['Đang xử lý', '24', 'solar:clock-circle-bold-duotone'],
        ['Hoàn tất', '104', 'solar:check-circle-bold-duotone'],
      ].map(([label, value, icon]) => (
        <Grid key={label} size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main' }}>
              <Iconify icon={icon} width={24} />
              <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Stack>
            <Typography variant="h5" sx={{ mt: 1 }}>{value}</Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  ) : detailScenario ? (
    <Alert severity="info">Thử nút quay lại và thanh hành động cố định ở cuối màn hình.</Alert>
  ) : undefined;

  const extra = isPlayground && settings.showExtra ? (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Button variant="outlined" startIcon={<Iconify icon="solar:download-bold" width={18} />} onClick={() => enqueueSnackbar('Đã kích hoạt hành động Xuất mẫu', { variant: 'info' })}>
        Xuất mẫu
      </Button>
      <Button variant="contained" startIcon={<Iconify icon="solar:add-circle-bold" width={18} />} onClick={() => enqueueSnackbar('Đã kích hoạt hành động Tạo mới', { variant: 'success' })}>
        Tạo mới
      </Button>
    </Stack>
  ) : listScenario ? (
    <Button variant="contained" startIcon={<Iconify icon="solar:add-circle-bold" width={18} />} onClick={() => enqueueSnackbar('Đã kích hoạt Tạo mới trong trang danh sách', { variant: 'success' })}>
      Tạo mới
    </Button>
  ) : dashboardScenario ? (
    <Button variant="outlined" startIcon={<Iconify icon="solar:download-bold" width={18} />} onClick={() => enqueueSnackbar('Đã kích hoạt Xuất báo cáo mẫu', { variant: 'info' })}>
      Xuất báo cáo
    </Button>
  ) : undefined;

  const footer = isPlayground && settings.showFooter || detailScenario ? (
    <Stack direction="row" spacing={1} justifyContent="flex-end" useFlexGap flexWrap="wrap">
      <Button color="inherit" onClick={() => {
        if (isPlayground) setSettings((current) => ({ ...current, showFooter: false }));
        else setScenario('list');
      }}>
        Hủy
      </Button>
      <Button variant="contained" onClick={() => enqueueSnackbar('Đã lưu dữ liệu minh họa', { variant: 'success' })}>
        Lưu thay đổi
      </Button>
    </Stack>
  ) : undefined;

  const tabExtra = isPlayground && settings.showTabExtra ? (
    <Button size="small" color="inherit" startIcon={<Iconify icon="solar:restart-bold" width={18} />} onClick={() => setSettings(INITIAL_SETTINGS)}>
      Đặt lại
    </Button>
  ) : listScenario ? (
    <TextField
      size="small"
      label="Tìm bản ghi mẫu"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      sx={{ width: { xs: '100%', sm: 220 } }}
    />
  ) : undefined;

  const maxWidth = isPlayground
    ? settings.widthMode === 'auto' ? undefined : settings.widthMode === 'fluid' ? false : settings.widthMode
    : detailScenario ? 'md' : undefined;

  return (
    <AppPageContainer
      title={title}
      hideTitle={isPlayground && settings.hideTitle}
      subTitle={isPlayground ? settings.showSubTitle ? 'Khám phá các prop ngay trên trang này' : undefined : isUseCases ? 'Một component cho nhiều kiểu trang' : 'Tài liệu dùng nhanh cho developer'}
      breadcrumb={breadcrumb}
      onBack={isPlayground && settings.showBack ? () => navigate(-1) : detailScenario ? () => setScenario('list') : undefined}
      extra={extra}
      content={content}
      tabList={tabs}
      tabActiveKey={activeTab}
      onTabChange={(key) => setActiveTab(key as DemoTab)}
      tabBarExtraContent={tabExtra}
      fixedHeader={isPlayground ? settings.fixedHeader : detailScenario}
      loading={isPlayground && settings.loading}
      footer={footer}
      maxWidth={maxWidth}
    >
      {activeTab === 'playground' && (
        <PlaygroundTab settings={settings} onChange={(next) => setSettings((current) => ({ ...current, ...next }))} />
      )}
      {activeTab === 'use-cases' && (
        <UseCasesTab scenario={scenario} onScenarioChange={setScenario} searchQuery={searchQuery} />
      )}
      {activeTab === 'cheatsheet' && <CheatsheetTab />}
    </AppPageContainer>
  );
}
