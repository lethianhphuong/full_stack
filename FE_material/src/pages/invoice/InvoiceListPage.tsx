import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TablePagination from "@mui/material/TablePagination";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import { alpha, useTheme } from "@mui/material/styles";
import Iconify from "@/components/iconify";

// ----------------------------------------------------------------------

type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: {
    name: string;
    avatar?: string;
  };
  createDate: Date;
  dueDate: Date;
  amount: number;
  sent: number;
  status: InvoiceStatus;
};

// Mock data
const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-19919",
    customer: { name: "Amiah Pruitt" },
    createDate: new Date(2026, 2, 17, 14, 34),
    dueDate: new Date(2026, 4, 10, 9, 34),
    amount: 2331.63,
    sent: 9,
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-19918",
    customer: { name: "Ariana Lang" },
    createDate: new Date(2026, 2, 18, 14, 34),
    dueDate: new Date(2026, 4, 9, 8, 34),
    amount: 2372.93,
    sent: 4,
    status: "overdue",
  },
  {
    id: "3",
    invoiceNumber: "INV-19917",
    customer: { name: "Lawson Bass" },
    createDate: new Date(2026, 2, 19, 14, 34),
    dueDate: new Date(2026, 4, 8, 7, 34),
    amount: 2283.97,
    sent: 9,
    status: "paid",
  },
  {
    id: "4",
    invoiceNumber: "INV-19916",
    customer: { name: "Selina Boyer" },
    createDate: new Date(2026, 2, 20, 14, 34),
    dueDate: new Date(2026, 4, 7, 6, 34),
    amount: 2251.84,
    sent: 8,
    status: "pending",
  },
  {
    id: "5",
    invoiceNumber: "INV-19915",
    customer: { name: "Angelique Morse" },
    createDate: new Date(2026, 2, 21, 14, 34),
    dueDate: new Date(2026, 4, 6, 5, 34),
    amount: 2343.51,
    sent: 11,
    status: "paid",
  },
  {
    id: "6",
    invoiceNumber: "INV-19914",
    customer: { name: "Jaydon Frankie" },
    createDate: new Date(2026, 2, 22, 14, 34),
    dueDate: new Date(2026, 4, 5, 4, 34),
    amount: 1987.45,
    sent: 3,
    status: "draft",
  },
  {
    id: "7",
    invoiceNumber: "INV-19913",
    customer: { name: "Deja Brady" },
    createDate: new Date(2026, 2, 23, 14, 34),
    dueDate: new Date(2026, 4, 4, 3, 34),
    amount: 3124.67,
    sent: 7,
    status: "paid",
  },
  {
    id: "8",
    invoiceNumber: "INV-19912",
    customer: { name: "Harrison Stein" },
    createDate: new Date(2026, 2, 24, 14, 34),
    dueDate: new Date(2026, 4, 3, 2, 34),
    amount: 1567.23,
    sent: 5,
    status: "pending",
  },
  {
    id: "9",
    invoiceNumber: "INV-19911",
    customer: { name: "Reece Chung" },
    createDate: new Date(2026, 2, 25, 14, 34),
    dueDate: new Date(2026, 4, 2, 1, 34),
    amount: 2789.12,
    sent: 6,
    status: "paid",
  },
  {
    id: "10",
    invoiceNumber: "INV-19910",
    customer: { name: "Lainey Davidson" },
    createDate: new Date(2026, 2, 26, 14, 34),
    dueDate: new Date(2026, 4, 1, 0, 34),
    amount: 1423.89,
    sent: 2,
    status: "draft",
  },
];

