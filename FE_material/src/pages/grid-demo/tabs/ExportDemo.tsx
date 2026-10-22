import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { type MRT_ColumnDef, useMaterialReactTable } from '@/atoms';
import {
  MaterialReactTable,
} from 'material-react-table';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import { MRT_Localization_VI } from '@/atoms/data-table/localization-vi';
import { MOCK_PEOPLE_100, type Person } from '../mock-data';

// ----------------------------------------------------------------------
// Tab 7: Export Demo (CSV)
// ----------------------------------------------------------------------

// CSV Export function
function exportToCSV(data: Person[], filename: string) {
  const headers = ['ID', 'Họ', 'Tên', 'Email', 'Tuổi', 'Phòng ban', 'Chức vụ', 'Lương', 'Thành phố', 'Trạng thái'];
  
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      [
        row.id,
        row.firstName,
        row.lastName,
        row.email,
        row.age,
        row.department,
        row.role,
        row.salary,
        row.address.city,
        row.status,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ExportDemo() {
  const theme = useTheme();

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'firstName',
        header: 'Họ',
        size: 150,
      },
      {
        accessorKey: 'lastName',
        header: 'Tên',
        size: 100,
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
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 120,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: MOCK_PEOPLE_100,
    enableRowSelection: true,
    localization: MRT_Localization_VI as Parameters<typeof useMaterialReactTable>[0]['localization'],
    // Styling
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
      },
    },
    muiTableHeadCellProps: {
      sx: {
        bgcolor: alpha(theme.palette.grey[500], 0.08),
        fontWeight: 600,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: `1px dashed ${theme.palette.divider}`,
      },
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    // Custom top toolbar with export buttons
    renderTopToolbarCustomActions: ({ table }) => (
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:export-bold" />}
          onClick={() => {
            exportToCSV(MOCK_PEOPLE_100, 'nhan-vien-tat-ca');
          }}
        >
          Xuất tất cả
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<Iconify icon="solar:export-bold" />}
          onClick={() => {
            const selectedRows = table.getSelectedRowModel().rows;
            if (selectedRows.length === 0) {
              alert('Vui lòng chọn ít nhất một hàng để xuất');
              return;
            }
            exportToCSV(
              selectedRows.map((row) => row.original),
              'nhan-vien-da-chon'
            );
          }}
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        >
          Xuất đã chọn ({table.getSelectedRowModel().rows.length})
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          startIcon={<Iconify icon="solar:export-bold" />}
          onClick={() => {
            const filteredRows = table.getFilteredRowModel().rows;
            exportToCSV(
              filteredRows.map((row) => row.original),
              'nhan-vien-da-loc'
            );
          }}
        >
          Xuất đã lọc ({table.getFilteredRowModel().rows.length})
        </Button>
      </Stack>
    ),
  });

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h6">Xuất dữ liệu (Export CSV)</Typography>
        <Typography variant="body2" color="text.secondary">
          Demo xuất dữ liệu ra file CSV. Có thể xuất tất cả, xuất theo bộ lọc, hoặc xuất các hàng đã chọn.
        </Typography>
      </Stack>

      <MaterialReactTable table={table} />
    </Box>
  );
}
