import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { BaseDatePicker, BaseSelect, BaseTextArea, BaseTextField, Iconify } from '@/components';
import type { PersonFormValues } from '../types';
import { EDUCATION_OPTIONS, ETHNICITY_OPTIONS, FAMILY_OPTIONS, GENDER_OPTIONS, NATIONALITY_OPTIONS, OCCUPATION_OPTIONS, RECORD_OPTIONS, RELIGION_OPTIONS, ROLE_OPTIONS, YES_NO_OPTIONS } from '../constants';

type Props = { onLookup: () => void };

export default function PersonalInfoSection({ onLookup }: Props) {
  const { control, setValue } = useFormContext<PersonFormValues>();
  const { enqueueSnackbar } = useSnackbar();
  const identityNumber = useWatch({ control, name: 'identityNumber' });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => { if (identityNumber) setValue('noIdentityReason', ''); }, [identityNumber, setValue]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return <Grid container spacing={2.5}>
    <Grid size={{ xs: 12 }}><BaseSelect name="role" label="Vai trò người tham gia tố tụng *" options={ROLE_OPTIONS} placeholder="— Chọn vai trò —" /></Grid>
    <Grid size={{ xs: 12 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08), border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`, p: 1.5, borderRadius: 1, textAlign: 'center' }}>
        Nhập 4 thông tin: Họ tên, Giới tính, Ngày sinh, CCCD để lấy thông tin từ CSDL dân cư
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 2 }}><Stack alignItems="center" spacing={1.5} sx={{ p: 2, border: 1, borderColor: 'divider', borderStyle: 'dashed', borderRadius: 1 }}>
      <Avatar src={preview ?? undefined} alt="Ảnh người liên quan" sx={{ width: 108, height: 108 }} />
      <Button component="label" size="small" startIcon={<Iconify icon="solar:upload-bold" />}>Tải ảnh<input type="file" accept="image/*" hidden onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) enqueueSnackbar('Chỉ chọn ảnh tối đa 5 MB', { variant: 'warning' }); else setPreview(URL.createObjectURL(file)); event.target.value = ''; }} /></Button>
      <Typography variant="caption" color="text.secondary" align="center">Ảnh chỉ hiển thị trong phiên nhập demo</Typography>
    </Stack></Grid>
    <Grid size={{ xs: 12, md: 10 }} container spacing={2.5}>
      <Grid size={{ xs: 12, md: 5 }}><BaseTextField name="fullName" label="Họ và tên *" /></Grid>
      <Grid size={{ xs: 12, md: 3 }}><BaseSelect size='small' name="gender" label="Giới tính *" options={GENDER_OPTIONS} /></Grid>
      <Grid size={{ xs: 12, md: 4 }}><BaseDatePicker name="birthDate" label="Ngày sinh *" /></Grid>
      <Grid size={{ xs: 12, md: 4 }}><BaseTextField name="identityNumber" label="CCCD/CMT" maxLength={12} inputProps={{ inputMode: 'numeric' }} /></Grid>
      <Grid size={{ xs: 12, md: 5 }}><BaseTextField name="noIdentityReason" label={identityNumber ? 'Lý do không có CCCD/CMT' : 'Lý do không có CCCD/CMT *'} disabled={!!identityNumber} /></Grid>
      <Grid size={{ xs: 12, md: 3 }}><Button fullWidth variant="contained" sx={{ height: 56 }} onClick={onLookup}>Tra cứu</Button></Grid>
    </Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseTextField name="otherName" label="Tên gọi khác" /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseDatePicker name="identityIssueDate" label="Ngày cấp CCCD" /></Grid>
    <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="identityIssuePlace" label="Nơi cấp CCCD" /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="ethnicity" label="Dân tộc" options={ETHNICITY_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="nationality" label="Quốc tịch" options={NATIONALITY_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 2 }}><BaseTextField name="passport" label="Hộ chiếu" /></Grid>
    <Grid size={{ xs: 12, md: 2 }}><BaseDatePicker name="passportIssueDate" label="Ngày cấp hộ chiếu" /></Grid>
    <Grid size={{ xs: 12, md: 2 }}><BaseTextField name="passportIssuePlace" label="Nơi cấp hộ chiếu" /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="education" label="Trình độ văn hóa" options={EDUCATION_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="occupation" label="Nghề nghiệp *" options={OCCUPATION_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseTextField name="position" label="Chức vụ, quyền hạn" /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseTextField name="workplace" label="Nơi làm việc" /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseTextField name="phone" label="Số điện thoại" inputProps={{ inputMode: 'tel' }} /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="familyBackground" label="Thành phần gia đình" options={FAMILY_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="religion" label="Tôn giáo" options={RELIGION_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="partyMember" label="Là Đảng viên *" options={YES_NO_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="criminalRecord" label="Tiền án/Tiền sự *" options={RECORD_OPTIONS} /></Grid>
    <Grid size={{ xs: 12, md: 9 }}><BaseTextArea name="criminalRecordDetails" label="Thông tin tiền án, tiền sự" minRows={2} /></Grid>
  </Grid>;
}
