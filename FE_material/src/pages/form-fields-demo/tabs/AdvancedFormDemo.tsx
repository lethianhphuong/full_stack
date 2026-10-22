import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  FormProvider,
  FormDependency,
  BaseFormList,
  BaseTextField,
  BaseSelect,
  BaseUpload,
} from '@/components';

// ----------------------------------------------------------------------

type AddressItem = {
  city: string;
  street: string;
};

type FormValues = {
  fullName: string;
  role: string;
  permission: string;
  avatar: File[];
  attachments: File[];
  addresses: AddressItem[];
};

const DEFAULT_VALUES: FormValues = {
  fullName: '',
  role: 'user',
  permission: '',
  avatar: [],
  attachments: [],
  addresses: [{ city: '', street: '' }],
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string().trim().required('Vui lòng nhập họ tên'),
  role: Yup.string().required('Vui lòng chọn vai trò'),
  permission: Yup.string().when('role', {
    is: 'admin',
    then: (schema) => schema.required('Admin bắt buộc nhập quyền đặc biệt'),
    otherwise: (schema) => schema.notRequired(),
  }),
  avatar: Yup.array().min(1, 'Vui lòng chọn ảnh đại diện'),
  attachments: Yup.array(),
  addresses: Yup.array()
    .min(1, 'Cần ít nhất 1 địa chỉ')
    .of(
      Yup.object().shape({
        city: Yup.string().required('Nhập thành phố'),
        street: Yup.string().required('Nhập đường/phố'),
      })
    ),
});

// ----------------------------------------------------------------------

export default function AdvancedFormDemo() {
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as never,
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
      console.log('Advanced form payload:', values);
      enqueueSnackbar('Submit thành công! Xem console để xem payload.', { variant: 'success' });
    },
    [enqueueSnackbar]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader
          title="Form nâng cao"
          subheader="Upload (drag & drop), FormDependency (field ẩn hiện theo vai trò), FormList (thêm/xóa/nhân bản địa chỉ)"
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="fullName" label="Họ tên" allowClear />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect
                name="role"
                label="Vai trò"
                options={[
                  { label: 'Quản trị viên', value: 'admin' },
                  { label: 'Người dùng', value: 'user' },
                ]}
                helperText="Chọn Quản trị viên để thấy field ẩn hiện (FormDependency)"
              />
            </Grid>

            {/* Field ẩn hiện theo vai trò */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDependency watch={['role']}>
                {({ role }) =>
                  role === 'admin' ? (
                    <BaseTextField name="permission" label="Quyền đặc biệt (chỉ admin)" placeholder="VD: full-access" />
                  ) : null
                }
              </FormDependency>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseUpload name="avatar" label="Ảnh đại diện" accept="image/*" helperText="Chỉ chấp nhận ảnh" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseUpload
                name="attachments"
                label="Tệp đính kèm"
                multiple
                maxSize={5}
                maxFiles={3}
                helperText="Tối đa 3 file, mỗi file ≤ 5MB"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <BaseFormList
                name="addresses"
                label="Danh sách địa chỉ (FormList)"
                defaultItemValue={{ city: '', street: '' }}
                maxItems={5}
                renderItem={(index) => (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <BaseTextField name={`addresses.${index}.city`} label="Thành phố" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <BaseTextField name={`addresses.${index}.street`} label="Đường/phố" />
                    </Grid>
                  </Grid>
                )}
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
