import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import type { TextFieldProps } from '@mui/material/TextField';
import type { BaseOption, ValueEnum } from './shared';
import { normalizeOptions, getOptionLabel, ClearAdornment } from './shared';
import BaseAutocomplete from './BaseAutocomplete';

// ----------------------------------------------------------------------

type Props = Omit<TextFieldProps, 'children' | 'select'> & {
  name: string;
  /** Mảng options — truyền vào là render xong */
  options?: BaseOption[] | [string | number, string][];
  /** ValueEnum kiểu Ant Design Pro: { active: 'Hoạt động' } */
  valueEnum?: ValueEnum;
  /** Chọn được nhiều giá trị — render Chip */
  multiple?: boolean;
  /** Hiện nút xóa giá trị */
  allowClear?: boolean;
  /** Bật tìm kiếm trong dropdown — tự chuyển sang Autocomplete */
  showSearch?: boolean;
  /** Fetch options từ API (chế độ async) */
  request?: (params?: Record<string, unknown>) => Promise<BaseOption[]>;
  /** Tham số truyền vào request */
  params?: Record<string, unknown>;
  /** Tùy biến nội dung mỗi item (mặc định hiển thị option.label) */
  renderOption?: (option: BaseOption) => ReactNode;
  /** Placeholder khi chưa chọn giá trị */
  placeholder?: string;
  /** Fallback: tự render MenuItem thủ công qua children */
  children?: ReactNode;
};

// ----------------------------------------------------------------------

/**
 * Select kiểu Ant Design Pro: truyền `options` / `valueEnum` là dùng được ngay,
 * muốn tùy biến item thì dùng `renderOption`, cần tìm kiếm thì bật `showSearch`.
 *
 * @example
 * <BaseSelect name="role" label="Vai trò" options={ROLE_OPTIONS} />
 * <BaseSelect name="status" label="Trạng thái" valueEnum={{ active: 'Hoạt động' }} allowClear />
 * <BaseSelect name="users" label="Người dùng" options={USERS} multiple showSearch />
 */
export default function BaseSelect({
  name,
  options,
  valueEnum,
  multiple,
  allowClear,
  showSearch,
  request,
  params,
  renderOption,
  placeholder,
  helperText,
  children,
  SelectProps,
  InputLabelProps,
  size = 'small',
  ...other
}: Props) {
  const { control } = useFormContext();

  const normalized = normalizeOptions(options ?? valueEnum);

  // showSearch / async → chuyển sang Autocomplete, API bên ngoài giữ nguyên
  if (showSearch || request) {
    return (
      <BaseAutocomplete
        name={name}
        options={normalized}
        multiple={multiple}
        request={request}
        params={params}
        renderOption={renderOption}
        placeholder={placeholder}
        helperText={helperText}
        size={size}
        {...other}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field.value ?? (multiple ? [] : '');
        const hasValue = multiple ? Array.isArray(value) && value.length > 0 : value !== '';

        return (
          <TextField
            {...field}
            select
            fullWidth
            size={size}
            value={value}
            error={!!error}
            helperText={error?.message ?? helperText}
            InputLabelProps={{ shrink: !!placeholder || undefined, ...InputLabelProps }}
            SelectProps={{
              displayEmpty: !!placeholder,
              multiple,
              renderValue: multiple
                ? (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as (string | number)[]).map((v) => (
                        <Chip key={v} size="small" label={getOptionLabel(normalized, v)} />
                      ))}
                    </Box>
                  )
                : undefined,
              ...SelectProps,
            }}
            InputProps={{
              endAdornment: allowClear ? (
                <ClearAdornment
                  visible={hasValue && !other.disabled}
                  disabled={other.disabled}
                  onClear={() => field.onChange(multiple ? [] : '')}
                />
              ) : undefined,
            }}
            {...other}
            onChange={(e) => {
              field.onChange(e);
              other.onChange?.(e);
            }}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                {placeholder}
              </MenuItem>
            )}

            {normalized.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                {renderOption ? renderOption(option) : option.label}
              </MenuItem>
            ))}

            {children}
          </TextField>
        );
      }}
    />
  );
}
