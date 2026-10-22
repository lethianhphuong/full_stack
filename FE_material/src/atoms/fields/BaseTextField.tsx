import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { TextFieldProps } from '@mui/material/TextField';
import { ClearAdornment } from './shared';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  /** Hiện nút xóa giá trị */
  allowClear?: boolean;
  /** Giới hạn ký tự + hiển thị bộ đếm (VD: 12/255) */
  maxLength?: number;
};

/**
 * Text field chuẩn — tương đương ProFormText của Ant Design Pro.
 *
 * @example
 * <BaseTextField name="email" label="Email" allowClear />
 * <BaseTextField name="bio" label="Giới thiệu" maxLength={255} />
 */
export default function BaseTextField({
  name,
  helperText,
  allowClear,
  maxLength,
  inputProps,
  InputProps,
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
        const hasValue = String(value).length > 0;
        const counter = maxLength ? `${String(value).length}/${maxLength}` : null;

        return (
          <Box>
            <TextField
              {...field}
              fullWidth
              size={size}
              value={value}
              error={!!error}
              helperText={error?.message ?? helperText}
              inputProps={{ maxLength, ...inputProps }}
              InputProps={{
                endAdornment: allowClear ? (
                  <ClearAdornment
                    visible={hasValue && !other.disabled && !InputProps?.readOnly}
                    disabled={other.disabled}
                    onClear={() => field.onChange('')}
                  />
                ) : undefined,
                ...InputProps,
              }}
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
