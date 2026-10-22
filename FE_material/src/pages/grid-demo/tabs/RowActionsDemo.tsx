import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataTable, type MRT_ColumnDef } from '@/atoms';
import Iconify from '@/components/iconify';
import { MOCK_PEOPLE_50, type Person } from '../mock-data';

// ----------------------------------------------------------------------
// Tab 5: Row Actions Demo (CRUD)
// ----------------------------------------------------------------------

export default function RowActionsDemo() {
  const [data, setData] = useState(MOCK_PEOPLE_50);

  const handleEdit = (person: Person) => {
    alert(`Chỉnh sửa: ${person.firstName} ${person.lastName}`);
  };

  const handleDelete = (person: Person) => {
    if (confirm(`Bạn có chắc muốn xóa "${person.firstName} ${person.lastName}"?`)) {
      setData((prev) => prev.filter((p) => p.id !== person.id));
    }
  };

  const handleView = (person: Person) => {
    alert(`Xem chi tiết:\n\nHọ tên: ${person.firstName} ${person.lastName}\nEmail: ${person.email}\nPhòng ban: ${person.department}\nChức vụ: ${person.role}`);
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'fullName',
        header: 'Họ và tên',
        size: 200,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
      },
      {
        accessorKey: 'department',
        header: 'Phòng ban',
        size: 150,
      },
      {
        accessorKey: 'role',
        header: 'Chức vụ',
        size: 150,
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 130,
        Cell: ({ cell }) => {
          const status = cell.getValue<Person['status']>();
          const config = {
            active: { label: 'Hoạt động', color: 'success' as const },
            inactive: { label: 'Ngừng', color: 'error' as const },
            pending: { label: 'Chờ duyệt', color: 'warning' as const },
          };
          return (
            <Chip
              label={config[status].label}
              color={config[status].color}
              size="small"
              variant="soft"
            />
          );
        },
      },
    ],
    []
  );

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Hành động trên hàng (Row Actions)</Typography>
            <Typography variant="body2" color="text.secondary">
              Demo các nút hành động: Xem, Sửa, Xóa trên mỗi hàng
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => alert('Thêm nhân viên mới')}
          >
            Thêm mới
          </Button>
        </Stack>
      </Stack>

      <DataTable
        columns={columns}
        data={data}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Xem chi tiết">
              <IconButton size="small" onClick={() => handleView(row.original)}>
                <Iconify icon="solar:eye-bold" width={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <IconButton size="small" color="primary" onClick={() => handleEdit(row.original)}>
                <Iconify icon="solar:pen-bold" width={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton size="small" color="error" onClick={() => handleDelete(row.original)}>
                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
      />
    </Box>
  );
}
