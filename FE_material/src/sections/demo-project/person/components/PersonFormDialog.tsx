import { useEffect, useId, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { CustomDialog, Iconify } from '@/components';
import ConfirmDialog from './ConfirmDialog';
import PersonForm from '../PersonForm';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  personId?: string;
  onClose: () => void;
};

export default function PersonFormDialog({ open, personId, onClose }: Props) {
  const formId = useId();
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleRequestClose = () => {
    if (isSubmitting) return;
    if (isDirty) {
      setConfirmOpen(true);
    } else {
      onClose();
    }
  };

  const handleForceClose = () => {
    setConfirmOpen(false);
    setIsDirty(false);
    onClose();
  };

  const handleSuccess = () => {
    setIsDirty(false);
    setIsSubmitting(false);
    onClose();
  };

  useEffect(() => {
    const element = contentRef.current;
    if (!element || !open) return;

    const handleWheel = (event: WheelEvent) => {
      // Tăng tốc độ cuộn cho con lăn chuột rời để đạt độ nhạy nhanh như cuộn trang chính
      if (Math.abs(event.deltaY) >= 40) {
        event.preventDefault();
        element.scrollTop += event.deltaY * 1.5;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [open]);

  return (
    <>
      <CustomDialog
        open={open}
        onClose={(_event, reason) => {
          if (reason === 'backdropClick') return;
          handleRequestClose();
        }}
        onCloseButtonClick={handleRequestClose}
        title={personId ? 'Chỉnh sửa thông tin con người liên quan' : 'Thêm mới thông tin con người liên quan'}
        subtitle="DEMO PROJECT"
        actions={
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
            <Button color="inherit" variant="outlined" onClick={handleRequestClose} disabled={isSubmitting}>
              Đóng
            </Button>
            <LoadingButton
              form={formId}
              type="submit"
              variant="contained"
              loading={isSubmitting}
              startIcon={<Iconify icon="solar:diskette-bold" />}
            >
              Lưu
            </LoadingButton>
          </Stack>
        }
        contentRef={contentRef}
        dividers
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            height: { xs: 'calc(100vh - 32px)', md: '90vh' },
            maxHeight: 'calc(100vh - 48px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            m: { xs: 2, md: 3 },
          },
        }}
      >
        {open && (
          <PersonForm
            personId={personId}
            isDialog
            formId={formId}
            onClose={handleRequestClose}
            onSuccess={handleSuccess}
            onDirtyChange={setIsDirty}
            onSubmittingChange={setIsSubmitting}
          />
        )}
      </CustomDialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Rời khỏi biểu mẫu?"
        message="Bạn có thay đổi chưa được lưu. Nếu đóng biểu mẫu, các thông tin vừa nhập sẽ bị mất. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Rời đi"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleForceClose}
      />
    </>
  );
}
