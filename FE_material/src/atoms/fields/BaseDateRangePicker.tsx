import { Controller, useFormContext } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// ----------------------------------------------------------------------

export type DateRangeValue = {
  from: string; // ISO "yyyy-MM-dd"
  to: string;
};

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  /** Nhãn ô "Từ ngày" */
  fromLabel?: string;
  /** Nhãn ô "Đến ngày" */
  toLabel?: string;
  /** Kích thước field */
  size?: 'small' | 'medium';
};

/**
 * Date range picker — tự viết bằng 2 date input (DateRangePicker của MUI X là bản Pro mất phí).
 * Tự validate: ngày "từ" ≤ ngày "đến" (tự set minDate cho ô "đến").
 * Giá trị: { from: 'yyyy-MM-dd', to: 'yyyy-MM-dd' }
 *
 * @example
 * <BaseDateRangePicker name="period" label="Khoảng thời gian" />
 */
export default function BaseDateRangePicker({
  name,
  label,
  helperText,
  disabled,
  fromLabel = 'Từ ngày',
  toLabel = 'Đến ngày',
  size = 'small',
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value: DateRangeValue = field.value ?? { from: '', to: '' };

        const handleChange = (key: 'from' | 'to', date: string) => {
          const next = { ...value, [key]: date };
          // Đổi ngày "từ" lớn hơn ngày "đến" → tự xóa ngày "đến"
          if (key === 'from' && next.to && date && date > next.to) {
            next.to = '';
          }
          field.onChange(next);
        };

        return (
          <FormControl fullWidth disabled={disabled} error={!!error}>
            {label && <InputLabel shrink>{label}</InputLabel>}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: label ? 2 : 0 }}>
              <TextField
                type="date"
                fullWidth
                size={size}
                label={fromLabel}
                value={value.from ?? ''}
                onChange={(event) => handleChange('from', event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={disabled}
              />
              <TextField
                type="date"
                fullWidth
                size={size}
                label={toLabel}
                value={value.to ?? ''}
                onChange={(event) => handleChange('to', event.target.value)}
                inputProps={{ min: value.from || undefined }}
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={disabled}
              />
            </Stack>
            {(error?.message ?? helperText) && (
              <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}
