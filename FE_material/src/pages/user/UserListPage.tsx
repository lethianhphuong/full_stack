import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { alpha } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { usePreferencesStore } from '@/store';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

// Mock data - In real app, this would come from API
const MOCK_USERS = Array.from({ length: 24 }, (_, index) => ({
  id: `user-${index + 1}`,
  name: [
    'Jaydon Frankie', 'Deja Brady', 'Harrison Stein', 'Reece Chung',
    'Lainey Davidson', 'Cristopher Cardenas', 'Melanie Noble', 'Chase Day',
    'Shawn Manning', 'Soren Durham', 'Cortez Herring', 'Brycen Jimenez',
    'Giana Brandt', 'Aspen Schmitt', 'Colten Aguilar', 'Angelique Morse',
    'Selina Boyer', 'Lawson Bass', 'Ariana Lang', 'Amiah Pruitt',
    'Harold Mcgee', 'Esperanza Mcintyre', 'Mireya Conner', 'Jamie Kline',
  ][index],
  email: [
    'demo@minimals.cc', 'deja.brady@minimals.cc', 'harrison.stein@minimals.cc', 'reece.chung@minimals.cc',
    'lainey.davidson@minimals.cc', 'cristopher.cardenas@minimals.cc', 'melanie.noble@minimals.cc', 'chase.day@minimals.cc',
    'shawn.manning@minimals.cc', 'soren.durham@minimals.cc', 'cortez.herring@minimals.cc', 'brycen.jimenez@minimals.cc',
    'giana.brandt@minimals.cc', 'aspen.schmitt@minimals.cc', 'colten.aguilar@minimals.cc', 'angelique.morse@minimals.cc',
    'selina.boyer@minimals.cc', 'lawson.bass@minimals.cc', 'ariana.lang@minimals.cc', 'amiah.pruitt@minimals.cc',
    'harold.mcgee@minimals.cc', 'esperanza.mcintyre@minimals.cc', 'mireya.conner@minimals.cc', 'jamie.kline@minimals.cc',
  ][index],
  avatar: `https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-${(index % 25) + 1}.webp`,
  phoneNumber: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
  company: ['Acme Inc', 'Globex Corp', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Stark Industries', 'Wayne Enterprises', 'Daily Planet'][index % 8],
  role: ['Admin', 'User', 'Editor', 'Manager', 'Developer', 'Designer', 'Analyst', 'Support'][index % 8],
  status: ['active', 'pending', 'banned', 'rejected'][index % 4] as 'active' | 'pending' | 'banned' | 'rejected',
  isVerified: index % 2 === 0,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

type UserStatus = 'active' | 'pending' | 'banned' | 'rejected';

const STATUS_OPTIONS: { value: UserStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'banned', label: 'Bị cấm' },
  { value: 'rejected', label: 'Từ chối' },
];

// ----------------------------------------------------------------------

function getStatusColor(status: UserStatus): 'success' | 'warning' | 'error' | 'default' {
  const colors: Record<UserStatus, 'success' | 'warning' | 'error' | 'default'> = {
    active: 'success',
    pending: 'warning',
    banned: 'error',
    rejected: 'default',
  };
  return colors[status];
}

// ----------------------------------------------------------------------

export default function UserListPage() {
  const { themeCompact } = usePreferencesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Tên',
        flex: 1,
        minWidth: 200,
        renderCell: (params: GridRenderCellParams) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={params.row.avatar} alt={params.row.name} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="subtitle2" noWrap>
                {params.row.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {params.row.email}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        field: 'phoneNumber',
        headerName: 'Số điện thoại',
        width: 160,
      },
      {
        field: 'company',
        headerName: 'Công ty',
        width: 160,
      },
      {
        field: 'role',
        headerName: 'Vai trò',
        width: 120,
      },
      {
        field: 'isVerified',
        headerName: 'Xác minh',
        width: 100,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams) =>
          params.row.isVerified ? (
            <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} width={20} />
          ) : (
            <Iconify icon="eva:close-circle-fill" sx={{ color: 'text.disabled' }} width={20} />
          ),
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.row.status}
            color={getStatusColor(params.row.status)}
            size="small"
            variant="soft"
            sx={{ textTransform: 'capitalize' }}
          />
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 80,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Chỉnh sửa">
              <IconButton size="small" onClick={() => console.log('Edit', params.row.id)}>
                <Iconify icon="solar:pen-bold" width={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton
                size="small"
                onClick={() => console.log('Delete', params.row.id)}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    []
  );

  return (
    <Container maxWidth={themeCompact ? 'xl' : false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4">Người dùng</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => console.log('Create new user')}
        >
          Thêm mới
        </Button>
      </Stack>

      <Card>
        {/* Filters */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          spacing={2}
          sx={{ p: 2.5 }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { sm: 320 } }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {rowSelectionModel.ids.size > 0 && (
            <Button
              variant="soft"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => console.log('Delete selected:', Array.from(rowSelectionModel.ids))}
            >
              Xóa ({rowSelectionModel.ids.size})
            </Button>
          )}
        </Stack>

        {/* DataGrid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={setRowSelectionModel}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                borderRadius: 0,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
              },
              '& .MuiDataGrid-cell': {
                borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
              },
            }}
          />
        </Box>
      </Card>
    </Container>
  );
}
