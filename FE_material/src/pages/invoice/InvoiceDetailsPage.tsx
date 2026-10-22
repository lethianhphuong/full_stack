import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

type InvoiceItem = {
  id: number;
  title: string;
  description: string;
  quantity: number;
  price: number;
};

type InvoiceData = {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  createDate: string;
  dueDate: string;
  invoiceFrom: {
    name: string;
    address: string;
    phone: string;
  };
  invoiceTo: {
    name: string;
    address: string;
    phone: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
};

// Mock invoice data
const INVOICE_DATA: InvoiceData = {
  id: '1',
  invoiceNumber: 'INV-19919',
  status: 'paid',
  createDate: '17 Th03 2026',
  dueDate: '10 Th05 2026',
  invoiceFrom: {
    name: 'Ariana Lang',
    address: '4642 Demetris Lane Suite 407 - Edmond, AZ / 60888',
    phone: '+54 11 1234-5678',
  },
  invoiceTo: {
    name: 'Amiah Pruitt',
    address: '74794 Asha Flat Suite 890 - Lancaster, OR / 13466',
    phone: '+64 9 123 4567',
  },
  items: [
    {
      id: 1,
      title: 'Urban Explorer Sneakers',
      description: 'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
      quantity: 11,
      price: 83.74,
    },
    {
      id: 2,
      title: 'Classic Leather Loafers',
      description: 'She eagerly opened the gift, her eyes sparkling with excitement.',
      quantity: 10,
      price: 97.14,
    },
    {
      id: 3,
      title: 'Mountain Trekking Boots',
      description: 'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
      quantity: 7,
      price: 68.71,
    },
    {
      id: 4,
      title: 'Elegance Stiletto Heels',
      description: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
      quantity: 8,
      price: 85.21,
    },
    {
      id: 5,
      title: 'Comfy Running Shoes',
      description: 'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
      quantity: 9,
      price: 52.17,
    },
  ],
  subtotal: 2331.63,
  discount: 0,
  taxes: 233.16,
  total: 2564.79,
};

const STATUS_OPTIONS: { value: InvoiceStatus; label: string; color: 'success' | 'warning' | 'error' | 'default' }[] = [
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'overdue', label: 'Overdue', color: 'error' },
  { value: 'draft', label: 'Draft', color: 'default' },
];

const TOOLBAR_ACTIONS = [
  { icon: 'solar:pen-bold', tooltip: 'Chỉnh sửa' },
  { icon: 'solar:eye-bold', tooltip: 'Xem' },
  { icon: 'solar:cloud-download-bold', tooltip: 'Tải xuống' },
  { icon: 'solar:printer-minimalistic-bold', tooltip: 'In' },
  { icon: 'solar:plain-bold', tooltip: 'Gửi' },
  { icon: 'solar:share-bold', tooltip: 'Chia sẻ' },
];

// ----------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' đ';
}

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const theme = useTheme();
  const [status, setStatus] = useState<InvoiceStatus>(INVOICE_DATA.status);

  const statusConfig = STATUS_OPTIONS.find((s) => s.value === status)!;

  return (
    <Container maxWidth="lg" sx={{ pb: 5 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton onClick={() => window.history.back()}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <Typography variant="h4">{INVOICE_DATA.invoiceNumber}</Typography>
      </Stack>

      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, pl: 5 }}>
        <Typography variant="body2" color="text.secondary">Dashboard</Typography>
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
        <Typography variant="body2" color="text.secondary">Invoice</Typography>
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
        <Typography variant="body2">{INVOICE_DATA.invoiceNumber}</Typography>
      </Stack>

      {/* Toolbar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1}>
          {TOOLBAR_ACTIONS.map((action) => (
            <IconButton key={action.icon} title={action.tooltip}>
              <Iconify icon={action.icon} />
            </IconButton>
          ))}
        </Stack>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            renderValue={(value) => {
              const config = STATUS_OPTIONS.find((s) => s.value === value)!;
              return (
                <Chip
                  label={config.label}
                  color={config.color}
                  size="small"
                  variant="soft"
                />
              );
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Invoice Card */}
      <Card sx={{ p: 5 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 5 }}>
          {/* Logo */}
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 512 512" fill="none">
              <path
                fill="#00AB55"
                d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 64c79.5 0 144 64.5 144 144s-64.5 144-144 144-144-64.5-144-144S176.5 112 256 112z"
              />
              <path
                fill="#00AB55"
                d="M256 176c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z"
              />
            </svg>
          </Box>

          {/* Status & Invoice Number */}
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              variant="soft"
              sx={{ mb: 1 }}
            />
            <Typography variant="h5">{INVOICE_DATA.invoiceNumber}</Typography>
          </Box>
        </Stack>

        {/* From / To */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={5}
          sx={{ mb: 5 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Invoice from
            </Typography>
            <Typography variant="subtitle2">{INVOICE_DATA.invoiceFrom.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {INVOICE_DATA.invoiceFrom.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {INVOICE_DATA.invoiceFrom.phone}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Invoice to
            </Typography>
            <Typography variant="subtitle2">{INVOICE_DATA.invoiceTo.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {INVOICE_DATA.invoiceTo.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {INVOICE_DATA.invoiceTo.phone}
            </Typography>
          </Box>
        </Stack>

        {/* Dates */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={5}
          sx={{ mb: 5 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Date create
            </Typography>
            <Typography variant="body2">{INVOICE_DATA.createDate}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Due date
            </Typography>
            <Typography variant="body2">{INVOICE_DATA.dueDate}</Typography>
          </Box>
        </Stack>

        {/* Items Table */}
        <Box sx={{ overflowX: 'auto' }}>
          {/* Table Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 80px 120px 120px',
              gap: 2,
              p: 2,
              bgcolor: alpha(theme.palette.grey[500], 0.08),
              borderRadius: 1,
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">#</Typography>
            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center' }}>Qty</Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'right' }}>Unit price</Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'right' }}>Total</Typography>
          </Box>

          {/* Table Body */}
          {INVOICE_DATA.items.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 80px 120px 120px',
                gap: 2,
                p: 2,
                borderBottom: index < INVOICE_DATA.items.length - 1
                  ? `1px dashed ${alpha(theme.palette.grey[500], 0.24)}`
                  : 'none',
              }}
            >
              <Typography variant="body2">{item.id}</Typography>
              <Box>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>{item.quantity}</Typography>
              <Typography variant="body2" sx={{ textAlign: 'right' }}>{formatCurrency(item.price)}</Typography>
              <Typography variant="body2" sx={{ textAlign: 'right' }}>
                {formatCurrency(item.quantity * item.price)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        {/* Summary */}
        <Stack direction="row" justifyContent="flex-end">
          <Stack spacing={2} sx={{ width: 280 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2">{formatCurrency(INVOICE_DATA.subtotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Discount</Typography>
              <Typography variant="body2" color="error.main">
                {INVOICE_DATA.discount > 0 ? `-${formatCurrency(INVOICE_DATA.discount)}` : '-'}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Taxes</Typography>
              <Typography variant="body2">{formatCurrency(INVOICE_DATA.taxes)}</Typography>
            </Stack>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1">{formatCurrency(INVOICE_DATA.total)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
