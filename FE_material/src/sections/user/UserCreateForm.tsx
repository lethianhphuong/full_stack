import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider, BaseTextField, BaseSelect, BaseSwitch, BaseDatePicker } from '@/components';
import { PATHS } from '@/constants';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'manager', label: 'Quản lý' },
  { value: 'editor', label: 'Biên tập viên' },
  { value: 'user', label: 'Người dùng' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'banned', label: 'Bị cấm' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

// ----------------------------------------------------------------------

export type UserCreateFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  gender: string;
  role: string;
  status: string;
  company: string;
  address: string;
  isVerified: boolean;
};

const DEFAULT_VALUES: UserCreateFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  birthday: '',
  gender: '',
  role: 'user',
  status: 'active',
  company: '',
  address: '',
  isVerified: false,
};

const PHONE_REGEX = /^(0|\+84)(\d{9,10})$/;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().trim().required('Vui lòng nhập tên'),
  lastName: Yup.string().trim().required('Vui lòng nhập họ'),
  email: Yup.string().trim().required('Vui lòng nhập email').email('Email không hợp lệ'),
  phoneNumber: Yup.string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .matches(PHONE_REGEX, 'Số điện thoại không hợp lệ (VD: 0912345678)'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .matches(/[A-Za-z]/, 'Mật khẩu phải chứa chữ cái')
    .matches(/\d/, 'Mật khẩu phải chứa chữ số'),
  confirmPassword: Yup.string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
  birthday: Yup.string().required('Vui lòng chọn ngày sinh'),
  gender: Yup.string().required('Vui lòng chọn giới tính'),
  role: Yup.string().required('Vui lòng chọn vai trò'),
  status: Yup.string().required('Vui lòng chọn trạng thái'),
  company: Yup.string().trim().default(''),
  address: Yup.string().trim().default(''),
  isVerified: Yup.boolean().default(false),
});

// ----------------------------------------------------------------------

export default function UserCreateForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<UserCreateFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (values: UserCreateFormValues) => {
      try {
        // TODO: gọi API tạo người dùng tại đây
        await new Promise((resolve) => setTimeout(resolve, 1000)); // giả lập API

        console.log('User create payload:', values);
        enqueueSnackbar('Tạo người dùng thành công!', { variant: 'success' });
        reset(DEFAULT_VALUES);
        navigate(PATHS.user.list);
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại.', { variant: 'error' });
      }
    },
    [enqueueSnackbar, navigate, reset]
  );

  const handleCancel = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Thông tin người dùng" subheader="Điền đầy đủ thông tin để tạo người dùng mới" />

        <CardContent>
          <Grid container spacing={3}>
            {/* Thông tin cá nhân */}
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="firstName" label="Tên" placeholder="VD: Văn A" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="lastName" label="Họ và tên đệm" placeholder="VD: Nguyễn" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="email" label="Email" placeholder="vd@email.com" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="phoneNumber" label="Số điện thoại" placeholder="0912345678" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseDatePicker name="birthday" label="Ngày sinh" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect name="gender" label="Giới tính" options={GENDER_OPTIONS} placeholder="— Chọn giới tính —" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }}>
                <Stack direction="row" sx={{ typography: 'subtitle2', color: 'text.secondary' }}>
                  Thông tin tài khoản
                </Stack>
              </Divider>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="password" label="Mật khẩu" type="password" autoComplete="new-password" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                autoComplete="new-password"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect name="role" label="Vai trò" options={ROLE_OPTIONS} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect name="status" label="Trạng thái" options={STATUS_OPTIONS} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }}>
                <Stack direction="row" sx={{ typography: 'subtitle2', color: 'text.secondary' }}>
                  Thông tin bổ sung
                </Stack>
              </Divider>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="company" label="Công ty" placeholder="Tên công ty" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="address" label="Địa chỉ" placeholder="Địa chỉ liên hệ" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <BaseSwitch name="isVerified" label="Đã xác minh email" />
            </Grid>
          </Grid>
        </CardContent>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ px: 3, pb: 3 }}>
          <Button color="inherit" variant="outlined" onClick={handleCancel}>
            Hủy
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Tạo người dùng
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
