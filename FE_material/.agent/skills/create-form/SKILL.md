---
name: create-form
description: Hướng dẫn quy trình tạo form nhập liệu chuẩn React Hook Form + Yup + hệ thống Base Fields của dự án.
---

# Quy trình tạo Form nhập liệu trong dự án FE_material

Khi có yêu cầu tạo Form (thêm mới, chỉnh sửa, lọc dữ liệu), hãy tuân thủ nghiêm ngặt các bước sau:

## 1. Định nghĩa Types & Default Values
```tsx
export type ProductFormValues = {
  name: string;
  category: string;
  price: number;
  description?: string;
  isAvailable: boolean;
};

const DEFAULT_VALUES: ProductFormValues = {
  name: '',
  category: '',
  price: 0,
  description: '',
  isAvailable: true,
};
```

## 2. Xây dựng Schema Validation với Yup
Thông báo lỗi phải rõ ràng bằng tiếng Việt:
```tsx
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Vui lòng nhập tên sản phẩm'),
  category: Yup.string().required('Vui lòng chọn danh mục'),
  price: Yup.number()
    .typeError('Giá sản phẩm phải là số')
    .min(1000, 'Giá tối thiểu là 1.000 đ')
    .required('Vui lòng nhập giá'),
  description: Yup.string().default(''),
  isAvailable: Yup.boolean().default(true),
});
```

## 3. Khởi tạo Hook `useForm`
```tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const methods = useForm<ProductFormValues>({
  resolver: yupResolver(validationSchema),
  defaultValues: DEFAULT_VALUES,
  mode: 'onTouched',
});

const { handleSubmit, reset, formState: { isSubmitting } } = methods;
```

## 4. Bọc FormProvider & Dùng Atomic Base Fields
Không dùng các input thô của MUI (`<TextField value={...} onChange={...} />`). Thay vào đó, dùng các component Base Fields từ `@/components`:
- `BaseTextField`
- `BaseSelect`
- `BaseDatePicker`
- `BaseSwitch`
- `BaseNumberField`

```tsx
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider, BaseTextField, BaseSelect, BaseSwitch } from '@/components';
import { useSnackbar } from 'notistack';

export default function ProductCreateForm() {
  const { enqueueSnackbar } = useSnackbar();
  
  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Gọi API...
      enqueueSnackbar('Thao tác thành công!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Thông tin sản phẩm" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="name" label="Tên sản phẩm" placeholder="Nhập tên..." />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseSelect
                name="category"
                label="Danh mục"
                options={[
                  { value: 'cat1', label: 'Điện tử' },
                  { value: 'cat2', label: 'Gia dụng' },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <BaseSwitch name="isAvailable" label="Đang kinh doanh" />
            </Grid>
          </Grid>
        </CardContent>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ px: 3, pb: 3 }}>
          <Button color="inherit" variant="outlined" onClick={() => reset(DEFAULT_VALUES)}>
            Hủy
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Lưu thay đổi
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
```
