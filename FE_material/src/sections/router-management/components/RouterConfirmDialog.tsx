import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CustomDialog } from '@/components';

type Props = { open: boolean; title: string; message: string; confirmLabel: string; color?: 'error' | 'warning'; onClose: () => void; onConfirm: () => void };

export default function RouterConfirmDialog({ open, title, message, confirmLabel, color = 'error', onClose, onConfirm }: Props) {
  return <CustomDialog open={open} onClose={onClose} title={title} actions={<><Button onClick={onClose}>Hủy</Button><Button color={color} variant="contained" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button></>}><Typography variant="body2" color="text.secondary">{message}</Typography></CustomDialog>;
}
