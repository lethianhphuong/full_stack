import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataTable, type MRT_ColumnDef } from '@/atoms';
import { MOCK_PEOPLE_100, type Person } from '../mock-data';

// ----------------------------------------------------------------------
// Tab 4: Grouping Demo
// ----------------------------------------------------------------------

export default function GroupingDemo() {
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
        enableGrouping: false, // Không cho phép group theo email
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
        accessorKey: 'address.state',
        header: 'Miền',
        size: 120,
      },
      {
        accessorKey: 'salary',
        header: 'Lương',
        size: 150,
        aggregationFn: 'mean',
        AggregatedCell: ({ cell }) => {
          const value = cell.getValue<number>();
          return (
            <Box sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              TB: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
              }).format(value)}
            </Box>
          );
        },
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(value);
        },
      },
      {
        accessorKey: 'age',
        header: 'Tuổi',
        size: 80,
        aggregationFn: 'mean',
        AggregatedCell: ({ cell }) => (
          <Box sx={{ fontWeight: 'bold', color: 'info.main' }}>
            TB: {Math.round(cell.getValue<number>())}
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h6">Nhóm dữ liệu (Grouping)</Typography>
        <Typography variant="body2" color="text.secondary">
          Kéo thả header cột vào vùng &quot;Drop to Group&quot; hoặc click menu cột &gt; Group by. 
          Cột Lương và Tuổi có tính trung bình (aggregation).
        </Typography>
      </Stack>

      <DataTable
        columns={columns}
        data={MOCK_PEOPLE_100}
        enableGrouping
        enableExpandAll
        enableStickyHeader
        height={500}
        initialState={{
          grouping: ['department'],
          expanded: true,
          pagination: { pageIndex: 0, pageSize: 50 },
        }}
        groupedColumnMode="remove"
      />
    </Box>
  );
}
