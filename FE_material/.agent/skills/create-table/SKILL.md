---
name: create-table
description: Hướng dẫn quy trình tạo Bảng dữ liệu chuẩn bằng DataTable wrapper (Material React Table) tích hợp sẵn trong dự án.
---

# Quy trình tạo Bảng dữ liệu (DataTable) trong dự án FE_material

Dự án sử dụng component `DataTable` đặt tại `@/atoms/data-table` (được wrap từ `material-react-table`, đã tích hợp sẵn tiếng Việt, style chuẩn Minimals và đầy đủ tính năng miễn phí).

## 1. Khai báo Kiểu dữ liệu (Row Data)
```ts
export type ProductRow = {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
};
```

## 2. Định nghĩa danh sách Cột (`MRT_ColumnDef<T>[]`)
Sử dụng `useMemo` để định nghĩa cột và các hàm render tùy biến:
```tsx
import { useMemo } from 'react';
import type { MRT_ColumnDef } from '@/atoms';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Iconify from '@/components/iconify';

export function useProductColumns(onEdit: (id: string) => void, onDelete: (id: string) => void) {
  return useMemo<MRT_ColumnDef<ProductRow>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã SP',
        size: 100,
      },
      {
        accessorKey: 'name',
        header: 'Tên sản phẩm',
        size: 220,
      },
      {
        accessorKey: 'price',
        header: 'Giá',
        size: 140,
        Cell: ({ cell }) => `${(cell.getValue<number>() || 0).toLocaleString('vi-VN')} ₫`,
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 140,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const isActive = status === 'active';
          return (
            <Chip
              label={isActive ? 'Đang bán' : 'Tạm dừng'}
              color={isActive ? 'success' : 'default'}
              size="small"
              variant="soft"
            />
          );
        },
      },
      {
        id: 'actions',
        header: 'Hành động',
        size: 100,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Chỉnh sửa">
              <IconButton size="small" onClick={() => onEdit(row.original.id)}>
                <Iconify icon="solar:pen-bold" width={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton size="small" color="error" onClick={() => onDelete(row.original.id)}>
                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onEdit, onDelete]
  );
}
```

## 3. Nhúng component `DataTable` vào Section View
```tsx
import Card from '@mui/material/Card';
import { DataTable } from '@/atoms';

export default function ProductTableSection({ data }: { data: ProductRow[] }) {
  const columns = useProductColumns(
    (id) => console.log('Edit', id),
    (id) => console.log('Delete', id)
  );

  return (
    <Card>
      <DataTable
        columns={columns}
        data={data}
        enableRowSelection       // Bật checkbox chọn dòng
        enableColumnPinning      // Ghim cột
        enableColumnResizing     // Co giãn độ rộng cột
        enableExport             // Nút xuất CSV
        enableSorting            // Bật sắp xếp
        enableFilters            // Bật bộ lọc
      />
    </Card>
  );
}
```

## Lưu ý quan trọng
- Luôn import `DataTable` và `type MRT_ColumnDef` từ `@/atoms` hoặc `@/atoms/data-table`.
- Không tự viết lại pagination, sorting hay search thủ công vì `DataTable` đã có sẵn.
- Nếu dữ liệu lớn hoặc cần phân trang từ Server, truyền props điều khiển pagination của MRT.
