import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import type { RouterRowItem } from '../types';

interface RouterTreeRowProps {
  item: RouterRowItem;
  isCollapsed?: boolean;
  onToggleCollapse?: (id: string) => void;
  onAddChild: (item: RouterRowItem) => void;
  onEdit: (item: RouterRowItem) => void;
  onMove: (item: RouterRowItem) => void;
  onMoveSibling: (item: RouterRowItem, offset: -1 | 1) => void;
  onDelete: (item: RouterRowItem) => void;
}

export default function RouterTreeRow({ item, isCollapsed = false, onToggleCollapse, onAddChild, onEdit, onMove, onMoveSibling, onDelete }: RouterTreeRowProps) {
  const hasChildren = Boolean(item.children?.length);

  return (
    <TableRow hover sx={(theme) => ({ bgcolor: item.level > 0 ? alpha(theme.palette.background.neutral, 0.55) : 'background.paper', '&:last-child td': { borderBottom: 0 } })}>
      <TableCell sx={{ minWidth: 280, px: 1.5, py: 1.25 }}>
        <Stack direction="row" alignItems="flex-start" sx={{ pl: item.level * 2 }}>
          {hasChildren ? (
            <Tooltip title={isCollapsed ? 'Mở rộng tuyến con' : 'Thu gọn tuyến con'}>
              <IconButton size="small" aria-label={isCollapsed ? `Mở rộng ${item.title}` : `Thu gọn ${item.title}`} onClick={() => onToggleCollapse?.(item.id)} sx={(theme) => ({ p: 0.5, mr: 0.5, color: 'text.secondary', transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: theme.transitions.create('transform') })}>
                <Iconify icon="solar:alt-arrow-down-bold" width={18} />
              </IconButton>
            </Tooltip>
          ) : <Box sx={{ width: 32, flexShrink: 0 }} />}
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
              <Tooltip title={item.title} enterDelay={600}><Typography variant="subtitle2" noWrap sx={{ maxWidth: 260 }}>{item.title}</Typography></Tooltip>
              {item.level > 0 && <Chip label={`Cấp ${item.level + 1}`} size="small" sx={{ height: 20 }} />}
              {item.info !== undefined && <Chip label={`Badge: ${item.info}`} size="small" />}
            </Stack>
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={{ width: 180, px: 1.5, py: 1.25 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={item.icon ?? 'solar:route-bold-duotone'} width={20} sx={{ color: 'info.main' }} />
          <Typography variant="caption" color="text.secondary">{item.inheritsIcon ? 'Kế thừa từ cha' : 'Khai báo trực tiếp'}</Typography>
        </Stack>
      </TableCell>
      <TableCell sx={{ minWidth: 220, px: 1.5, py: 1.25 }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', overflowWrap: 'anywhere' }}>/{item.path.replace(/^\/+/, '')}</Typography>
      </TableCell>
      <TableCell sx={{ minWidth: 170, px: 1.5, py: 1.25 }}>
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
          <Chip size="small" color="success" variant="soft" label="Đã cấu hình" />
          {item.hideInMenu && <Chip size="small" variant="outlined" label="Ẩn menu" />}
        </Stack>
      </TableCell>
      <TableCell align="right" sx={{ width: 210, px: 1.5, py: 1.25 }}>
        <Stack direction="row" justifyContent="flex-end" spacing={0.25}>
          <Tooltip title="Thêm route con"><IconButton size="small" aria-label={`Thêm route con cho ${item.title}`} onClick={() => onAddChild(item)}><Iconify icon="solar:add-circle-linear" width={19} /></IconButton></Tooltip>
          <Tooltip title="Di chuyển lên"><IconButton size="small" aria-label={`Di chuyển ${item.title} lên`} onClick={() => onMoveSibling(item, -1)}><Iconify icon="solar:arrow-up-linear" width={19} /></IconButton></Tooltip>
          <Tooltip title="Di chuyển xuống"><IconButton size="small" aria-label={`Di chuyển ${item.title} xuống`} onClick={() => onMoveSibling(item, 1)}><Iconify icon="solar:arrow-down-linear" width={19} /></IconButton></Tooltip>
          <Tooltip title="Chuyển vị trí"><IconButton size="small" aria-label={`Chuyển vị trí ${item.title}`} onClick={() => onMove(item)}><Iconify icon="solar:transfer-horizontal-bold-duotone" width={19} /></IconButton></Tooltip>
          <Tooltip title="Chỉnh sửa"><IconButton size="small" aria-label={`Chỉnh sửa ${item.title}`} onClick={() => onEdit(item)}><Iconify icon="solar:pen-2-linear" width={19} /></IconButton></Tooltip>
          <Tooltip title="Xóa"><IconButton size="small" color="error" aria-label={`Xóa ${item.title}`} onClick={() => onDelete(item)}><Iconify icon="solar:trash-bin-trash-linear" width={19} /></IconButton></Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
