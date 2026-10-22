import type { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import type { BaseOption, ValueEnum } from './shared';
import { normalizeOptions, useAsyncOptions } from './shared';

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
  placeholder?: string;
  /** Mảng options hoặc valueEnum (chế độ tĩnh) */
  options?: BaseOption[] | [string | number, string][];
  valueEnum?: ValueEnum;
  /** Fetch options từ API (chế độ async) */
  request?: (params?: Record<string, unknown>) => Promise<BaseOption[]>;
  /** Tham số truyền vào request */
  params?: Record<string, unknown>;
  /** Chọn được nhiều giá trị */
  multiple?: boolean;
  /** Nhập tự do — chế độ tags */
  freeSolo?: boolean;
  /** Tùy biến nội dung mỗi item */
  renderOption?: (option: BaseOption) => ReactNode;
  /** Kích thước field */
  size?: 'small' | 'medium';
};

// ----------------------------------------------------------------------

/** Bỏ dấu tiếng Việt để so khớp tìm kiếm */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Autocomplete — tìm kiếm thật, hỗ trợ async, tags (freeSolo), multiple.
 *
 * @example
 * <BaseAutocomplete name="user" label="Người dùng" options={USERS} />
 * <BaseAutocomplete name="tags" label="Tags" multiple freeSolo options={[]} />
 * <BaseAutocomplete name="staff" label="Nhân viên" request={fetchStaff} multiple />
 */
export default function BaseAutocomplete({
  name,
  label,
  helperText,
  disabled,
  placeholder,
  options,
  valueEnum,
  request,
  params,
  multiple,
  freeSolo,
  renderOption,
  size = 'small',
}: Props) {
  const { control } = useFormContext();

  const staticOptions = normalizeOptions(options ?? valueEnum);
  const { options: asyncOptions, loading } = useAsyncOptions(request, { params, enabled: !!request });
  const allOptions = request ? asyncOptions : staticOptions;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Chuẩn hóa giá trị: value → BaseOption (hoặc string với freeSolo)
        const toOption = (value: unknown): BaseOption | string | null => {
          if (value == null || value === '') return null;
          if (typeof value === 'string' && freeSolo && !allOptions.some((o) => o.value === value)) {
            return value;
          }
          return allOptions.find((o) => o.value === value) ?? (typeof value === 'object' ? (value as BaseOption) : null);
        };

        const selected = multiple
          ? (Array.isArray(field.value) ? field.value : []).map(toOption).filter(Boolean)
          : toOption(field.value);

        return (
          <Autocomplete
            multiple={multiple}
            freeSolo={freeSolo}
            disabled={disabled}
            size={size}
            options={allOptions}
            value={selected as never}
            loading={loading}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return (option as BaseOption).label ?? '';
            }}
            isOptionEqualToValue={(option, value) => {
              if (typeof value === 'string') return (option as BaseOption).value === value;
              return (option as BaseOption).value === (value as BaseOption).value;
            }}
            filterOptions={(opts, state) =>
              opts.filter((option) => normalizeText(option.label).includes(normalizeText(state.inputValue)))
            }
            onChange={(_, newValue) => {
              if (multiple) {
                const values = (newValue as (BaseOption | string)[]).map((item) =>
                  typeof item === 'string' ? item : item.value
                );
                field.onChange(values);
              } else if (newValue == null) {
                field.onChange(freeSolo ? '' : null);
              } else {
                field.onChange(typeof newValue === 'string' ? newValue : (newValue as BaseOption).value);
              }
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  {renderOption ? renderOption(option as BaseOption) : (option as BaseOption).label}
                </li>
              );
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const tagLabel = typeof option === 'string' ? option : (option as BaseOption).label;
                return <Chip size="small" label={tagLabel} {...getTagProps({ index })} key={tagLabel} />;
              })
            }
            renderInput={(paramsInput) => (
              <TextField
                {...paramsInput}
                size={size}
                label={label}
                placeholder={multiple && Array.isArray(field.value) && field.value.length > 0 ? undefined : placeholder}
                error={!!error}
                helperText={error?.message ?? helperText}
                InputProps={{
                  ...paramsInput.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={18} /> : null}
                      {paramsInput.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        );
      }}
    />
  );
}
