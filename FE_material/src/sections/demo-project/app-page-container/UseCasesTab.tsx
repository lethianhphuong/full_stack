import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/iconify';

export type DemoScenario = 'list' | 'detail' | 'dashboard';

interface UseCasesTabProps {
  scenario: DemoScenario;
  onScenarioChange: (scenario: DemoScenario) => void;
  searchQuery: string;
}

const SCENARIOS: { key: DemoScenario; title: string; description: string; icon: string }[] = [
  { key: 'list', title: 'Trang danh sách', description: 'Tab lọc, tìm kiếm và hành động tạo mới.', icon: 'solar:list-bold-duotone' },
  { key: 'detail', title: 'Trang chi tiết', description: 'Nút quay lại cùng footer Lưu / Hủy.', icon: 'solar:document-text-bold-duotone' },
  { key: 'dashboard', title: 'Trang tổng quan', description: 'Số liệu tóm tắt trong vùng content.', icon: 'solar:chart-square-bold-duotone' },
];

const DEMO_RECORDS = [
  { name: 'Bản ghi A-1024', owner: 'Nguyễn Văn An', status: 'Đang xử lý' },
  { name: 'Bản ghi B-2048', owner: 'Trần Minh Hà', status: 'Hoàn tất' },
  { name: 'Bản ghi C-3072', owner: 'Lê Hoàng Nam', status: 'Đang xử lý' },
];

export default function UseCasesTab({ scenario, onScenarioChange, searchQuery }: UseCasesTabProps) {
  const visibleRecords = DEMO_RECORDS.filter((record) =>
    `${record.name} ${record.owner}`.toLocaleLowerCase('vi').includes(searchQuery.toLocaleLowerCase('vi')),
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Các kịch bản sử dụng</Typography>
        <Typography variant="body2" color="text.secondary">
          Chọn một kịch bản để áp các prop tương ứng lên header và footer của trang demo.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {SCENARIOS.map((item) => (
          <Grid key={item.key} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                border: 1,
                borderColor: scenario === item.key ? 'primary.main' : 'divider',
                boxShadow: 'none',
              }}
            >
              <CardActionArea
                onClick={() => onScenarioChange(item.key)}
                aria-pressed={scenario === item.key}
                sx={{ height: '100%', p: 2.5, alignItems: 'flex-start' }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ color: scenario === item.key ? 'primary.main' : 'text.secondary' }}>
                    <Iconify icon={item.icon} width={28} />
                  </Box>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {scenario === 'list' && (
        <Card sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Danh sách mẫu</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ô tìm kiếm ở bên phải thanh tab lọc danh sách này; nút “Tạo mới” nằm trong extra của header.
          </Typography>
          {visibleRecords.length ? visibleRecords.map((record) => (
            <Stack
              key={record.name}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
              sx={{ py: 2, borderTop: 1, borderColor: 'divider' }}
            >
              <Stack>
                <Typography variant="subtitle2">{record.name}</Typography>
                <Typography variant="body2" color="text.secondary">{record.owner}</Typography>
              </Stack>
              <Chip size="small" label={record.status} color={record.status === 'Hoàn tất' ? 'success' : 'info'} variant="outlined" />
            </Stack>
          )) : (
            <Alert severity="info">Không có bản ghi khớp từ khóa. Hãy thử tên hoặc mã khác.</Alert>
          )}
        </Card>
      )}

      {scenario === 'detail' && (
        <Card sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Biểu mẫu mẫu</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Dùng nút quay lại bên cạnh tiêu đề; thanh Lưu / Hủy ở đáy viewport là footer của AppPageContainer.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Tên hồ sơ" defaultValue="Hồ sơ minh họa" /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Người phụ trách" defaultValue="Nguyễn Văn An" /></Grid>
            <Grid size={12}><TextField fullWidth multiline minRows={3} label="Ghi chú" defaultValue="Nội dung dùng để thử bố cục với footer cố định." /></Grid>
          </Grid>
        </Card>
      )}

      {scenario === 'dashboard' && (
        <Card sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Tổng quan mẫu</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ba thẻ tóm tắt ở trên thanh tab được truyền qua prop content; vùng dưới chứa chi tiết bổ sung.
          </Typography>
          <Grid container spacing={2}>
            {[
              ['Tỷ lệ hoàn tất', '76%'],
              ['Thời gian trung bình', '2,4 ngày'],
              ['Tăng trưởng', '+12%'],
            ].map(([label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 4 }}>
                <Box sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
    </Stack>
  );
}
