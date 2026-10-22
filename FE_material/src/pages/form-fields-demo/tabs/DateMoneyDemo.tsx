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
import { FormProvider, BaseDatePicker, BaseDateRangePicker, BaseMoneyField } from '@/components';
import type { DateRangeValue } from '@/components';

// ----------------------------------------------------------------------

type FormValues = {
  birthday: string;
  period: DateRangeValue;
  price: number | null;
  salaryUsd: number | null;
};

const DEFAULT_VALUES: FormValues = {
  birthday: '',
  period: { from: '', to: '' },
  price: null,
  salaryUsd: null,
};

const validationSchema = Yup.object().shape({
  birthday: Yup.string().required('Vui lòng chọn ngày sinh'),
  period: Yup.object()
    .shape({
      from: Yup.string(),
      to: Yup.string(),
    })
    .test('range-required', 'Vui lòng chọn đủ khoảng thời gian', (value) => !!value?.from && !!value?.to),
  price: Yup.number().nullable().required('Vui lòng nhập giá bán').min(0, 'Giá không được âm'),
  salaryUsd: Yup.number().nullable().min(0, 'Không được âm'),
});

// ----------------------------------------------------------------------

export default function DateMoneyDemo() {
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
      console.log('Date & Money payload:', values);
      enqueueSnackbar('Submit thành công! Xem console để xem payload.', { variant: 'success' });
    },
    [enqueueSnackbar]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Date & Money" subheader="DatePicker, DateRangePicker (tự validate từ ≤ đến), MoneyField" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseDatePicker name="birthday" label="Ngày sinh" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <BaseDateRangePicker name="period" label="Khoảng thời gian" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseMoneyField name="price" label="Giá bán (VND)" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseMoneyField name="salaryUsd" label="Lương (USD, 2 số lẻ)" currencySymbol="$" precision={2} />
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
