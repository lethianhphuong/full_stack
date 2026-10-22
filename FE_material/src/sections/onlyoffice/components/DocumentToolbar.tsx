import React from 'react';
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Iconify } from '@/components';
import type { SortOptionValue, ViewMode } from '../types/document.types';
import { SORT_OPTIONS, ACTION_ICONS } from '../constants/document.constants';

export interface DocumentToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  sortBy: SortOptionValue;
  onSortChange: (value: SortOptionValue) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ p: 2.5 }}
    >
      <TextField
        placeholder="Tìm kiếm theo tên tài liệu hoặc tên tệp..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{
          maxWidth: { md: 400 },
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={ACTION_ICONS.search} width={20} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClearSearch} aria-label="Xóa tìm kiếm">
                <Iconify icon={ACTION_ICONS.clear} width={16} />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="document-sort-label">Sắp xếp</InputLabel>
          <Select
            labelId="document-sort-label"
            value={sortBy}
            label="Sắp xếp"
            onChange={(e) => onSortChange(e.target.value as SortOptionValue)}
            sx={{ borderRadius: 1.5 }}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => {
            if (val) onViewModeChange(val);
          }}
          size="small"
          sx={{ borderRadius: 1.5 }}
          aria-label="Chế độ xem"
        >
          <ToggleButton value="table" title="Dạng bảng" aria-label="Dạng bảng">
            <Iconify icon={ACTION_ICONS.table} width={18} />
          </ToggleButton>
          <ToggleButton value="grid" title="Dạng lưới thẻ" aria-label="Dạng lưới thẻ">
            <Iconify icon={ACTION_ICONS.grid} width={18} />
          </ToggleButton>
        </ToggleButtonGroup>

        <Tooltip title="Tải lại danh sách">
          <span>
            <IconButton
              onClick={onRefresh}
              disabled={loading}
              aria-label="Tải lại danh sách"
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1.5,
              }}
            >
              <Iconify
                icon={ACTION_ICONS.refresh}
                width={18}
                sx={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default DocumentToolbar;
