import { Controller, useFormContext } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
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
  /** Hướng sắp xếp */
  direction?: 'horizontal' | 'vertical';
  /** Kích thước control */
  size?: 'small' | 'medium';
};

/**
 * Checkbox group — tương đương ProFormCheckbox.Group của Ant Design Pro.
 * Giá trị trong form là MẢNG các value được chọn.
 * Yup gợi ý: Yup.array().min(1, 'Chọn ít nhất 1')
 *
 * @example
 * <BaseCheckboxGroup name="skills" label="Kỹ năng" options={SKILL_OPTIONS} />
 */
export default function BaseCheckboxGroup({
  name,
  label,
  helperText,
  disabled,
  options,
  valueEnum,
  direction = 'horizontal',
  size = 'small',
}: Props) {
  const { control } = useFormContext();
  const normalized = normalizeOptions(options ?? valueEnum);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected: (string | number)[] = Array.isArray(field.value) ? field.value : [];

        const toggle = (value: string | number) => {
          const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
          field.onChange(next);
        };

        return (
          <FormControl error={!!error} disabled={disabled} component="fieldset">
            {label && <FormLabel component="legend">{label}</FormLabel>}
            <FormGroup row={direction === 'horizontal'}>
              {normalized.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      size={size}
                      checked={selected.includes(option.value)}
                      onChange={() => toggle(option.value)}
                      disabled={option.disabled}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {(error?.message ?? helperText) && (
              <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}
