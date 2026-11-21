import React, { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import type { SubheaderSection } from '../types';

interface RouterSubheaderBannerProps {
  section: SubheaderSection;
  colSpan?: number;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isCollapsed?: boolean;
  existingTitles?: string[];
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRename?: (oldTitle: string, newTitle: string) => boolean | void;
  onDelete?: (sectionTitle: string) => void;
  onToggleCollapse?: () => void;
}

export default React.memo(function RouterSubheaderBanner({
  section,
  colSpan = 8,
  canMoveUp = false,
  canMoveDown = false,
  isCollapsed = false,
  existingTitles = [],
  onMoveUp,
  onMoveDown,
  onRename,
  onDelete,
  onToggleCollapse,
}: RouterSubheaderBannerProps) {
  if (!section.title) {
    return null;
  }

  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(section.title);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(section.title);
    setError('');
    setIsEditing(false);
  }, [section.title]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Nhập tên nhóm');
      return;
    }
    const isDuplicate = existingTitles.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase() && t.toLowerCase() !== section.title.toLowerCase()
    );
    if (isDuplicate) {
      setError('Tên nhóm đã tồn tại');
      return;
    }
    if (trimmed !== section.title) {
      const result = onRename?.(section.title, trimmed);
      if (result === false) {
        setError('Không thể đổi tên nhóm');
        return;
      }
    }
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setName(section.title);
    setError('');
    setIsEditing(false);
  };

  return (
    <TableRow
      sx={{
        backgroundColor: alpha(theme.palette.success.main, 0.08),
        borderTop: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
        borderBottom: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
      }}
    >
      <TableCell colSpan={colSpan} sx={{ py: 1.25, px: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          {isEditing ? (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 260, maxWidth: 440 }}>
              <Iconify
                icon="solar:bookmark-opened-bold"
                width={18}
                sx={{ color: 'success.main', flexShrink: 0 }}
              />
              <TextField
                size="small"
                value={name}
                autoFocus
                error={Boolean(error)}
                helperText={error}
                placeholder="Tên nhóm mới..."
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancel();
                  }
                }}
                sx={{
                  flexGrow: 1,
                  '& .MuiInputBase-root': {
                    height: 32,
                    fontSize: 13,
                    fontWeight: 600,
                    bgcolor: 'background.paper',
                  },
                }}
              />
              <Tooltip title="Lưu (Enter)">
                <IconButton size="small" color="success" onClick={handleSave} sx={{ p: 0.5 }}>
                  <Iconify icon="solar:check-circle-bold" width={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Hủy (Esc)">
                <IconButton size="small" onClick={handleCancel} sx={{ p: 0.5, color: 'text.secondary' }}>
                  <Iconify icon="solar:close-circle-bold" width={20} />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              {onToggleCollapse && (
                <Tooltip title={isCollapsed ? 'Mở rộng nhóm' : 'Thu gọn nhóm'}>
                  <IconButton
                    size="small"
                    onClick={onToggleCollapse}
                    aria-label={isCollapsed ? `Mở rộng nhóm ${section.title}` : `Thu gọn nhóm ${section.title}`}
                    sx={{
                      p: 0.25,
                      color: 'success.dark',
                      '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.12) },
                    }}
                  >
                    <Iconify
                      icon={isCollapsed ? 'solar:alt-arrow-right-bold' : 'solar:alt-arrow-down-bold'}
                      width={18}
                    />
                  </IconButton>
                </Tooltip>
              )}
              <Iconify
                icon="solar:bookmark-opened-bold"
                width={18}
                sx={{ color: 'success.main', flexShrink: 0 }}
              />
              <Typography
                variant="subtitle2"
                onClick={onToggleCollapse}
                sx={{
                  fontWeight: 700,
                  color: 'success.dark',
                  fontSize: 12.5,
                  letterSpacing: 0.5,
                  cursor: onToggleCollapse ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
              >
                SUBHEADER: {section.title}
              </Typography>
              <Tooltip title="Sửa tên nhóm">
                <IconButton
                  size="small"
                  onClick={() => {
                    setName(section.title);
                    setError('');
                    setIsEditing(true);
                  }}
                  aria-label={`Sửa tên nhóm ${section.title}`}
                  sx={{
                    p: 0.5,
                    color: 'text.secondary',
                    opacity: 0.75,
                    '&:hover': { opacity: 1, color: 'success.dark', bgcolor: alpha(theme.palette.success.main, 0.12) },
                  }}
                >
                  <Iconify icon="solar:pen-2-linear" width={15} />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Chip
              label={`${section.routeCount} route`}
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 500,
                backgroundColor: alpha(theme.palette.grey[500], 0.12),
                color: 'text.secondary',
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
            <Tooltip title="Di chuyển nhóm lên">
              <span>
                <IconButton
                  size="small"
                  disabled={!canMoveUp}
                  onClick={onMoveUp}
                  aria-label={`Di chuyển nhóm ${section.title} lên`}
                  sx={{ p: 0.5, color: 'text.secondary' }}
                >
                  <Iconify icon="solar:arrow-up-linear" width={17} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Di chuyển nhóm xuống">
              <span>
                <IconButton
                  size="small"
                  disabled={!canMoveDown}
                  onClick={onMoveDown}
                  aria-label={`Di chuyển nhóm ${section.title} xuống`}
                  sx={{ p: 0.5, color: 'text.secondary' }}
                >
                  <Iconify icon="solar:arrow-down-linear" width={17} />
                </IconButton>
              </span>
            </Tooltip>
            {onDelete && (
              <Tooltip title="Xóa nhóm menu">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(section.title)}
                  aria-label={`Xóa nhóm ${section.title}`}
                  sx={{
                    p: 0.5,
                    opacity: 0.8,
                    '&:hover': {
                      opacity: 1,
                      bgcolor: alpha(theme.palette.error.main, 0.12),
                    },
                  }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" width={17} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </TableCell>
    </TableRow>
  );
});