const SUMMARY_DATA = [
  {
    label: "Total",
    count: 20,
    amount: 46218.04,
    icon: "solar:bill-list-bold",
    color: "#00B8D9",
    bgColor: "#CAFDF5",
  },
  {
    label: "Paid",
    count: 10,
    amount: 23110.23,
    icon: "solar:check-circle-bold",
    color: "#00AB55",
    bgColor: "#C8FAD6",
  },
  {
    label: "Pending",
    count: 6,
    amount: 13825.05,
    icon: "solar:clock-circle-bold",
    color: "#FFAB00",
    bgColor: "#FFF5CC",
  },
  {
    label: "Overdue",
    count: 2,
    amount: 4655.63,
    icon: "solar:bell-bing-bold",
    color: "#FF5630",
    bgColor: "#FFE9D5",
  },
  {
    label: "Draft",
    count: 2,
    amount: 4627.13,
    icon: "solar:file-text-bold",
    color: "#637381",
    bgColor: "#F4F6F8",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả", count: 20 },
  { value: "paid", label: "Đã thanh toán", count: 10 },
  { value: "pending", label: "Chờ xử lý", count: 6 },
  { value: "overdue", label: "Quá hạn", count: 2 },
  { value: "draft", label: "Nháp", count: 2 },
];

const SERVICE_OPTIONS = [
  { value: "all", label: "Dịch vụ" },
  { value: "design", label: "Thiết kế" },
  { value: "development", label: "Phát triển" },
  { value: "marketing", label: "Marketing" },
];

// ----------------------------------------------------------------------

function getStatusConfig(status: InvoiceStatus): {
  label: string;
  color: "success" | "warning" | "error" | "default";
} {
  const config: Record<
    InvoiceStatus,
    { label: string; color: "success" | "warning" | "error" | "default" }
  > = {
    paid: { label: "Paid", color: "success" },
    pending: { label: "Pending", color: "warning" },
    overdue: { label: "Overdue", color: "error" },
    draft: { label: "Draft", color: "default" },
  };
  return config[status];
}

function formatCurrency(amount: number): string {
  return (
    new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " đ"
  );
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = `Th0${date.getMonth() + 1}`;
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "#00AB55",
    "#00B8D9",
    "#FFAB00",
    "#FF5630",
    "#7635DC",
    "#2065D1",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleViewDetails = (invoiceId: string) => {
    navigate(`/invoice/list/details?id=${invoiceId}`);
  };

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter((invoice) => {
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      const matchesSearch =
        invoice.customer.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery]);

  const paginatedInvoices = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredInvoices.slice(start, start + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(paginatedInvoices.map((invoice) => invoice.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSelected = (id: string) => selected.includes(id);
  const isAllSelected =
    paginatedInvoices.length > 0 &&
    selected.length === paginatedInvoices.length;

  return (
    <Container maxWidth="xl" sx={{ pb: 5 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Danh sách</Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mt: 0.5 }}
          >
            <Typography variant="body2" color="text.secondary">
              Trang chủ
            </Typography>
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                bgcolor: "text.disabled",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Hóa đơn
            </Typography>
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                bgcolor: "text.disabled",
              }}
            />
            <Typography variant="body2">Danh sách</Typography>
          </Stack>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Thêm hóa đơn
        </Button>
      </Stack>

      {/* Summary Cards - Single Card with 5 items */}
      <Card sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          divider={
            <Box
              sx={{
                borderStyle: "dashed",
                borderColor: alpha(theme.palette.grey[500], 0.24),
                borderWidth: { xs: "0 0 1px 0", md: "0 1px 0 0" },
              }}
            />
          }
        >
          {SUMMARY_DATA.map((item) => (
            <Stack
              key={item.label}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                flex: 1,
                p: 3,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: item.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon={item.icon}
                  width={24}
                  sx={{ color: item.color }}
                />
              </Box>
              <Box>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.count} invoices
                </Typography>
                <Typography variant="subtitle2" sx={{ color: item.color }}>
                  {formatCurrency(item.amount)}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Card>

      {/* Main Card */}
      <Card>
        {/* Tabs */}
        <Tabs
          value={statusFilter}
          onChange={(_, value) => setStatusFilter(value)}
          sx={{
            px: 2.5,
            borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>{tab.label}</span>
                  <Chip
                    label={tab.count}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      fontSize: "0.75rem",
                      bgcolor:
                        statusFilter === tab.value
                          ? "text.primary"
                          : alpha(theme.palette.grey[500], 0.16),
                      color:
                        statusFilter === tab.value
                          ? "background.paper"
                          : "text.secondary",
                    }}
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>

        {/* Filters */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            p: 2.5,
            borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Dịch vụ</InputLabel>
            <Select
              value={serviceFilter}
              label="Dịch vụ"
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              {SERVICE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="Ngày bắt đầu"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 140 }}
          />

          <TextField
            size="small"
            type="date"
            label="Ngày kết thúc"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 140 }}
          />

          <TextField
            fullWidth
            size="small"
            placeholder="Tìm khách hàng hoặc mã hóa đơn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <IconButton>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>

        {/* Table Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "48px 1fr 150px 150px 120px 80px 100px 48px",
            alignItems: "center",
            px: 2,
            py: 1.5,
            bgcolor: alpha(theme.palette.grey[500], 0.08),
            borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
          }}
        >
          <Checkbox
            checked={isAllSelected}
            indeterminate={
              selected.length > 0 && selected.length < paginatedInvoices.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <Typography variant="subtitle2" color="text.secondary">
            Khách hàng
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Ngày tạo
            </Typography>
            <Iconify
              icon="eva:arrow-upward-fill"
              width={16}
              sx={{ color: "text.secondary" }}
            />
          </Stack>
          <Typography variant="subtitle2" color="text.secondary">
            Hạn thanh toán
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Số tiền
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Đã gửi
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Trạng thái
          </Typography>
          <Box />
        </Box>

        {/* Table Body */}
        {paginatedInvoices.map((invoice) => {
          const statusConfig = getStatusConfig(invoice.status);
          const avatarColor = getAvatarColor(invoice.customer.name);

          return (
            <Box
              key={invoice.id}
              onClick={() => handleViewDetails(invoice.id)}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "48px 1fr 150px 150px 120px 80px 100px 48px",
                alignItems: "center",
                px: 2,
                py: dense ? 1 : 2,
                cursor: "pointer",
                borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                "&:hover": {
                  bgcolor: alpha(theme.palette.grey[500], 0.04),
                },
              }}
            >
              <Checkbox
                checked={isSelected(invoice.id)}
                onChange={() => handleSelectOne(invoice.id)}
                onClick={(e) => e.stopPropagation()}
              />

              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40 }}>
                  {getInitials(invoice.customer.name)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {invoice.customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invoice.invoiceNumber}
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="body2">
                  {formatDate(invoice.createDate)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(invoice.createDate)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2">
                  {formatDate(invoice.dueDate)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(invoice.dueDate)}
                </Typography>
              </Box>

              <Typography variant="body2">
                {formatCurrency(invoice.amount)}
              </Typography>

              <Typography variant="body2" sx={{ textAlign: "center" }}>
                {invoice.sent}
              </Typography>

              <Chip
                label={statusConfig.label}
                color={statusConfig.color}
                size="small"
                variant="soft"
              />

              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  onClick={() => handleViewDetails(invoice.id)}
                >
                  <Iconify icon="solar:eye-bold" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}

        {/* Footer */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1.5 }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={dense}
                onChange={(e) => setDense(e.target.checked)}
              />
            }
            label="Thu gọn"
          />

          <TablePagination
            component="div"
            count={filteredInvoices.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} trong ${count}`
            }
          />
        </Stack>
      </Card>
    </Container>
  );
}
