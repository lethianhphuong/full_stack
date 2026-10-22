import { useCallback, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { BaseSelect } from '@/atoms';
import type { MRT_ColumnDef } from '@/atoms';
import { AppPageContainer, Iconify, SearchableProTable } from '@/components';
import type { SearchableProTableProps, SearchableProTableQuery, SearchableProTableResult } from '@/components';
import { selectDemoPeople, selectRemoveDemoPerson, useDemoPersonStore } from '@/store';
import { GENDER_OPTIONS, ROLE_OPTIONS } from '../constants';
import type { PersonRecord } from '../types';
import { ConfirmDialog, PersonFormDialog } from '../components';

interface PersonFilters {
  gender: string;
  role: string;
}

const INITIAL_FILTERS: PersonFilters = { gender: '', role: '' };
const GENDER_FILTER_OPTIONS = [{ value: '', label: 'Tất cả' }, ...GENDER_OPTIONS];
const ROLE_FILTER_OPTIONS = [{ value: '', label: 'Tất cả' }, ...ROLE_OPTIONS];
const ADVANCED_SEARCH_FORM = (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
    <BaseSelect name="gender" size="small" label="Giới tính" options={GENDER_FILTER_OPTIONS} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 155 } }} />
    <BaseSelect name="role" size="small" label="Vai trò" options={ROLE_FILTER_OPTIONS} sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 230 } }} />
  </Stack>
);

const getPersonRowId = (person: PersonRecord) => person.id;

const getCurrentAddress = (person: PersonRecord) =>
  [person.addresses.current.street, person.addresses.current.ward, person.addresses.current.province]
    .filter(Boolean)
    .join(', ');

const getColumnValue = (person: PersonRecord, columnId: string): string => {
  switch (columnId) {
    case 'fullName': return person.fullName;
    case 'birthDate': return person.birthDate;
    case 'gender': return person.gender;
    case 'identityNumber': return person.identityNumber;
    case 'phone': return person.phone;
    case 'role': return person.role;
    case 'currentAddress': return getCurrentAddress(person);
    default: return '';
  }
};

const normalizeSearch = (value: string) => value
  .toLocaleLowerCase('vi-VN')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd');

const COLUMNS: MRT_ColumnDef<PersonRecord>[] = [
  { accessorKey: 'fullName', header: 'Họ và tên', size: 180 },
  { accessorKey: 'birthDate', header: 'Ngày sinh', size: 150 },
  { accessorKey: 'gender', header: 'Giới tính', size: 150 },
  { accessorKey: 'identityNumber', header: 'CCCD/CMT', size: 150 },
  { accessorKey: 'phone', header: 'Số điện thoại', size: 150 },
  { accessorKey: 'role', header: 'Vai trò', size: 150, Cell: ({ cell }) => <Chip label={String(cell.getValue())} size="small" color="primary" variant="soft" /> },
  { accessorFn: getCurrentAddress, id: 'currentAddress', header: 'Nơi ở hiện nay', minSize: 200, grow: true },
];

export default function PersonListView() {
  const { enqueueSnackbar } = useSnackbar();
  const people = useDemoPersonStore(selectDemoPeople);
  const removePerson = useDemoPersonStore(selectRemoveDemoPerson);
  const [personToDelete, setPersonToDelete] = useState<PersonRecord | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const request = useCallback(async ({
    pageIndex,
    pageSize,
    keywords,
    advancedFilters,
    sorting,
    columnFilters,
  }: SearchableProTableQuery<PersonFilters>): Promise<SearchableProTableResult<PersonRecord>> => {
    const normalizedKeywords = keywords.map(normalizeSearch).filter(Boolean);
    const filtered = people.filter((person) => {
      if (advancedFilters?.gender && person.gender !== advancedFilters.gender) return false;
      if (advancedFilters?.role && person.role !== advancedFilters.role) return false;

      const searchableText = normalizeSearch([
        person.fullName,
        person.identityNumber,
        person.phone,
        getCurrentAddress(person),
      ].join(' '));
      if (!normalizedKeywords.some((keyword) => searchableText.includes(keyword)) && normalizedKeywords.length > 0) return false;

      return columnFilters.every(({ id, value }) =>
        normalizeSearch(getColumnValue(person, id)).includes(normalizeSearch(String(value ?? ''))));
    });

    if (sorting.length > 0) {
      filtered.sort((left, right) => {
        for (const { id, desc } of sorting) {
          const comparison = getColumnValue(left, id).localeCompare(getColumnValue(right, id), 'vi-VN', { numeric: true });
          if (comparison !== 0) return desc ? -comparison : comparison;
        }
        return 0;
      });
    }

    return {
      data: filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
      total: filtered.length,
    };
  }, [people]);


  const handleOpenCreate = useCallback(() => {
    setSelectedPersonId(null);
    setFormDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((id: string) => {
    setSelectedPersonId(id);
    setFormDialogOpen(true);
  }, []);

  const handleCloseFormDialog = useCallback(() => {
    setFormDialogOpen(false);
    setSelectedPersonId(null);
  }, []);

  const toolbarActions = useMemo(() => (
    <Button
      type="button"
      variant="contained"
      startIcon={<Iconify icon="solar:add-circle-bold" width={18} />}
      onClick={handleOpenCreate}
    >
      Thêm mới
    </Button>
  ), [handleOpenCreate]);

  const tableProps = useMemo<NonNullable<SearchableProTableProps<PersonRecord, PersonFilters>['tableProps']>>(() => ({
    enableTopToolbar: false,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableColumnPinning: true,
    enableColumnResizing: true,
    initialState: { columnPinning: { right: ['mrt-row-actions'] } },
    renderRowActions: ({ row }) => (
      <Stack direction="row">
        <Tooltip title="Sửa">
          <IconButton size="small" aria-label={`Sửa ${row.original.fullName}`} onClick={() => handleOpenEdit(row.original.id)}>
            <Iconify icon="solar:pen-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa">
          <IconButton size="small" color="error" aria-label={`Xóa ${row.original.fullName}`} onClick={() => setPersonToDelete(row.original)}>
            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }), [handleOpenEdit]);

  return (
    <AppPageContainer hideTitle={true} maxWidth={false}>
      <SearchableProTable<PersonRecord, PersonFilters>
        columns={COLUMNS}
        request={request}
        getRowId={getPersonRowId}
        defaultPageSize={10}
        showSTT
        quickSearchPlaceholder="Tìm kiếm nhanh họ tên, số CCCD, SĐT..."
        initialAdvancedFilters={INITIAL_FILTERS}
        toolbarActions={toolbarActions}
        advancedSearchForm={ADVANCED_SEARCH_FORM}
        emptyMessage="Chưa có dữ liệu Con Người"
        tableProps={tableProps}
      />
      <ConfirmDialog
        open={!!personToDelete}
        title="Xóa Con Người?"
        message={`Xóa “${personToDelete?.fullName ?? ''}” khỏi dữ liệu demo?`}
        confirmLabel="Xóa"
        onCancel={() => setPersonToDelete(null)}
        onConfirm={() => {
          if (personToDelete) {
            removePerson(personToDelete.id);
            enqueueSnackbar(`Đã xóa ${personToDelete.fullName}`, { variant: 'info' });
          }
          setPersonToDelete(null);
        }}
      />
      <PersonFormDialog
        open={formDialogOpen}
        personId={selectedPersonId ?? undefined}
        onClose={handleCloseFormDialog}
      />
    </AppPageContainer>
  );
}
