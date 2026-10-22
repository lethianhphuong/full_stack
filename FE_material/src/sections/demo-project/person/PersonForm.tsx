import { useEffect, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider, Iconify } from '@/components';
import { PATHS } from '@/constants';
import { selectAddDemoPerson, selectDemoPeople, selectUpdateDemoPerson, useDemoPersonStore } from '@/store';
import { AddressSection, ConfirmDialog, EscapeDeathSection, PersonalInfoSection, RelationshipDialog, RelationshipTable } from './components';
import { createDefaultPerson } from './constants';
import { personSchema } from './schemas';
import type { PersonFormValues, Relation, RelationInput } from './types';

type Props = {
  personId?: string;
  onClose?: () => void;
  onSuccess?: (id?: string) => void;
  isDialog?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
  formId?: string;
};

export default function PersonForm({ personId, onClose, onSuccess, isDialog, onDirtyChange, onSubmittingChange, formId = 'person-form' }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const people = useDemoPersonStore(selectDemoPeople);
  const addPerson = useDemoPersonStore(selectAddDemoPerson);
  const updatePerson = useDemoPersonStore(selectUpdateDemoPerson);
  const currentPerson = personId ? people.find((person) => person.id === personId) : undefined;
  const methods = useForm<PersonFormValues>({ resolver: yupResolver(personSchema), defaultValues: currentPerson ?? createDefaultPerson(), mode: 'onTouched' });
  const { control, getValues, handleSubmit, reset, setValue, formState: { isDirty, isSubmitting } } = methods;
  const relations = useWatch({ control, name: 'relations' });
  const [relationOpen, setRelationOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<Relation | null>(null);
  const [relationToDelete, setRelationToDelete] = useState<Relation | null>(null);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !isDialog && isDirty && !isSubmitting && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => { if (currentPerson) reset(currentPerson); }, [currentPerson, reset]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(PATHS.demoProject.personList);
    }
  };

  if (personId && !currentPerson) {
    return (
      <Alert
        severity="warning"
        action={<Button onClick={handleClose}>Về danh sách</Button>}
      >
        Không tìm thấy người cần chỉnh sửa.
      </Alert>
    );
  }

  const lookup = () => {
    const values = getValues();
    if (!values.fullName.trim() || !values.gender || !values.birthDate || !values.identityNumber) enqueueSnackbar('Cần nhập họ tên, giới tính, ngày sinh và CCCD để tra cứu', { variant: 'warning' });
    else enqueueSnackbar('Tra cứu CSDL dân cư chỉ được mô phỏng; không có dữ liệu thật được truy xuất', { variant: 'info' });
  };
  const saveRelation = (values: RelationInput) => {
    const next = editingRelation ? relations.map((item) => item.id === editingRelation.id ? { ...values, id: item.id } : item) : [...relations, { ...values, id: crypto.randomUUID() }];
    setValue('relations', next, { shouldDirty: true, shouldValidate: true });
    setEditingRelation(null);
    enqueueSnackbar('Đã cập nhật mối quan hệ', { variant: 'success' });
  };
  const submit = handleSubmit((values) => {
    let targetId = personId;
    if (personId) {
      updatePerson(personId, values);
    } else {
      targetId = addPerson(values);
    }
    reset(values);
    enqueueSnackbar(personId ? 'Đã cập nhật thông tin con người' : 'Đã thêm mới con người', { variant: 'success' });
    if (onSuccess) {
      onSuccess(targetId);
    } else {
      navigate(PATHS.demoProject.personList);
    }
  }, () => enqueueSnackbar('Vui lòng kiểm tra các trường được đánh dấu lỗi', { variant: 'error' }));

  return <>
    <FormProvider methods={methods} onSubmit={submit} id={formId}>
      <Stack spacing={3}>
        {!isDialog && (
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4">{personId ? 'Chỉnh sửa thông tin con người liên quan' : 'Thêm mới thông tin con người liên quan'}</Typography>
            </Box>
            <IconButton aria-label="Đóng biểu mẫu" onClick={handleClose}><Iconify icon="mingcute:close-line" /></IconButton>
          </Stack>
        )}
        <Card><CardHeader title="Vai trò và thông tin cá nhân" /><CardContent><PersonalInfoSection onLookup={lookup} /></CardContent></Card>
        <Card><CardHeader title="Địa chỉ và thông tin bổ sung" /><CardContent><AddressSection /></CardContent></Card>
        <Card><CardContent><Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}><Typography variant="h6">Mối quan hệ</Typography><Button variant="outlined" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => { setEditingRelation(null); setRelationOpen(true); }}>Thêm mới</Button></Stack><RelationshipTable rows={relations} onEdit={(row) => { setEditingRelation(row); setRelationOpen(true); }} onDelete={setRelationToDelete} /></CardContent></Card>
        <Card><CardHeader title="Thông tin thống kê các trường hợp trốn, chết" /><CardContent><EscapeDeathSection /></CardContent></Card>
        {!isDialog && (
          <>
            <Divider />
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ pb: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} startIcon={<Iconify icon="solar:diskette-bold" />}>Lưu</LoadingButton>
              <Button color="error" variant="outlined" onClick={handleClose}>Đóng</Button>
            </Stack>
          </>
        )}
      </Stack>
    </FormProvider>
    <RelationshipDialog open={relationOpen} initialValue={editingRelation ?? undefined} onClose={() => { setRelationOpen(false); setEditingRelation(null); }} onSave={saveRelation} />
    <ConfirmDialog open={!!relationToDelete} title="Xóa mối quan hệ?" message={`Xóa mối quan hệ với “${relationToDelete?.fullName ?? ''}”?`} confirmLabel="Xóa" onCancel={() => setRelationToDelete(null)} onConfirm={() => { if (relationToDelete) setValue('relations', relations.filter((item) => item.id !== relationToDelete.id), { shouldDirty: true }); setRelationToDelete(null); }} />
    {!isDialog && (
      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="Rời khỏi biểu mẫu?"
        message="Bạn có thay đổi chưa được lưu. Nếu rời khỏi trang, các thông tin vừa nhập sẽ bị mất. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Rời đi"
        onCancel={() => {
          if (blocker.state === 'blocked') blocker.reset();
        }}
        onConfirm={() => {
          if (blocker.state === 'blocked') blocker.proceed();
        }}
      />
    )}
  </>;
}
