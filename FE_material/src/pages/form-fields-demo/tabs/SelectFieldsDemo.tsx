import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider, BaseSelect, BaseAutocomplete } from '@/components';
import type { BaseOption } from '@/components';

// ----------------------------------------------------------------------

type FormValues = {
  status: string;
  role: string;
  cities: string[];
  staff: string;
  staffs: string[];
  tags: string[];
};

const DEFAULT_VALUES: FormValues = {
  status: '',
  role: '',
  cities: [],
  staff: '',
  staffs: [],
  tags: [],
};

const validationSchema = Yup.object().shape({
  status: Yup.string().required('Vui lòng chọn trạng thái'),
  role: Yup.string().required('Vui lòng chọn vai trò'),
  cities: Yup.array().min(1, 'Chọn ít nhất 1 thành phố'),
  staff: Yup.string().nullable().required('Vui lòng chọn nhân viên'),
  staffs: Yup.array().min(1, 'Chọn ít nhất 1 nhân viên'),
  tags: Yup.array(),
});

const CITY_OPTIONS = [
  { label: 'Hà Nội', value: 'hanoi' },
  { label: 'TP. Hồ Chí Minh', value: 'hcmc' },
  { label: 'Đà Nẵng', value: 'danang' },
  { label: 'Hải Phòng', value: 'haiphong' },
  { label: 'Cần Thơ', value: 'cantho' },
];

// Mock data nhân viên — giả lập API trả về
const MOCK_STAFFS: BaseOption[] = [
  { label: 'Nguyễn Văn An', value: 'nv001', department: 'Kỹ thuật' },
  { label: 'Trần Thị Bình', value: 'nv002', department: 'Kinh doanh' },
  { label: 'Lê Hoàng Cường', value: 'nv003', department: 'Kỹ thuật' },
  { label: 'Phạm Thu Dung', value: 'nv004', department: 'Nhân sự' },
  { label: 'Hoàng Minh Đức', value: 'nv005', department: 'Marketing' },
  { label: 'Vũ Thị Hà', value: 'nv006', department: 'Kinh doanh' },
];

/** Giả lập API fetch nhân viên (delay 800ms) */
function fetchStaffs(): Promise<BaseOption[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STAFFS), 800);
  });
}

// ----------------------------------------------------------------------

export default function SelectFieldsDemo() {
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (values: FormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log('Select fields payload:', values);
      enqueueSnackbar('Submit thành công! Xem console để xem payload.', { variant: 'success' });
    },
    [enqueueSnackbar]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Select & Autocomplete" subheader="options, valueEnum, multiple, showSearch, async, tags" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect
                name="status"
                label="Trạng thái (valueEnum + allowClear)"
                valueEnum={{ active: 'Hoạt động', pending: 'Chờ duyệt', banned: 'Bị cấm' }}
                placeholder="— Chọn trạng thái —"
                allowClear
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect name="role" label="Vai trò (options)" options={[
                { label: 'Quản trị viên', value: 'admin' },
                { label: 'Quản lý', value: 'manager' },
                { label: 'Người dùng', value: 'user' },
              ]} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect name="cities" label="Thành phố (multiple + Chip)" options={CITY_OPTIONS} multiple />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect
                name="staff"
                label="Nhân viên (showSearch + renderOption)"
                options={MOCK_STAFFS}
                showSearch
                placeholder="Gõ tên để tìm..."
                renderOption={(option) => (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.light' }}>
                      {option.label.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{option.label}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                      {option.department as string}
                    </Typography>
                  </Stack>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseAutocomplete
                name="staffs"
                label="Nhóm nhân viên (async request + multiple)"
                request={fetchStaffs}
                multiple
                placeholder="Chọn nhân viên..."
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseAutocomplete
                name="tags"
                label="Tags (freeSolo — nhập tự do, Enter để thêm)"
                multiple
                freeSolo
                options={[
                  { label: 'hot', value: 'hot' },
                  { label: 'new', value: 'new' },
                  { label: 'sale', value: 'sale' },
                ]}
                placeholder="Nhập tag rồi nhấn Enter..."
              />
            </Grid>
          </Grid>
        </CardContent>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ px: 3, pb: 3 }}>
          <LoadingButton color="inherit" variant="outlined" onClick={() => reset(DEFAULT_VALUES)}>
            Reset
          </LoadingButton>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
