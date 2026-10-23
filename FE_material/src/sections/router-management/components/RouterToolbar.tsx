import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';
import type { FilterState, SubheaderSection } from '../types';

interface RouterToolbarProps {
  filters: FilterState;
  sections: SubheaderSection[];
  onSearchChange: (val: string) => void;
  onSubheaderChange: (val: string) => void;
  onReset: () => void;
  onAdd: () => void;
  onResetConfig: () => void;
}

export default function RouterToolbar({
  filters,
  sections,
  onSearchChange,
  onSubheaderChange,
  onReset,
  onAdd,
  onResetConfig,
}: RouterToolbarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
        backgroundColor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Search Input */}
      <TextField
        size="small"
        placeholder="Tìm theo tiêu đề, ID hoặc đường dẫn..."
        value={filters.search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          flex: 1,
          minWidth: { xs: 260, sm: 320, md: 380 },
          '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
            backgroundColor: alpha(theme.palette.action.hover, 0.45),
            '& fieldset': {
              borderColor: alpha(theme.palette.grey[500], 0.2),
            },
            '&:hover fieldset': {
              borderColor: alpha(theme.palette.grey[500], 0.4),
            },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:magnifer-linear" width={18} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
        {/* Subheader Filter */}
        <Select
          size="small"
          value={filters.subheader}
          onChange={(e) => onSubheaderChange(e.target.value)}
          displayEmpty
          sx={{
            minWidth: 190,
            borderRadius: 1.5,
            backgroundColor: alpha(theme.palette.action.hover, 0.45),
            '& fieldset': {
              borderColor: alpha(theme.palette.grey[500], 0.2),
            },
            fontSize: 13,
          }}
          startAdornment={
            <InputAdornment position="start" sx={{ mr: 0.5 }}>
              <Iconify icon="solar:bookmark-square-minimalistic-linear" width={18} sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          }
        >
          <MenuItem value="all">Nhóm Subheader: Tất cả</MenuItem>
          {sections.map((section) => (
            <MenuItem key={section.id} value={section.id}>
              {section.title}
            </MenuItem>
          ))}
        </Select>

        {/* Reset Button */}
        <Button
          variant="text"
          size="small"
          onClick={onReset}
          startIcon={<Iconify icon="solar:restart-bold" width={16} />}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: 13,
            '&:hover': {
              color: 'text.primary',
              backgroundColor: alpha(theme.palette.grey[500], 0.08),
            },
          }}
        >
          Đặt lại
        </Button>
        <Button size="small" color="warning" variant="outlined" onClick={onResetConfig} startIcon={<Iconify icon="solar:refresh-circle-bold-duotone" width={18} />}>Khôi phục gốc</Button>
        <Button size="small" variant="contained" onClick={onAdd} startIcon={<Iconify icon="solar:add-circle-bold-duotone" width={18} />}>Thêm route</Button>
      </Stack>
    </Box>
  );
}
