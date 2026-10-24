import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import type { ManagedRoute, RouterRowItem } from '../types';

interface RouterTreeRowProps {
  item: RouterRowItem;
  isCollapsed?: boolean;
  existingPaths?: Set<string>;
  onToggleCollapse?: (id: string) => void;
  onAddChild: (item: RouterRowItem) => void;
  onEdit: (item: RouterRowItem) => void;
  onMove: (item: RouterRowItem) => void;
  onMoveSibling: (item: RouterRowItem, offset: -1 | 1) => void;
  onDelete: (item: RouterRowItem) => void;
  onSaveInline?: (id: string, updates: Partial<ManagedRoute>) => boolean | void;
}

export default function RouterTreeRow({
  item,
  isCollapsed = false,
  existingPaths,
  onToggleCollapse,
  onAddChild,
  onEdit,
  onMove,
  onMoveSibling,
  onDelete,
  onSaveInline,
}: RouterTreeRowProps) {
  const hasChildren = Boolean(item.children?.length);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [path, setPath] = useState(item.path.replace(/^\/+/, ''));
  const [info, setInfo] = useState(item.info?.toString() ?? '');
  const [hideInMenu, setHideInMenu] = useState(Boolean(item.hideInMenu));
  const [titleError, setTitleError] = useState('');
  const [pathError, setPathError] = useState('');

  useEffect(() => {
    setTitle(item.title);
    setPath(item.path.replace(/^\/+/, ''));
    setInfo(item.info?.toString() ?? '');
    setHideInMenu(Boolean(item.hideInMenu));
    setTitleError('');
    setPathError('');
  }, [item]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedPath = path.trim().replace(/^\/+/, '');
    let valid = true;

    if (!trimmedTitle) {
      setTitleError('Nhập tiêu đề');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!trimmedPath) {
      setPathError('Nhập đường dẫn');
      valid = false;
    } else {
      const normalizedOldPath = item.path.replace(/^\/+/, '');
      if (trimmedPath !== normalizedOldPath && existingPaths?.has(trimmedPath)) {
        setPathError('Đường dẫn đã tồn tại');
        valid = false;
      } else {
        setPathError('');
      }
    }

    if (!valid) return;

    const parsedInfo = /^\d+$/.test(info.trim()) ? Number(info.trim()) : info.trim() || undefined;

    onSaveInline?.(item.id, {
      title: trimmedTitle,
      path: trimmedPath,
      info: parsedInfo,
      hideInMenu: hideInMenu || undefined,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(item.title);
    setPath(item.path.replace(/^\/+/, ''));
    setInfo(item.info?.toString() ?? '');
    setHideInMenu(Boolean(item.hideInMenu));
    setTitleError('');
    setPathError('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <TableRow
      hover
      onDoubleClick={() => !isEditing && setIsEditing(true)}
      sx={(theme) => ({
        bgcolor: isEditing
          ? alpha(theme.palette.primary.main, 0.05)
          : item.level > 0
          ? alpha(theme.palette.background.neutral, 0.55)
          : 'background.paper',
        '&:last-child td': { borderBottom: 0 },
      })}
    >
      {/* 1. Cấu trúc cây & tiêu đề */}
      <TableCell sx={{ minWidth: 280, px: 1.5, py: 1.25 }}>
        <Stack direction="row" alignItems="center" sx={{ pl: item.level * 2 }}>
          {hasChildren ? (
            <Tooltip title={isCollapsed ? 'Mở rộng tuyến con' : 'Thu gọn tuyến con'}>
              <IconButton
                size="small"
                aria-label={isCollapsed ? `Mở rộng ${item.title}` : `Thu gọn ${item.title}`}
                onClick={() => onToggleCollapse?.(item.id)}
                sx={(theme) => ({
                  p: 0.5,
                  mr: 0.5,
                  color: 'text.secondary',
                  transform: isCollapsed ? 'rotate(-90deg)' : 'none',
                  transition: theme.transitions.create('transform'),
                })}
              >
                <Iconify icon="solar:alt-arrow-down-bold" width={18} />
              </IconButton>
            </Tooltip>
          ) : (
            <Box sx={{ width: 32, flexShrink: 0 }} />
          )}

          {isEditing ? (
            <Stack direction="row" spacing={1} sx={{ flexGrow: 1, minWidth: 0 }}>
              <TextField
                size="small"
                value={title}
                autoFocus
                error={Boolean(titleError)}
                helperText={titleError}
                placeholder="Tiêu đề *"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError('');
                }}
                onKeyDown={handleKeyDown}
                sx={{
                  flexGrow: 1,
                  minWidth: 140,
                  '& .MuiInputBase-root': { height: 32, fontSize: 13, fontWeight: 600, bgcolor: 'background.paper' },
                }}
              />
              <TextField
                size="small"
                value={info}
                placeholder="Badge"
                onChange={(e) => setInfo(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  width: 80,
                  flexShrink: 0,
                  '& .MuiInputBase-root': { height: 32, fontSize: 12, bgcolor: 'background.paper' },
                }}
              />
            </Stack>
          ) : (
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
                <Tooltip title={item.title} enterDelay={600}>
                  <Typography variant="subtitle2" noWrap sx={{ maxWidth: 260 }}>
                    {item.title}
                  </Typography>
                </Tooltip>
                {item.level > 0 && <Chip label={`Cấp ${item.level + 1}`} size="small" sx={{ height: 20 }} />}
                {item.info !== undefined && <Chip label={`Badge: ${item.info}`} size="small" />}
              </Stack>
            </Box>
          )}
        </Stack>
      </TableCell>

      {/* 2. Icon */}
      <TableCell sx={{ width: 180, px: 1.5, py: 1.25 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={item.icon ?? 'solar:route-bold-duotone'} width={20} sx={{ color: 'info.main' }} />
          <Typography variant="caption" color="text.secondary">
            {item.inheritsIcon ? 'Kế thừa từ cha' : 'Khai báo trực tiếp'}
          </Typography>
        </Stack>
      </TableCell>

      {/* 3. Đường dẫn route (Path) */}
      <TableCell sx={{ minWidth: 220, px: 1.5, py: 1.25 }}>
        {isEditing ? (
          <TextField
            size="small"
            value={path}
            error={Boolean(pathError)}
            helperText={pathError}
            placeholder="Đường dẫn *"
            onChange={(e) => {
              setPath(e.target.value);
              setPathError('');
            }}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mr: 0.25, fontFamily: 'monospace' }}>
                    /
                  </Typography>
                ),
              },
            }}
            sx={{
              minWidth: 180,
              '& .MuiInputBase-root': { height: 32, fontSize: 13, fontFamily: 'monospace', bgcolor: 'background.paper' },
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', overflowWrap: 'anywhere' }}>
            /{item.path.replace(/^\/+/, '')}
          </Typography>
        )}
      </TableCell>

      {/* 4. Thuộc tính */}
      <TableCell sx={{ minWidth: 170, px: 1.5, py: 1.25 }}>
        {isEditing ? (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Switch
              size="small"
              checked={hideInMenu}
              onChange={(e) => setHideInMenu(e.target.checked)}
            />
            <Typography variant="caption" color="text.secondary">
              Ẩn menu
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip size="small" color="success" variant="soft" label="Đã cấu hình" />
            {item.hideInMenu && <Chip size="small" variant="outlined" label="Ẩn menu" />}
          </Stack>
        )}
      </TableCell>

      {/* 5. Thao tác */}
      <TableCell align="right" sx={{ width: 220, px: 1.5, py: 1.25 }}>
        {isEditing ? (
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Lưu thay đổi (Enter)">
              <IconButton size="small" color="success" onClick={handleSave}>
                <Iconify icon="solar:check-circle-bold" width={22} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hủy (Esc)">
              <IconButton size="small" onClick={handleCancel} sx={{ color: 'text.secondary' }}>
                <Iconify icon="solar:close-circle-bold" width={22} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end" spacing={0.25}>
            <Tooltip title="Thêm route con">
              <IconButton size="small" aria-label={`Thêm route con cho ${item.title}`} onClick={() => onAddChild(item)}>
                <Iconify icon="solar:add-circle-linear" width={19} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Di chuyển lên">
              <IconButton size="small" aria-label={`Di chuyển ${item.title} lên`} onClick={() => onMoveSibling(item, -1)}>
                <Iconify icon="solar:arrow-up-linear" width={19} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Di chuyển xuống">
              <IconButton size="small" aria-label={`Di chuyển ${item.title} xuống`} onClick={() => onMoveSibling(item, 1)}>
                <Iconify icon="solar:arrow-down-linear" width={19} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chuyển vị trí">
              <IconButton size="small" aria-label={`Chuyển vị trí ${item.title}`} onClick={() => onMove(item)}>
                <Iconify icon="solar:transfer-horizontal-bold-duotone" width={19} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sửa trực tiếp trên dòng">
              <IconButton
                size="small"
                aria-label={`Sửa nhanh ${item.title}`}
                onClick={() => setIsEditing(true)}
                sx={{ color: 'primary.main' }}
              >
                <Iconify icon="solar:pen-2-linear" width={19} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mở hộp thoại đầy đủ">
              <IconButton size="small" aria-label={`Cấu hình đầy đủ ${item.title}`} onClick={() => onEdit(item)}>
                <Iconify icon="solar:settings-minimalistic-linear" width={19} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton size="small" color="error" aria-label={`Xóa ${item.title}`} onClick={() => onDelete(item)}>
                <Iconify icon="solar:trash-bin-trash-linear" width={19} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}
