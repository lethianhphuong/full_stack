---
name: create-page
description: Hướng dẫn quy trình tạo mới một màn hình (Page) chuẩn kiến trúc 4 tầng, tách biệt section và đăng ký route tự động vào menu.
---

# Quy trình tạo mới màn hình (Page) trong dự án FE_material

Khi có yêu cầu tạo màn hình hoặc tính năng mới, hãy thực hiện tuần tự theo 4 bước sau:

## Bước 1: Khai báo Types (nếu có)
Nếu tính năng có kiểu dữ liệu riêng, khai báo tại `src/types/`:
```ts
// src/types/product.ts
export type ProductItem = {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
};
```
Re-export trong `src/types/index.ts`.

## Bước 2: Tạo tầng Section (Nghiệp vụ UI)
Tạo component xử lý giao diện và logic chính tại `src/sections/<feature>/`:
```tsx
// src/sections/product/ProductListView.tsx
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

export default function ProductListView() {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5">Danh sách sản phẩm</Typography>
      {/* Logic, Table, Filter ở đây */}
    </Card>
  );
}
```
Luôn tạo `src/sections/<feature>/index.ts` để barrel export:
```ts
export { default as ProductListView } from './ProductListView';
```

## Bước 3: Tạo tầng Page (Thin Wrapper)
Tạo page component tại `src/pages/<feature>/<Feature>Page.tsx`. Trang này chỉ đóng vai trò là vỏ bọc container và responsive:
```tsx
// src/pages/product/ProductListPage.tsx
import Container from '@mui/material/Container';
import { usePreferencesStore } from '@/store';
import { ProductListView } from '@/sections/product';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  const themeCompact = usePreferencesStore((state) => state.themeCompact);

  return (
    <Container maxWidth={themeCompact ? 'xl' : false}>
      <ProductListView />
    </Container>
  );
}
```

## Bước 4: Đăng ký Route tại `src/router/routes-config.ts`
Thêm route vào mảng `staticRoutesConfig`:
1. `id`: Tên duy nhất, định dạng `kebab-case` (ví dụ: `'product-list'`).
2. `title`: Tên tiếng Việt hiển thị trên thanh menu (ví dụ: `'Danh sách sản phẩm'`).
3. `path`: URL tương đối (ví dụ: `'product/list'`).
4. `icon`: Chọn icon Solar từ hằng số `ICONS`.
5. `element`: Dynamic lazy load qua `() => import('@/pages/product/ProductListPage')`.

```ts
{
  id: 'product-list',
  title: 'Danh sách sản phẩm',
  path: 'product/list',
  icon: ICONS.product,
  element: () => import('@/pages/product/ProductListPage'),
}
```
Sau khi hoàn thành, route và menu sidebar sẽ tự động đồng bộ.
