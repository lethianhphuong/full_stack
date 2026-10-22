import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import { alpha, useTheme } from '@mui/material/styles';
import { CustomDialog, Iconify } from '@/components';
import type { DocumentItem } from '../types/document.types';
import { ACTION_ICONS } from '../constants/document.constants';

export interface DeleteDocumentDialogProps {
  open: boolean;
  document: DocumentItem | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = ({
  open,
  document: doc,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();

  return (
    <CustomDialog
      open={open && Boolean(doc)}
      onClose={() => {
        if (!loading) onClose();
      }}
      title="Xác nhận xóa tài liệu"
      titleIcon={
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.error.main, 0.12),
            color: 'error.main',
          }}
        >
          <Iconify icon={ACTION_ICONS.delete} width={22} />
        </Box>
      }
      actions={
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Iconify icon={ACTION_ICONS.delete} width={18} />
              )
            }
          >
            {loading ? 'Đang xóa...' : 'Xóa tài liệu'}
          </Button>
        </Stack>
      }
    >
      <DialogContentText sx={{ color: 'text.secondary', fontSize: 15 }}>
        Bạn có chắc chắn muốn xóa tài liệu{' '}
        <Box component="strong" sx={{ color: 'text.primary' }}>
          "{doc?.title}"
        </Box>{' '}
        không? Nội dung tệp nhị phân trong MySQL sẽ bị xóa vĩnh viễn và không thể khôi phục.
      </DialogContentText>
    </CustomDialog>
  );
};

export default DeleteDocumentDialog;
