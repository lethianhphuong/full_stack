import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataTable, type MRT_ColumnDef } from '@/atoms';
import { MOCK_PEOPLE_1000, type Person } from '../mock-data';

// ----------------------------------------------------------------------
// Tab 8: Virtualization Demo (1000 rows)
// ----------------------------------------------------------------------

export default function VirtualizationDemo() {
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
        Cell: ({ cell }) =>
          new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(cell.getValue<number>()),
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
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 120,
      },
    ],
    []
  );

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h6">Virtualization (1000 hàng)</Typography>
        <Typography variant="body2" color="text.secondary">
          Demo render 1000 hàng với virtualization. Chỉ render các hàng trong viewport để tối ưu performance.
          Scroll để xem tất cả dữ liệu.
        </Typography>
      </Stack>

      <DataTable
        columns={columns}
        data={MOCK_PEOPLE_1000}
        enableRowVirtualization
        enableColumnVirtualization
        enablePagination={false}
        enableStickyHeader
        height={600}
        rowVirtualizerOptions={{ overscan: 10 }}
        columnVirtualizerOptions={{ overscan: 3 }}
      />
    </Box>
  );
}
