import { Controller, useFormContext } from 'react-hook-form';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { SwitchProps } from '@mui/material/Switch';

// ----------------------------------------------------------------------

type Props = SwitchProps & {
  name: string;
  label: string;
  helperText?: string;
};

export default function BaseSwitch({
  name,
  label,
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
        <div>
          <FormControlLabel
            control={
              <Switch
                {...field}
                size={size}
                checked={!!field.value}
                {...other}
                onChange={(event, checked) => {
                  field.onChange(event);
                  other.onChange?.(event, checked);
                }}
              />
            }
            label={label}
          />
          {(error?.message ?? helperText) && (
            <FormHelperText error={!!error}>
              {error?.message ?? helperText}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
