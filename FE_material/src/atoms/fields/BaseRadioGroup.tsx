import { Controller, useFormContext } from 'react-hook-form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { BaseOption, ValueEnum } from './shared';
import { normalizeOptions } from './shared';

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  /** Mảng options hoặc valueEnum */
  options?: BaseOption[] | [string | number, string][];
  valueEnum?: ValueEnum;
  /** Kiểu hiển thị: default (radio tròn) hoặc button */
  optionType?: 'default' | 'button';
  /** Hướng sắp xếp */
  direction?: 'horizontal' | 'vertical';
  /** Kích thước control */
  size?: 'small' | 'medium';
};

/**
 * Radio group — tương đương ProFormRadio.Group của Ant Design Pro.
 *
 * @example
 * <BaseRadioGroup name="gender" label="Giới tính" options={GENDER_OPTIONS} />
 * <BaseRadioGroup name="status" label="Trạng thái" valueEnum={STATUS_ENUM} optionType="button" />
 */
export default function BaseRadioGroup({
  name,
  label,
  helperText,
  disabled,
  options,
  valueEnum,
  optionType = 'default',
  direction = 'horizontal',
  size = 'small',
}: Props) {
  const { control } = useFormContext();
  const normalized = normalizeOptions(options ?? valueEnum);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} disabled={disabled} component="fieldset">
          {label && <FormLabel component="legend">{label}</FormLabel>}

          {optionType === 'button' ? (
            <ToggleButtonGroup
              exclusive
              size={size}
              orientation={direction === 'vertical' ? 'vertical' : 'horizontal'}
              value={field.value ?? ''}
              onChange={(_, newValue) => {
                if (newValue !== null) field.onChange(newValue);
              }}
            >
              {normalized.map((option) => (
                <ToggleButton key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          ) : (
            <RadioGroup
              row={direction === 'horizontal'}
              value={field.value ?? ''}
              onChange={(event) => field.onChange(event.target.value)}
            >
              {normalized.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size={size} />}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </RadioGroup>
          )}

          {(error?.message ?? helperText) && (
            <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
