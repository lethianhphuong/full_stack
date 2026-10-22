import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import { CustomDialog } from '@/components';

type Props = { open: boolean; title: string; message: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void };

export default function ConfirmDialog({ open, title, message, confirmLabel, onCancel, onConfirm }: Props) {
  return (
    <CustomDialog
      open={open}
      title={title}
      onClose={onCancel}
      actions={
        <>
          <Button onClick={onCancel}>Hủy</Button>
          <Button color="error" variant="contained" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <DialogContentText>{message}</DialogContentText>
    </CustomDialog>
  );
}
