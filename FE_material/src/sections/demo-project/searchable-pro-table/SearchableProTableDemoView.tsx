import { useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import type { MRT_ColumnDef } from 'material-react-table';
import { BaseSelect } from '@/atoms';
import { AppPageContainer, Iconify, SearchableProTable } from '@/components';
import type { SearchableProTableQuery, SearchableProTableRef, SearchableProTableResult } from '@/components';

interface DemoPerson {
  id: string;
  name: string;
  role: string;
  city: string;
}

type DemoFilters = Record<'role' | 'city', string>;

const INITIAL_FILTERS: DemoFilters = { role: '', city: '' };
const ROLES = ['Quản trị', 'Biên tập', 'Người xem'];
const CITIES = ['Hà Nội', 'Đà Nẵng', 'TP. Hồ Chí Minh'];
const ROLE_FILTER_OPTIONS = [{ value: '', label: 'Tất cả' }, ...ROLES.map((role) => ({ value: role, label: role }))];
const CITY_FILTER_OPTIONS = [{ value: '', label: 'Tất cả' }, ...CITIES.map((city) => ({ value: city, label: city }))];
const PEOPLE: DemoPerson[] = Array.from({ length: 35 }, (_, index) => ({
  id: `person-${index + 1}`,
  name: `Người dùng ${String(index + 1).padStart(2, '0')}`,
  role: ROLES[index % ROLES.length],
  city: CITIES[Math.floor(index / ROLES.length) % CITIES.length],
}));

const COLUMNS: MRT_ColumnDef<DemoPerson>[] = [
  { accessorKey: 'name', header: 'Họ và tên' },
  { accessorKey: 'role', header: 'Vai trò' },
  { accessorKey: 'city', header: 'Thành phố' },
];

function matchesText(value: string, query: string) {
  return value.toLocaleLowerCase('vi-VN').includes(query.toLocaleLowerCase('vi-VN'));
}

export default function SearchableProTableDemoView() {
  const tableRef = useRef<SearchableProTableRef<DemoPerson, DemoFilters>>(null);
  const [simulateError, setSimulateError] = useState(false);
  const [selectionMessage, setSelectionMessage] = useState('Chưa chọn bản ghi nào.');

  const request = useCallback(async ({ pageIndex, pageSize, keywords, advancedFilters, sorting, columnFilters, signal }: SearchableProTableQuery<DemoFilters>): Promise<SearchableProTableResult<DemoPerson>> => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
    if (simulateError) throw new Error('Lỗi giả lập: không thể tải dữ liệu.');

    const filtered = PEOPLE.filter((person) => {
      const quickMatch = keywords.length === 0 || keywords.some((keyword) =>
        [person.name, person.role, person.city].some((value) => matchesText(value, keyword)));
      const advancedMatch = (!advancedFilters?.role || person.role === advancedFilters.role)
        && (!advancedFilters?.city || person.city === advancedFilters.city);
      const columnMatch = columnFilters.every((filter) => matchesText(String(person[filter.id as keyof DemoPerson] ?? ''), String(filter.value ?? '')));
      return quickMatch && advancedMatch && columnMatch;
    });

    if (sorting.length > 0) {
      const [{ id, desc }] = sorting;
      filtered.sort((first, second) => {
        const comparison = String(first[id as keyof DemoPerson] ?? '').localeCompare(String(second[id as keyof DemoPerson] ?? ''), 'vi-VN');
        return desc ? -comparison : comparison;
      });
    }

    return { data: filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), total: filtered.length, success: true };
  }, [simulateError]);

  return (
    <AppPageContainer hideTitle={true} maxWidth={false}>
      <Stack
        spacing={1.5}
        sx={{
          flex: 1,
          minHeight: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pb: 0.5,
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} flexWrap="wrap" gap={1} sx={{ flexShrink: 0 }}>
          <Button variant="outlined" startIcon={<Iconify icon="solar:restart-bold" width={18} />} onClick={() => tableRef.current?.reload()}>Ref: reload()</Button>
          <Button variant="outlined" onClick={() => tableRef.current?.resetPage()}>Ref: resetPage()</Button>
          <Button variant="outlined" onClick={() => {
            const selection = tableRef.current?.getSelected();
            setSelectionMessage(selection?.rows.length ? `Đã chọn ${selection.rows.length} bản ghi: ${selection.rows.map((row) => row.name).join(', ')}` : 'Chưa chọn bản ghi nào.');
          }}>Ref: getSelected()</Button>
          <Button variant="outlined" onClick={() => {
            const adv = tableRef.current?.getAdvancedFilters();
            setSelectionMessage(adv ? `Ref getAdvancedFilters(): ${JSON.stringify(adv)}` : 'Chưa áp dụng bộ lọc nâng cao nào.');
          }}>Ref: getAdvancedFilters()</Button>
          <Button variant="outlined" onClick={() => {
            const draft = tableRef.current?.getAdvancedDraft();
            setSelectionMessage(`Ref getAdvancedDraft(): ${JSON.stringify(draft ?? {})}`);
          }}>Ref: getAdvancedDraft()</Button>
          <Button color="inherit" onClick={() => { tableRef.current?.clearSelection(); setSelectionMessage('Đã xóa lựa chọn.'); }}>Ref: clearSelection()</Button>
          <FormControlLabel control={<Switch checked={simulateError} onChange={(event) => setSimulateError(event.target.checked)} />} label="Giả lập lỗi request" />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>{selectionMessage}</Typography>
        <Box
          sx={{
            minWidth: 0,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <SearchableProTable<DemoPerson, DemoFilters>
            ref={tableRef}
            columns={COLUMNS}
            request={request}
            getRowId={(row) => row.id}
            initialAdvancedFilters={INITIAL_FILTERS}
            onAdvancedSearch={(values) => ({
              role: String(values.role ?? '').trim(),
              city: String(values.city ?? '').trim(),
            })}
            advancedSearchForm={(
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <BaseSelect name="role" size="small" label="Vai trò" options={ROLE_FILTER_OPTIONS} />
                <BaseSelect name="city" size="small" label="Thành phố" options={CITY_FILTER_OPTIONS} />
              </Stack>
            )}
            tableProps={{ enableRowSelection: true, enableColumnFilters: true, enableColumnResizing: true }}
          />
        </Box>
      </Stack>
    </AppPageContainer>
  );
}
