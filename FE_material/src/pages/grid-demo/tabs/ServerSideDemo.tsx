import { useMemo, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { DataTable, type MRT_ColumnDef } from '@/atoms';
import type { MRT_PaginationState, MRT_SortingState, MRT_ColumnFiltersState } from 'material-react-table';
import { generateMockPeople, type Person } from '../mock-data';

// ----------------------------------------------------------------------
// Tab 6: Server-Side Demo (Simulated)
// ----------------------------------------------------------------------

// Simulate API call
async function fetchPeopleFromServer(options: {
  pageIndex: number;
  pageSize: number;
  sorting: MRT_SortingState;
  filters: MRT_ColumnFiltersState;
  globalFilter: string;
}): Promise<{ data: Person[]; totalRowCount: number }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate "server" data
  let allData = generateMockPeople(500);

  // Apply global filter
  if (options.globalFilter) {
    const search = options.globalFilter.toLowerCase();
    allData = allData.filter(
      (person) =>
        person.firstName.toLowerCase().includes(search) ||
        person.lastName.toLowerCase().includes(search) ||
        person.email.toLowerCase().includes(search) ||
        person.department.toLowerCase().includes(search)
    );
  }

  // Apply column filters
  options.filters.forEach((filter) => {
    if (filter.value) {
      allData = allData.filter((person) => {
        const value = (person as Record<string, unknown>)[filter.id];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(String(filter.value).toLowerCase());
        }
        return value === filter.value;
      });
    }
  });

  // Apply sorting
  if (options.sorting.length > 0) {
    const { id, desc } = options.sorting[0];
    allData.sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[id];
      const bValue = (b as Record<string, unknown>)[id];
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      return (aValue < bValue ? -1 : 1) * (desc ? -1 : 1);
    });
  }

  const totalRowCount = allData.length;
  const start = options.pageIndex * options.pageSize;
  const data = allData.slice(start, start + options.pageSize);

  return { data, totalRowCount };
}

export default function ServerSideDemo() {
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    try {
      const result = await fetchPeopleFromServer({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        filters: columnFilters,
        globalFilter,
      });

      setData(result.data);
      setRowCount(result.totalRowCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [pagination, sorting, columnFilters, globalFilter, data.length]);

  // Fetch on mount and when dependencies change
  useMemo(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters, globalFilter]);

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
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
        enableColumnFilter: false,
        Cell: ({ cell }) =>
          new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(cell.getValue<number>()),
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
        <Typography variant="h6">Server-Side (Giả lập API)</Typography>
        <Typography variant="body2" color="text.secondary">
          Demo phân trang, sắp xếp, lọc phía server. Tổng cộng 500 bản ghi, mỗi lần chỉ tải về {pagination.pageSize} bản ghi.
          {isRefetching && (
            <CircularProgress size={16} sx={{ ml: 1, verticalAlign: 'middle' }} />
          )}
        </Typography>
      </Stack>

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        // Server-side options
        manualPagination
        manualSorting
        manualFiltering
        rowCount={rowCount}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        state={{
          pagination,
          sorting,
          columnFilters,
          globalFilter,
          isLoading,
          showProgressBars: isRefetching,
        }}
        initialState={{
          showColumnFilters: true,
        }}
      />
    </Box>
  );
}
