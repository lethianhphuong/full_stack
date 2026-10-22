import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export type TitleMode = 'route' | 'custom' | 'rich';
export type BreadcrumbMode = 'route' | 'custom' | 'hidden';
export type WidthMode = 'auto' | 'fluid' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PlaygroundSettings {
  titleMode: TitleMode;
  breadcrumbMode: BreadcrumbMode;
  widthMode: WidthMode;
  hideTitle: boolean;
  showSubTitle: boolean;
  showBack: boolean;
  showExtra: boolean;
  showContent: boolean;
  showTabExtra: boolean;
  disableCheatsheet: boolean;
  fixedHeader: boolean;
  loading: boolean;
  showFooter: boolean;
}

interface PlaygroundTabProps {
  settings: PlaygroundSettings;
  onChange: (next: Partial<PlaygroundSettings>) => void;
}

const TOGGLES: { key: keyof PlaygroundSettings; label: string; hint: string }[] = [
  { key: 'hideTitle', label: 'Ẩn tiêu đề', hint: 'hideTitle' },
  { key: 'showSubTitle', label: 'Phụ đề', hint: 'subTitle' },
  { key: 'showBack', label: 'Nút quay lại', hint: 'onBack' },
  { key: 'showExtra', label: 'Hành động header', hint: 'extra' },
  { key: 'showContent', label: 'Nội dung phụ', hint: 'content' },
  { key: 'showTabExtra', label: 'Công cụ trên tab', hint: 'tabBarExtraContent' },
  { key: 'disableCheatsheet', label: 'Vô hiệu tab Cheatsheet', hint: 'tabList.disabled' },
  { key: 'fixedHeader', label: 'Nền mờ header cố định', hint: 'fixedHeader' },
  { key: 'loading', label: 'Thanh tải trang', hint: 'loading' },
  { key: 'showFooter', label: 'Thanh hành động đáy', hint: 'footer' },
];

export default function PlaygroundTab({ settings, onChange }: PlaygroundTabProps) {
  return (
    <Stack spacing={3}>
      <Card sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h6">Điều khiển trực tiếp</Typography>
          <Typography variant="body2" color="text.secondary">
            Thay đổi các trường dưới đây để xem header, breadcrumb, tab và footer phản hồi ngay trên trang này.
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <TextField
              select fullWidth size="small" label="Tiêu đề"
              value={settings.titleMode}
              onChange={(event) => onChange({ titleMode: event.target.value as TitleMode })}
            >
              <MenuItem value="route">Tự lấy từ route</MenuItem>
              <MenuItem value="custom">Chuỗi tùy chỉnh</MenuItem>
              <MenuItem value="rich">ReactNode tùy chỉnh</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <TextField
              select fullWidth size="small" label="Breadcrumb"
              value={settings.breadcrumbMode}
              onChange={(event) => onChange({ breadcrumbMode: event.target.value as BreadcrumbMode })}
            >
              <MenuItem value="route">Tự lấy từ URL</MenuItem>
              <MenuItem value="custom">Mảng tùy chỉnh</MenuItem>
              <MenuItem value="hidden">Ẩn hoàn toàn</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <TextField
              select fullWidth size="small" label="Độ rộng container"
              value={settings.widthMode}
              onChange={(event) => onChange({ widthMode: event.target.value as WidthMode })}
            >
              <MenuItem value="auto">Theo themeCompact</MenuItem>
              <MenuItem value="fluid">Toàn chiều rộng</MenuItem>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((width) => (
                <MenuItem key={width} value={width}>{width.toUpperCase()}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ mt: 2 }}>
          {TOGGLES.map(({ key, label, hint }) => (
            <Grid key={key} size={{ xs: 12, sm: 6, lg: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(settings[key])}
                    onChange={(event) => onChange({ [key]: event.target.checked })}
                  />
                }
                label={
                  <Stack>
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="caption" color="text.secondary">{hint}</Typography>
                  </Stack>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      <Card sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Kiểm tra cuộn nội bộ</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Cuộn vùng nội dung này: breadcrumb, tiêu đề và tab luôn đứng yên. Bật fixedHeader để so sánh nền mờ và viền phân cách.
        </Typography>
        <Stack spacing={2}>
          {[
            ['Header', 'title, subTitle, extra và onBack nằm ngoài vùng cuộn nội dung.'],
            ['Breadcrumb', 'Mặc định lấy route hiện tại; có thể truyền mảng riêng hoặc false để ẩn.'],
            ['Tabs', 'Tab có key riêng, badge, trạng thái disabled và callback onTabChange.'],
            ['Loading', 'LinearProgress đặt ngay dưới cụm header khi loading=true.'],
            ['Footer', 'Thanh hành động nằm ở đáy flex layout, không cần offset theo sidebar.'],
            ['Layout', 'maxWidth ghi đè themeCompact; nội dung dài vẫn nằm trong container.'],
          ].map(([name, description], index) => (
            <Stack key={name} direction="row" spacing={2} sx={{ py: 2, borderTop: index ? 1 : 0, borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ minWidth: 96 }}>{name}</Typography>
              <Typography variant="body2" color="text.secondary">{description}</Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
