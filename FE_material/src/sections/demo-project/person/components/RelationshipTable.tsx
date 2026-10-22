import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { DataTable, Iconify } from '@/components';
import type { MRT_ColumnDef } from '@/components';
import type { Relation } from '../types';

type Props = { rows: Relation[]; onEdit: (row: Relation) => void; onDelete: (row: Relation) => void };
const COLUMNS: MRT_ColumnDef<Relation>[] = [
  { id: 'number', header: 'TT', size: 60, Cell: ({ row }) => row.index + 1 },
  { accessorKey: 'fullName', header: 'Họ tên' }, { accessorKey: 'birthYear', header: 'Năm sinh', size: 95 },
  { accessorKey: 'gender', header: 'Giới tính', size: 95 }, { accessorKey: 'identityNumber', header: 'CCCD/CMT' },
  { accessorKey: 'relation', header: 'Quan hệ' }, { accessorKey: 'currentAddress', header: 'Nơi ở hiện nay' },
];

export default function RelationshipTable({ rows, onEdit, onDelete }: Props) {
  return <DataTable columns={COLUMNS} data={rows} emptyMessage="Chưa có mối quan hệ nào" enableRowActions positionActionsColumn="last" enableTopToolbar={false} enableBottomToolbar={false} enablePagination={false} enableColumnFilters={false} enableGlobalFilter={false} renderRowActions={({ row }) => <Stack direction="row"><Tooltip title="Sửa"><IconButton size="small" aria-label={`Sửa ${row.original.fullName}`} onClick={() => onEdit(row.original)}><Iconify icon="solar:pen-bold" width={18} /></IconButton></Tooltip><Tooltip title="Xóa"><IconButton size="small" color="error" aria-label={`Xóa ${row.original.fullName}`} onClick={() => onDelete(row.original)}><Iconify icon="solar:trash-bin-trash-bold" width={18} /></IconButton></Tooltip></Stack>} />;
}
