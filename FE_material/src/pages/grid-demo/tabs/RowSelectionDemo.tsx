import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { DataTable, type MRT_ColumnDef } from '@/atoms';
import type { MRT_RowSelectionState } from 'material-react-table';
import Iconify from '@/components/iconify';
import { MOCK_PEOPLE_50, type Person } from '../mock-data';

// ----------------------------------------------------------------------
// Tab 2: Row Selection Demo
// ----------------------------------------------------------------------

export default function RowSelectionDemo() {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const selectedCount = Object.keys(rowSelection).filter((key) => rowSelection[key]).length;

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Họ',
        size: 150,
        Cell: ({ row }) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={row.original.avatar} alt={row.original.firstName} sx={{ width: 36, height: 36 }} />
            <Box>
              <Typography variant="subtitle2">
                {row.original.firstName} {row.original.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.email}
              </Typography>
            </Box>
          </Stack>
        ),
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
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 120,
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

  const handleDeleteSelected = () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);
    console.log('Deleting:', selectedIds);
    alert(`Xóa ${selectedIds.length} nhân viên đã chọn`);
    setRowSelection({});
  };

  const handleExportSelected = () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);
    console.log('Exporting:', selectedIds);
    alert(`Xuất ${selectedIds.length} nhân viên đã chọn`);
  };

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h6">Chọn hàng (Row Selection)</Typography>
        <Typography variant="body2" color="text.secondary">
          Demo checkbox để chọn một hoặc nhiều hàng, với toolbar hiển thị số hàng đã chọn
        </Typography>
      </Stack>

      {selectedCount > 0 && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            label={`${selectedCount} đã chọn`}
            color="primary"
            onDelete={() => setRowSelection({})}
          />
          <Button
            variant="soft"
            color="error"
            size="small"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={handleDeleteSelected}
          >
            Xóa đã chọn
          </Button>
          <Button
            variant="soft"
            color="info"
            size="small"
            startIcon={<Iconify icon="solar:export-bold" />}
            onClick={handleExportSelected}
          >
            Xuất đã chọn
          </Button>
        </Stack>
      )}

      <DataTable
        columns={columns}
        data={MOCK_PEOPLE_50}
        enableRowSelection
        enableSelectAll
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        getRowId={(row) => row.id}
        positionToolbarAlertBanner="none"
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
      />
    </Box>
  );
}
