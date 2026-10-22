import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from '@/components';

// ----------------------------------------------------------------------

type Props = {
  /** Có hiển thị nút xóa không (đã tính sẵn điều kiện có giá trị) */
  visible: boolean;
  disabled?: boolean;
  onClear: () => void;
};

/**
 * Nút xóa giá trị (allowClear) dùng chung cho TextField / Select / Autocomplete.
 * Tự động ẩn khi visible=false (không có giá trị, disabled, readonly).
 */
export default function ClearAdornment({ visible, disabled, onClear }: Props) {
  if (!visible) return null;

  return (
    <InputAdornment position="end" sx={{ mr: -0.5 }}>
      <IconButton
        size="small"
        edge="end"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
        aria-label="Xóa giá trị"
      >
        <Iconify icon="solar:close-circle-bold" width={18} sx={{ color: 'text.disabled' }} />
      </IconButton>
    </InputAdornment>
  );
}
