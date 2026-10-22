import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  FormProvider,
  BaseTextField,
  BaseTextArea,
  BaseNumberField,
  BaseMoneyField,
  BaseRadioGroup,
  BaseCheckboxGroup,
  BaseSwitch,
  BaseEditor,
} from '@/components';

// ----------------------------------------------------------------------

type FormValues = {
  fullName: string;
  bio: string;
  age: number | null;
  salary: number | null;
  gender: string;
  level: string;
  skills: string[];
  newsletter: boolean;
  content: string;
};

const DEFAULT_VALUES: FormValues = {
  fullName: '',
  bio: '',
  age: null,
  salary: null,
  gender: '',
  level: '',
  skills: [],
  newsletter: false,
  content: '',
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string().trim().required('Vui lòng nhập họ tên'),
  bio: Yup.string().trim().max(200, 'Tối đa 200 ký tự'),
  age: Yup.number().nullable().min(1, 'Tuổi phải lớn hơn 0').max(150, 'Tuổi không hợp lệ'),
  salary: Yup.number().nullable().min(0, 'Lương không được âm'),
  gender: Yup.string().required('Vui lòng chọn giới tính'),
  level: Yup.string().required('Vui lòng chọn cấp độ'),
  skills: Yup.array().min(1, 'Chọn ít nhất 1 kỹ năng'),
  newsletter: Yup.boolean(),
  content: Yup.string().required('Vui lòng nhập nội dung'),
});

const GENDER_OPTIONS = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
  { label: 'Khác', value: 'other' },
];

const SKILL_OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'TypeScript', value: 'typescript' },
];

// ----------------------------------------------------------------------

export default function BasicFieldsDemo() {
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
      console.log('Basic fields payload:', values);
      enqueueSnackbar('Submit thành công! Xem console để xem payload.', { variant: 'success' });
    },
    [enqueueSnackbar]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Nhóm field cơ bản" subheader="TextField, TextArea, Number, Money, Radio, Checkbox, Switch" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="fullName" label="Họ tên" placeholder="Nguyễn Văn A" allowClear />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseNumberField name="age" label="Tuổi" min={1} max={150} showControls placeholder="25" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <BaseTextArea name="bio" label="Giới thiệu bản thân" maxLength={200} placeholder="Viết vài dòng về bạn..." />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseMoneyField name="salary" label="Mức lương mong muốn" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseRadioGroup name="gender" label="Giới tính" options={GENDER_OPTIONS} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseRadioGroup
                name="level"
                label="Cấp độ"
                optionType="button"
                valueEnum={{ junior: 'Junior', middle: 'Middle', senior: 'Senior' }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseCheckboxGroup name="skills" label="Kỹ năng" options={SKILL_OPTIONS} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <BaseSwitch name="newsletter" label="Đăng ký nhận bản tin" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <BaseEditor name="content" label="Nội dung bài viết" placeholder="Viết gì đó hay ho..." />
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
