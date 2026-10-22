import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BaseSelect, BaseTextField, CustomDialog, FormProvider } from '@/components';
import { DEFAULT_RELATION, GENDER_OPTIONS, RELATION_OPTIONS } from '../constants';
import { relationSchema } from '../schemas';
import type { RelationInput } from '../types';

type Props = { open: boolean; initialValue?: RelationInput; onClose: () => void; onSave: (values: RelationInput) => void };

export default function RelationshipDialog({ open, initialValue, onClose, onSave }: Props) {
  const formId = useId();
  const methods = useForm<RelationInput>({ resolver: yupResolver(relationSchema), defaultValues: DEFAULT_RELATION });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;
  useEffect(() => { if (open) reset(initialValue ?? DEFAULT_RELATION); }, [initialValue, open, reset]);
  const close = () => { reset(DEFAULT_RELATION); onClose(); };

  return (
    <CustomDialog
      open={open}
      onClose={close}
      title={initialValue ? 'Chỉnh sửa mối quan hệ' : 'Thêm mối quan hệ'}
      fullWidth
      maxWidth="md"
      dividers
      actions={
        <>
          <Button onClick={close} disabled={isSubmitting}>Đóng</Button>
          <Button form={formId} type="submit" variant="contained" loading={isSubmitting}>Lưu</Button>
        </>
      }
    >
      <FormProvider id={formId} methods={methods} onSubmit={handleSubmit((values) => { onSave(values); close(); })}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="fullName" label="Họ tên *" /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><BaseTextField name="birthYear" label="Năm sinh" inputProps={{ inputMode: 'numeric', maxLength: 4 }} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="gender" label="Giới tính" options={GENDER_OPTIONS} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="identityNumber" label="CCCD/CMT" inputProps={{ inputMode: 'numeric', maxLength: 12 }} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BaseSelect name="relation" label="Quan hệ *" options={RELATION_OPTIONS} /></Grid>
          <Grid size={{ xs: 12 }}><BaseTextField name="currentAddress" label="Nơi ở hiện nay" /></Grid>
        </Grid>
      </FormProvider>
    </CustomDialog>
  );
}
