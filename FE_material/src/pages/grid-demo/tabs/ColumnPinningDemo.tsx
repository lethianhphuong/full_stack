import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { DataTable, type MRT_ColumnDef } from '@/atoms';
import { MOCK_PEOPLE_100, type Person } from '../mock-data';

// ----------------------------------------------------------------------
// Tab 3: Column Pinning & Resizing Demo
// ----------------------------------------------------------------------

export default function ColumnPinningDemo() {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'fullName',
        header: 'Họ và tên',
        size: 200,
        Cell: ({ row }) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={row.original.avatar} sx={{ width: 32, height: 32 }} />
            <Typography variant="subtitle2">
              {row.original.firstName} {row.original.lastName}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
      },
      {
        accessorKey: 'age',
        header: 'Tuổi',
        size: 80,
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
        accessorKey: 'salary',
        header: 'Lương',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(value);
        },
      },
      {
        accessorKey: 'address.city',
        header: 'Thành phố',
        size: 150,
      },
      {
        accessorKey: 'address.state',
        header: 'Miền',
        size: 120,
      },
      {
        accessorKey: 'startDate',
        header: 'Ngày vào',
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue<Date>();
          return new Intl.DateTimeFormat('vi-VN').format(date);
        },
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 130,
        Cell: ({ cell }) => {
          const status = cell.getValue<Person['status']>();
          const config = {
            active: { label: 'Hoạt động', color: 'success' as const },
            inactive: { label: 'Ngừng hoạt động', color: 'error' as const },
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
        <Typography variant="h6">Ghim cột & Thay đổi kích thước</Typography>
        <Typography variant="body2" color="text.secondary">
          Demo ghim cột trái/phải, kéo thay đổi kích thước cột. Click vào header cột &gt; Pin to Left/Right.
        </Typography>
      </Stack>

      <DataTable
        columns={columns}
        data={MOCK_PEOPLE_100}
        enableColumnPinning
        enableColumnResizing
        enableStickyHeader
        height={500}
        initialState={{
          columnPinning: {
            left: ['fullName'],
            right: ['status'],
          },
          pagination: { pageIndex: 0, pageSize: 25 },
        }}
      />
    </Box>
  );
}
