import { useMemo } from "react";
import {
  MaterialReactTable,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
  type MRT_RowData,
  type MRT_TableOptions,
} from "material-react-table";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { MRT_Localization_VI } from "./localization-vi";
import type { DataTableProps } from "./types";

// ----------------------------------------------------------------------
// DataTable Component
// A wrapper around Material React Table with Vietnamese localization
// and Minimals-style theming
// ----------------------------------------------------------------------

export function DataTable<TData extends MRT_RowData>({
  // Props cơ bản
  columns, // Định nghĩa cột bảng
  data, // Dữ liệu hàng bảng
  loading = false, // Trạng thái loading
  dense = false, // Chế độ compact (tight)
  striped = false, // Alternating row colors
  stickyHeader = true, // Header cố định khi scroll
  height = "auto", // Chiều cao bảng
  emptyMessage, // Thông báo empty state
  // MRT Options with defaults
  enableColumnActions = true, // Show column menu
  enableColumnFilters = true, // Bật filter từng cột
  enablePagination = true, // Phân trang
  enableSorting = true, // Sắp xếp cột
  enableBottomToolbar = true, // Toolbar dưới (pagination)
  enableTopToolbar, // Tự hiện khi có tìm kiếm hoặc action tùy biến
  enableRowSelection = false, // Checkbox chọn hàng (mặc định tắt)
  enableColumnPinning = false, // Pin cột (mặc định tắt)
  enableColumnResizing = false, // Resize cột (mặc định tắt)
  enableGlobalFilter = true, // Tìm kiếm toàn cục
  enableDensityToggle = true, // Nút đổi mật độ (compact/comfortable)
  enableFullScreenToggle = true, // Nút fullscreen
  enableHiding = true, // Ẩn/hiện cột
  positionToolbarAlertBanner = "bottom", // Vị trí thông báo selection
  paginationDisplayMode = "pages", // Hiển thị số trang
  ...rest // Props khác, spread vào tableOptions
}: DataTableProps<TData>) {
  const theme = useTheme(); // Lấy theme Material-UI để styling

  // Memoize columns tránh re-render không cần thiết khi parent re-render
  const memoizedColumns = useMemo(() => columns, [columns]);

  // Memoize localization - merge Vietnamese translations + custom empty message
  const localization = useMemo(
    () => ({
      ...MRT_Localization_VI, // Expand tiếng Việt localization
      noRecordsToDisplay:
        emptyMessage || MRT_Localization_VI.noRecordsToDisplay,
    }),
    [emptyMessage],
  );

  // MRT Table options - Config và styling cho Material React Table
  const tableOptions: MRT_TableOptions<TData> = {
    columns: memoizedColumns,
    data,
    // State - Trạng thái bảng
    state: {
      isLoading: loading, // Show loading progress bars
      showProgressBars: loading,
      density: dense ? "compact" : "comfortable", // Đổi mật độ dựa trên prop
      ...rest.state, // Merge state từ props khác
    },
    // Features - Bật/tắt tính năng
    enableColumnActions,
    enableColumnFilters,
    enablePagination,
    enableSorting,
    enableBottomToolbar,
    enableTopToolbar: enableTopToolbar ?? Boolean(
      enableGlobalFilter || rest.renderTopToolbarCustomActions || rest.renderToolbarInternalActions || rest.renderTopToolbar
    ),
    enableRowSelection,
    enableColumnPinning,
    enableColumnResizing,
    enableGlobalFilter,
    enableDensityToggle,
    enableFullScreenToggle,
    enableHiding,
    enableStickyHeader: stickyHeader,
    // Display - Cấu hình hiển thị
    positionToolbarAlertBanner,
    paginationDisplayMode,
    // Localization - Ngôn ngữ
    localization: localization as MRT_TableOptions<TData>["localization"],
    // Styling - Custom theme Minimals
    muiTableContainerProps: {
      sx: {
        maxHeight: height !== "auto" ? height : undefined, // Set chiều cao max
      },
    },
    muiTablePaperProps: {
      elevation: 0, // Không shadow
      sx: {
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`, // Border nhạt
      },
    },
    muiTableHeadCellProps: {
      sx: {
        bgcolor: alpha(theme.palette.grey[500], 0.08), // Header background
        fontWeight: 600,
        "& .Mui-TableHeadCell-Content": {
          justifyContent: "space-between", // Space between icon & text
        },
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        // Striped pattern - màu xen kẽ nếu striped=true
        bgcolor:
          striped && row.index % 2 === 1
            ? alpha(theme.palette.grey[500], 0.04)
            : undefined,
        "&:hover": {
          bgcolor: alpha(theme.palette.grey[500], 0.08), // Hover effect
        },
      },
    }),
    muiTableBodyCellProps: {
      sx: {
        borderBottom: `1px dashed ${theme.palette.divider}`, // Dashed line between rows
      },
    },
    muiBottomToolbarProps: {
      sx: {
        borderTop: `1px dashed ${theme.palette.divider}`,
      },
    },
    muiTopToolbarProps: {
      sx: {
        "& .MuiBox-root": {
          padding: theme.spacing(1),
        },
      },
    },
    muiSearchTextFieldProps: {
      size: "small",
      placeholder: "Tìm kiếm...", // Vietnamese search placeholder
      variant: "outlined",
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 25, 50, 100],
      showRowsPerPage: true,
    },
    // Chỉ giữ thao tác tìm kiếm; ẩn các nút lọc/cột/mật độ/toàn màn hình mặc định.
    renderToolbarInternalActions: ({ table }) =>
      enableGlobalFilter ? <MRT_ToggleGlobalFilterButton table={table} /> : null,
    // Column resize mode
    columnResizeMode: "onChange", // Resize realtime (không cần confirm)
    // Spread remaining options
    ...rest, // Merge các MRT options khác từ props
  };

  const table = useMaterialReactTable(tableOptions);

  return (
    <Box
      sx={{
        "& .MuiTableContainer-root": {
          borderRadius: 0,
        },
      }}
    >
      <MaterialReactTable table={table} />
    </Box>
  );
}

export default DataTable;
