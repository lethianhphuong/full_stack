import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import numeral from 'numeral';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = Omit<TextFieldProps, 'value' | 'onChange'> & {
  name: string;
  /** Ký hiệu tiền tệ */
  currencySymbol?: string;
  /** Số chữ số thập phân (VND mặc định 0) */
  precision?: number;
};

// ----------------------------------------------------------------------

/**
 * Money field — tương đương ProFormMoney của Ant Design Pro.
 * Format hiển thị: 1.000.000 ₫ — giá trị lưu trong form là number.
 * Khi focus hiển thị số thô để dễ nhập, khi blur hiển thị formatted.
 *
 * @example
 * <BaseMoneyField name="price" label="Giá bán" />
 * <BaseMoneyField name="salary" label="Lương" currencySymbol="$" precision={2} />
 */
export default function BaseMoneyField({
  name,
  helperText,
  currencySymbol = '₫',
  precision = 0,
  InputProps,
  size = 'small',
  ...other
}: Props) {
  const { control } = useFormContext();
  const [focused, setFocused] = useState(false);

  const format = (value: number) =>
    numeral(value).format(`0,${precision > 0 ? '0'.repeat(precision) : '0'}`);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const rawValue = field.value;
        const displayValue =
          focused || rawValue == null || rawValue === ''
            ? rawValue ?? ''
            : format(Number(rawValue));

        return (
          <TextField
            {...field}
            fullWidth
            size={size}
            value={displayValue}
            onChange={(event) => {
              // Chỉ giữ số khi nhập
              const digits = event.target.value.replace(/[^0-9]/g, '');
              field.onChange(digits === '' ? null : Number(digits));
            }}
            onFocus={(event) => {
              setFocused(true);
              other.onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              field.onBlur();
              other.onBlur?.(event);
            }}
            inputProps={{ inputMode: 'numeric', ...other.inputProps }}
            error={!!error}
            helperText={error?.message ?? helperText}
            InputProps={{
              endAdornment: <InputAdornment position="end">{currencySymbol}</InputAdornment>,
              ...InputProps,
            }}
            {...other}
          />
        );
      }}
    />
  );
}
