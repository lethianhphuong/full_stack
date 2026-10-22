import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

/**
 * Date picker đơn giản dựa trên native input[type=date].
 * Giá trị lưu dạng string ISO "yyyy-MM-dd".
 */
export default function BaseDatePicker({
  name,
  helperText,
  size = 'small',
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="date"
          fullWidth
          size={size}
          value={field.value ?? ''}
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={{ inputLabel: { shrink: true } }}
          {...other}
        />
      )}
    />
  );
}
