import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BaseDatePicker, BaseSelect, BaseSwitch, BaseTextArea, BaseTextField, Iconify } from '@/components';
import { AGENCY_DETAIL_OPTIONS, AGENCY_OPTIONS, AGENCY_SUBDETAIL_OPTIONS, createDefaultPerson, DEATH_REASON_OPTIONS, ESCAPE_OUTCOME_OPTIONS, ESCAPE_REASON_OPTIONS, INCIDENT_PLACE_OPTIONS } from '../constants';
import type { IncidentReason, IncidentType, PersonFormValues } from '../types';

export default function EscapeDeathSection() {
  const { control, setValue, formState: { errors } } = useFormContext<PersonFormValues>();
  const incident = useWatch({ control, name: 'incident' });
  const { enqueueSnackbar } = useSnackbar();
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [officerAction, setOfficerAction] = useState('');
  const activeRows = incident.type === 'chet' ? incident.deathReasons : incident.escapeReasons;
  const reasonKey = incident.type === 'chet' ? 'deathReasons' : 'escapeReasons';
  const reasonOptions = incident.type === 'chet' ? DEATH_REASON_OPTIONS : ESCAPE_REASON_OPTIONS;

  const changeType = (type: IncidentType) => {
    setValue('incident.type', type, { shouldDirty: true, shouldValidate: true });
    setReason(''); setOtherReason(''); setOfficerAction('');
  };

  const addReason = () => {
    const name = reason === 'Khác' ? otherReason.trim() : reason;
    if (!name) { enqueueSnackbar('Vui lòng chọn và ghi rõ hình thức/nguyên nhân', { variant: 'warning' }); return; }
    if (activeRows.some((item) => item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) { enqueueSnackbar('Hình thức/nguyên nhân này đã được khai báo', { variant: 'warning' }); return; }
    const next: IncidentReason[] = [...activeRows, { id: crypto.randomUUID(), name, officerAction: officerAction.trim() }];
    setValue(`incident.${reasonKey}`, next, { shouldDirty: true, shouldValidate: true });
    setReason(''); setOtherReason(''); setOfficerAction('');
    enqueueSnackbar(incident.type === 'tron' ? 'Đã thêm hình thức trốn' : 'Đã thêm hình thức chết', { variant: 'success' });
  };

  const agencyDetailLabel = incident.agency === 'Trụ sở công an' ? 'Loại trụ sở' : (incident.agency || 'Chi tiết đơn vị');
  const agencySubdetailLabel = incident.agencyDetail === 'Công an xã' ? 'Công an xã/phường' : (incident.agencyDetail || 'Đơn vị cụ thể');

  return <Stack spacing={2.5}>
    <BaseSwitch name="incident.enabled" label="Đối tượng có trường hợp trốn/chết" onChange={(event) => setValue('incident', { ...createDefaultPerson().incident, enabled: event.target.checked }, { shouldDirty: true, shouldValidate: true })} />
    {incident.enabled && <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="incident.agency" label="Đơn vị *" options={AGENCY_OPTIONS} onChange={(event) => { setValue('incident.agency', event.target.value, { shouldDirty: true, shouldValidate: true }); setValue('incident.agencyDetail', ''); setValue('incident.agencySubdetail', ''); setValue('incident.otherAgency', ''); }} /></Grid>
        {!!AGENCY_DETAIL_OPTIONS[incident.agency] && <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="incident.agencyDetail" label={agencyDetailLabel} options={AGENCY_DETAIL_OPTIONS[incident.agency]} onChange={(event) => { setValue('incident.agencyDetail', event.target.value, { shouldDirty: true }); setValue('incident.agencySubdetail', ''); }} /></Grid>}
        {!!AGENCY_SUBDETAIL_OPTIONS[incident.agencyDetail] && <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="incident.agencySubdetail" label={agencySubdetailLabel} options={AGENCY_SUBDETAIL_OPTIONS[incident.agencyDetail]} /></Grid>}
        {incident.agency === 'Khác' && <Grid size={{ xs: 12, md: 3 }}><BaseTextField name="incident.otherAgency" label="Đơn vị khác, ghi cụ thể *" /></Grid>}
        <Grid size={{ xs: 12, md: 3 }}><BaseSelect name="incident.type" label="Trường hợp *" options={[{ value: 'tron', label: 'Trốn' }, { value: 'chet', label: 'Chết' }]} onChange={(event) => changeType(event.target.value as IncidentType)} /></Grid>
      </Grid>
      {!!incident.type && <>
        <Typography variant="subtitle2">{incident.type === 'tron' ? 'Hình thức trốn' : 'Nguyên nhân chết'}</Typography>
        <Grid container spacing={2} alignItems="start">
          <Grid size={{ xs: 12, md: 3 }}><TextField select fullWidth label={incident.type === 'tron' ? 'Hình thức trốn *' : 'Nguyên nhân chết *'} value={reason} onChange={(event) => setReason(event.target.value)}><MenuItem value="">— Chọn —</MenuItem>{reasonOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}</TextField></Grid>
          {reason === 'Khác' && <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth label="Khác, ghi cụ thể *" value={otherReason} onChange={(event) => setOtherReason(event.target.value)} /></Grid>}
          <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Xử lý cán bộ vi phạm (nếu có)" value={officerAction} onChange={(event) => setOfficerAction(event.target.value)} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><Button fullWidth variant="outlined" sx={{ height: 56 }} onClick={addReason}>Thêm</Button></Grid>
        </Grid>
        <TableContainer sx={{ overflowX: 'auto' }}><Table size="small"><TableHead><TableRow><TableCell>STT</TableCell><TableCell>{incident.type === 'tron' ? 'Hình thức trốn' : 'Nguyên nhân chết'}</TableCell><TableCell>Xử lý cán bộ vi phạm</TableCell><TableCell>Thao tác</TableCell></TableRow></TableHead><TableBody>
          {activeRows.length === 0 ? <TableRow><TableCell colSpan={4} align="center">Chưa khai báo hình thức/nguyên nhân</TableCell></TableRow> : activeRows.map((item, index) => <TableRow key={item.id}><TableCell>{index + 1}</TableCell><TableCell>{item.name}</TableCell><TableCell>{item.officerAction || '—'}</TableCell><TableCell><IconButton size="small" color="error" aria-label={`Xóa ${item.name}`} onClick={() => { setValue(`incident.${reasonKey}`, activeRows.filter((row) => row.id !== item.id), { shouldDirty: true, shouldValidate: true }); enqueueSnackbar(incident.type === 'tron' ? 'Đã xóa hình thức trốn' : 'Đã xóa hình thức chết', { variant: 'info' }); }}><Iconify icon="solar:trash-bin-trash-bold" width={18} /></IconButton></TableCell></TableRow>)}
        </TableBody></Table></TableContainer>
        {errors.incident?.[reasonKey]?.message && <FormHelperText error>{errors.incident[reasonKey]?.message}</FormHelperText>}
        {activeRows.length > 0 && <IncidentDetails type={incident.type} place={incident.type === 'tron' ? incident.escapeDetail.place : incident.deathDetail.place} />}
      </>}
    </>}
  </Stack>;
}

function IncidentDetails({ type, place }: { type: Exclude<IncidentType, ''>; place: string }) {
  const prefix = type === 'tron' ? 'incident.escapeDetail' : 'incident.deathDetail';
  return <Grid container spacing={2} sx={{ pt: 1 }}>
    <Grid size={{ xs: 12, md: 4 }}><BaseSelect name={`${prefix}.place`} label={type === 'tron' ? 'Địa điểm trốn' : 'Địa điểm chết'} options={INCIDENT_PLACE_OPTIONS} /></Grid>
    {place === 'Khác' && <Grid size={{ xs: 12, md: 4 }}><BaseTextField name={`${prefix}.otherPlace`} label="Địa điểm khác, ghi rõ *" /></Grid>}
    <Grid size={{ xs: 12, md: 2 }}><BaseDatePicker name={`${prefix}.eventDate`} label={type === 'tron' ? 'Ngày trốn' : 'Ngày chết'} /></Grid>
    {type === 'tron' && <Grid size={{ xs: 12, md: 2 }}><BaseDatePicker name={`${prefix}.recaptureDate`} label="Ngày bắt lại" /></Grid>}
    <Grid size={{ xs: 12 }}><BaseTextArea name={`${prefix}.content`} label="Nội dung" minRows={2} placeholder={type === 'tron' ? 'Tóm tắt diễn biến nội dung vụ việc đối tượng bỏ trốn, biện pháp truy bắt' : 'Tóm tắt diễn biến nội dung vụ việc đối tượng chết; kết quả điều tra, giải quyết'} /></Grid>
    <Grid size={{ xs: 12, md: 4 }}>{type === 'tron' ? <BaseSelect name={`${prefix}.outcome`} label="Kết quả giải quyết với đối tượng" options={ESCAPE_OUTCOME_OPTIONS} /> : <BaseTextField name={`${prefix}.outcome`} label="Kết quả giải quyết với đối tượng" />}</Grid>
    <Grid size={{ xs: 12, md: 8 }}><BaseTextArea name={`${prefix}.officerOutcome`} label="Kết quả xử lý cán bộ vi phạm" minRows={2} placeholder="Ghi cụ thể hình thức xử lý; số, ngày tháng năm, Cơ quan ra quyết định" /></Grid>
  </Grid>;
}
