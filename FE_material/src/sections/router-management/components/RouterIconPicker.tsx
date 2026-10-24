import { lazy, Suspense, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/iconify';

const RouterIconLibraryDialog = lazy(() => import('./RouterIconLibraryDialog'));

type Props = {
  name: string;
  label?: string;
  helperText?: string;
};

export default function RouterIconPicker({ name, label = 'Icon Solar *', helperText }: Props) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const currentValue = typeof field.value === 'string' ? field.value : '';
        return (
          <Box>
            <TextField
              fullWidth
              size="small"
              label={label}
              value={currentValue || 'Chọn icon...'}
              onClick={() => setOpen(true)}
              error={Boolean(error)}
              helperText={error?.message ?? helperText}
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon={currentValue || 'solar:route-bold-duotone'}
                        width={20}
                        sx={{ color: currentValue ? 'primary.main' : 'text.disabled', flexShrink: 0 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon="solar:alt-arrow-down-bold" width={18} sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    cursor: 'pointer',
                    '& input': {
                      cursor: 'pointer',
                      color: currentValue ? 'text.primary' : 'text.disabled',
                    },
                  },
                },
              }}
            />
            {open && (
              <Suspense fallback={<Typography role="status" variant="caption" color="text.secondary">Đang tải thư viện icon…</Typography>}>
                <RouterIconLibraryDialog open={open} value={currentValue} onClose={() => setOpen(false)} onSelect={field.onChange} />
              </Suspense>
            )}
          </Box>
        );
      }}
    />
  );
}
