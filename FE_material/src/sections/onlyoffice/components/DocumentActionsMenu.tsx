import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import { Iconify } from '@/components';
import type { DocumentItem } from '../types/document.types';
import { ACTION_ICONS } from '../constants/document.constants';

export interface DocumentActionsMenuProps {
  document: DocumentItem;
  onEdit: (doc: DocumentItem) => void;
  onView: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
  size?: 'small' | 'medium';
}

export const DocumentActionsMenu: React.FC<DocumentActionsMenuProps> = ({
  document,
  onEdit,
  onView,
  onDownload,
  onDelete,
  size = 'small',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnchorEl(null);
  };

  const handleSelect = (callback: (doc: DocumentItem) => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
    callback(document);
  };

  const isPdf = document.fileType === 'pdf';

  return (
    <>
      <Tooltip title="Tùy chọn">
        <IconButton
          size={size}
          onClick={handleOpen}
          aria-label="Tùy chọn tài liệu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Iconify icon={ACTION_ICONS.menu} width={18} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 160,
            boxShadow: (theme) => theme.customShadows?.dropdown || 3,
          },
        }}
      >
        {!isPdf && (
          <MenuItem onClick={handleSelect(onEdit)}>
            <ListItemIcon>
              <Iconify icon={ACTION_ICONS.edit} width={18} />
            </ListItemIcon>
            <ListItemText primary="Chỉnh sửa" />
          </MenuItem>
        )}

        <MenuItem onClick={handleSelect(onView)}>
          <ListItemIcon>
            <Iconify icon={ACTION_ICONS.view} width={18} />
          </ListItemIcon>
          <ListItemText primary={isPdf ? 'Xem tài liệu' : 'Xem (chỉ đọc)'} />
        </MenuItem>

        <MenuItem onClick={handleSelect(onDownload)}>
          <ListItemIcon>
            <Iconify icon={ACTION_ICONS.download} width={18} />
          </ListItemIcon>
          <ListItemText primary="Tải về" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleSelect(onDelete)} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <Iconify icon={ACTION_ICONS.delete} width={18} />
          </ListItemIcon>
          <ListItemText primary="Xóa tài liệu" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default DocumentActionsMenu;
