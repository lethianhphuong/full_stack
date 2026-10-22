import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  /** Giới hạn ký tự + hiển thị bộ đếm */
  maxLength?: number;
};

/**
 * Textarea — tương đương ProFormTextArea của Ant Design Pro.
 *
 * @example
 * <BaseTextArea name="note" label="Ghi chú" minRows={3} maxRows={6} maxLength={500} />
 */
export default function BaseTextArea({
  name,
  helperText,
  maxLength,
  minRows = 3,
  maxRows = 6,
  inputProps,
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
        const counter = maxLength ? `${String(value).length}/${maxLength}` : null;

        return (
          <Box>
            <TextField
              {...field}
              fullWidth
              multiline
              size={size}
              minRows={minRows}
              maxRows={maxRows}
              value={value}
              error={!!error}
              helperText={error?.message ?? helperText}
              inputProps={{ maxLength, ...inputProps }}
              {...other}
            />
            {counter && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  color: error ? 'error.main' : 'text.disabled',
                }}
              >
                {counter}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
}
