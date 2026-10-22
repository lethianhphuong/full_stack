import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/iconify';

const PROP_REFERENCE = [
  ['title', 'React.ReactNode', 'Tên route hiện tại', 'Tiêu đề; bỏ trống để dùng route tự động.'],
  ['hideTitle', 'boolean', 'false', 'Ẩn dòng tiêu đề H4, giữ nguyên các phần khác của header.'],
  ['subTitle', 'React.ReactNode', '—', 'Phụ đề cạnh tiêu đề.'],
  ['content', 'React.ReactNode', '—', 'Mô tả hoặc số liệu bên dưới title row.'],
  ['extra', 'React.ReactNode', '—', 'Hành động ở góc phải header.'],
  ['onBack', '() => void', '—', 'Hiển thị nút quay lại khi được truyền.'],
  ['breadcrumb', 'BreadcrumbItem[] | false', 'Từ route hiện tại', 'Mảng riêng hoặc false để ẩn.'],
  ['tabList', 'AppPageTabItem[]', '—', 'Danh sách tab, badge và disabled.'],
  ['tabActiveKey', 'string', 'Tab khả dụng đầu tiên', 'Key tab được chọn khi điều khiển từ ngoài.'],
  ['onTabChange', '(key: string) => void', '—', 'Được gọi sau khi chuyển tab.'],
  ['tabBarExtraContent', 'React.ReactNode', '—', 'Công cụ ở cuối thanh tab.'],
  ['fixedHeader', 'boolean', 'false', 'Header luôn cố định; bật nền mờ và viền phân cách.'],
  ['loading', 'boolean', 'false', 'Hiển thị LinearProgress dưới header.'],
  ['footer', 'React.ReactNode', '—', 'Thanh hành động cố định ở đáy.'],
  ['maxWidth', "'xs' | 'sm' | 'md' | 'lg' | 'xl' | false", 'Theo themeCompact', 'Ghi đè độ rộng MUI Container.'],
  ['children', 'React.ReactNode', '—', 'Nội dung chính của trang.'],
  ['sx', 'SxProps<Theme>', '—', 'Style bổ sung cho container.'],
  ['className', 'string', '—', 'Class name bổ sung cho container.'],
] as const;

const SNIPPETS = [
  {
    title: 'Mặc định: title và breadcrumb theo route',
    code: [
      "import { AppPageContainer } from '@/components';",
      "import Typography from '@mui/material/Typography';",
      '',
      'export default function ListPage() {',
      '  return (',
      '    <AppPageContainer>',
      '      <Typography>Nội dung trang của bạn</Typography>',
      '    </AppPageContainer>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    title: 'Danh sách: tab, badge và hành động',
    code: [
      "import { useState } from 'react';",
      "import Button from '@mui/material/Button';",
      "import Typography from '@mui/material/Typography';",
      "import { AppPageContainer } from '@/components';",
      "import type { AppPageTabItem } from '@/components';",
      '',
      'const TABS: AppPageTabItem[] = [',
      "  { key: 'all', tab: 'Tất cả', badge: 32 },",
      "  { key: 'pending', tab: 'Chờ xử lý', badge: 5 },",
      "  { key: 'archived', tab: 'Lưu trữ', disabled: true },",
      '];',
      '',
      'export default function ListPage() {',
      "  const [tab, setTab] = useState('all');",
      '  return (',
      '    <AppPageContainer',
      '      tabList={TABS}',
      '      tabActiveKey={tab}',
      '      onTabChange={setTab}',
      '      extra={<Button variant="contained">Tạo mới</Button>}',
      '    >',
      "      <Typography>Đang xem: {tab}</Typography>",
      '    </AppPageContainer>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    title: 'Biểu mẫu: quay lại, loading và footer',
    code: [
      "import { useNavigate } from 'react-router';",
      "import Button from '@mui/material/Button';",
      "import Stack from '@mui/material/Stack';",
      "import TextField from '@mui/material/TextField';",
      "import { AppPageContainer } from '@/components';",
      '',
      'export default function DetailPage() {',
      '  const navigate = useNavigate();',
      '  return (',
      '    <AppPageContainer',
      '      title="Chỉnh sửa hồ sơ"',
      '      onBack={() => navigate(-1)}',
      '      loading={false}',
      '      fixedHeader',
      '      maxWidth="md"',
      '      footer={',
      '        <Stack direction="row" justifyContent="flex-end" spacing={1}>',
      '          <Button onClick={() => navigate(-1)}>Hủy</Button>',
      '          <Button variant="contained" type="submit" form="detail-form">Lưu</Button>',
      '        </Stack>',
      '      }',
      '    >',
      '      <form id="detail-form" onSubmit={(event) => event.preventDefault()}>',
      '        <TextField name="name" label="Tên hồ sơ" fullWidth />',
      '      </form>',
      '    </AppPageContainer>',
      '  );',
      '}',
    ].join('\n'),
  },
];

export default function CheatsheetTab() {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      enqueueSnackbar('Đã sao chép mã mẫu', { variant: 'success' });
    } catch {
      enqueueSnackbar('Không thể sao chép. Hãy chọn và sao chép mã thủ công.', { variant: 'warning' });
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Tra cứu props</Typography>
        <Typography variant="body2" color="text.secondary">
          Kiểu dữ liệu phản ánh AppPageContainerProps hiện tại. Các giá trị bỏ trống đều là tùy chọn.
        </Typography>
      </Stack>

      <TableContainer component={Card} sx={{ border: 1, borderColor: 'divider', boxShadow: 'none' }}>
        <Table size="small" sx={{ minWidth: 720 }} aria-label="Bảng props AppPageContainer">
          <TableHead>
            <TableRow>
              <TableCell>Prop</TableCell>
              <TableCell>Kiểu TypeScript</TableCell>
              <TableCell>Mặc định</TableCell>
              <TableCell>Ý nghĩa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PROP_REFERENCE.map(([name, type, fallback, description]) => (
              <TableRow key={name}>
                <TableCell component="th" scope="row"><Typography variant="subtitle2">{name}</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{type}</Typography></TableCell>
                <TableCell>{fallback}</TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2}>
        <Typography variant="h6">Code mẫu</Typography>
        {SNIPPETS.map((snippet) => (
          <Card key={snippet.title} sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{snippet.title}</Typography>
              <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:copy-bold" width={18} />} onClick={() => void handleCopy(snippet.code)}>
                Sao chép
              </Button>
            </Stack>
            <Box
              component="pre"
              sx={{ m: 0, p: 2, overflowX: 'auto', borderRadius: 1.5, bgcolor: 'background.default', color: 'text.primary', typography: 'body2', whiteSpace: 'pre' }}
            >
              <Box component="code">{snippet.code}</Box>
            </Box>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
