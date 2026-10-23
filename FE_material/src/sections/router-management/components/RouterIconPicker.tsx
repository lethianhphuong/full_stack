import { lazy, Suspense, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
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
            <ButtonBase
              onClick={() => setOpen(true)}
              sx={(theme) => ({ width: '100%', minHeight: 40, px: 1.5, py: 1, border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`, borderRadius: 1, textAlign: 'left', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }, '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 1 } })}
            >
              <Stack direction="row" alignItems="center" spacing={1.25} sx={{ width: '100%', minWidth: 0 }}>
                <Iconify icon={currentValue || 'solar:route-bold-duotone'} width={22} sx={{ color: currentValue ? 'primary.main' : 'text.disabled', flexShrink: 0 }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="caption" color={error ? 'error.main' : 'text.secondary'}>{label}</Typography>
                  <Typography variant="body2" noWrap>{currentValue || 'Chọn icon...'}</Typography>
                </Box>
                <Iconify icon="solar:alt-arrow-down-bold" width={18} sx={{ color: 'text.secondary' }} />
              </Stack>
            </ButtonBase>
            {(error?.message || helperText) && <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>}
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
