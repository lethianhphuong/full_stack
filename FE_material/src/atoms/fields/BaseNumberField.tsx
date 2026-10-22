import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import type { TextFieldProps } from '@mui/material/TextField';
import { Iconify } from '@/components';

// ----------------------------------------------------------------------

type Props = Omit<TextFieldProps, 'value' | 'onChange'> & {
  name: string;
  /** Giá trị nhỏ nhất */
  min?: number;
  /** Giá trị lớn nhất */
  max?: number;
  /** Bước tăng/giảm */
  step?: number;
  /** Hiện nút tăng/giảm */
  showControls?: boolean;
};

// ----------------------------------------------------------------------

/** Giới hạn giá trị trong khoảng min/max */
function clamp(value: number, min?: number, max?: number): number {
  let result = value;
  if (min != null && result < min) result = min;
  if (max != null && result > max) result = max;
  return result;
}

/**
 * Number field — tương đương ProFormDigit của Ant Design Pro.
 * Chặn nhập ký tự không phải số, giá trị lưu dạng number | null.
 *
 * @example
 * <BaseNumberField name="age" label="Tuổi" min={0} max={150} showControls />
 */
export default function BaseNumberField({
  name,
  helperText,
  min,
  max,
  step = 1,
  showControls,
  InputProps,
  onKeyDown,
  size = 'small',
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field.value ?? '';

        const handleChange = (raw: string) => {
          // Chỉ giữ số, dấu trừ và dấu chấm
          const sanitized = raw.replace(/[^0-9.-]/g, '');
          if (sanitized === '' || sanitized === '-') {
            field.onChange(sanitized === '' ? null : sanitized);
            return;
          }
          const parsed = Number(sanitized);
          field.onChange(Number.isNaN(parsed) ? null : parsed);
        };

        const stepValue = (direction: 1 | -1) => {
          const current = typeof field.value === 'number' ? field.value : 0;
          field.onChange(clamp(current + direction * step, min, max));
        };

        return (
          <TextField
            {...field}
            fullWidth
            size={size}
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={(event) => {
              // Chặn ký tự chữ khi gõ (cho phép phím điều hướng, xóa, copy...)
              const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
              if (
                !allowed.includes(event.key) &&
                !/^[0-9.-]$/.test(event.key) &&
                !(event.ctrlKey || event.metaKey)
              ) {
                event.preventDefault();
              }
              // Chặn mũi tên lên/xuống mặc định, dùng cho step
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                stepValue(1);
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                stepValue(-1);
              }
              onKeyDown?.(event);
            }}
            error={!!error}
            helperText={error?.message ?? helperText}
            InputProps={{
              endAdornment: showControls ? (
                <InputAdornment position="end" sx={{ mr: -0.5 }}>
                  <IconButton size="small" onClick={() => stepValue(-1)} disabled={other.disabled} aria-label="Giảm">
                    <Iconify icon="solar:minus-square-bold" width={18} />
                  </IconButton>
                  <IconButton size="small" onClick={() => stepValue(1)} disabled={other.disabled} aria-label="Tăng">
                    <Iconify icon="solar:add-square-bold" width={18} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
              ...InputProps,
            }}
            {...other}
          />
        );
      }}
    />
  );
}
