import { useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataTable, type MRT_ColumnDef } from "@/atoms";
import { MOCK_PEOPLE_50, type Person } from "../mock-data";

// ----------------------------------------------------------------------
// Tab 1: Basic Table - Sorting, Filtering, Pagination
// ----------------------------------------------------------------------

export default function BasicTableDemo() {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Họ",
        size: 150,
      },
      {
        accessorKey: "lastName",
        header: "Tên",
        size: 100,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
      },
      {
        accessorKey: "age",
        header: "Tuổi",
        size: 80,
        filterVariant: "range-slider",
        muiFilterSliderProps: {
          min: 20,
          max: 65,
        },
      },
      {
        accessorKey: "department",
        header: "Phòng ban",
        size: 150,
        filterVariant: "select",
        filterSelectOptions: [
          "Kỹ thuật",
          "Marketing",
          "Bán hàng",
          "Nhân sự",
          "Tài chính",
          "Thiết kế",
          "Vận hành",
        ],
      },
      {
        accessorKey: "role",
        header: "Chức vụ",
        size: 150,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 120,
        filterVariant: "select",
        filterSelectOptions: [
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Ngừng hoạt động" },
          { value: "pending", label: "Chờ duyệt" },
        ],
        Cell: ({ cell }) => {
          const status = cell.getValue<Person["status"]>();
          const config = {
            active: { label: "Hoạt động", color: "success" as const },
            inactive: { label: "Ngừng hoạt động", color: "error" as const },
            pending: { label: "Chờ duyệt", color: "warning" as const },
          };
          return (
            <Chip
              label={config[status].label}
              color={config[status].color}
              size="small"
              variant="soft"
            />
          );
        },
      },
    ],
    [],
  );

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h6">Bảng cơ bản</Typography>
        <Typography variant="body2" color="text.secondary">
          Demo các tính năng cơ bản: Sắp xếp, Lọc, Phân trang, Tìm kiếm toàn cục
          sử dụng Material React Table với dữ liệu namtttttttttt
        </Typography>
      </Stack>

      <DataTable
        columns={columns}
        data={MOCK_PEOPLE_50}
        enablePagination={false}
        // enableColumnFilters
        // enableGlobalFilter
        // enableSorting
        // enablePagination
        // initialState={{
        //   showColumnFilters: true,
        //   pagination: { pageIndex: 0, pageSize: 10 },
        // }}
      />
    </Box>
  );
}
