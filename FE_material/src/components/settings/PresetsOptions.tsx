import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import type { ThemeColorPresets } from '@/types/settings';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  value: ThemeColorPresets;
  onChange: (value: ThemeColorPresets) => void;
};

const presets = [
  { name: 'default', color: '#00A76F' },
  { name: 'cyan', color: '#078DEE' },
  { name: 'purple', color: '#7635DC' },
  { name: 'blue', color: '#2065D1' },
  { name: 'orange', color: '#FDA92D' },
  { name: 'red', color: '#FF3030' },
] as const;

export default function PresetsOptions({ value, onChange }: Props) {
  const theme = useTheme();

  return (
    <Stack direction="row" flexWrap="wrap" gap={1.5}>
      {presets.map((preset) => {
        const selected = value === preset.name;

        return (
          <Box
            key={preset.name}
            onClick={() => onChange(preset.name as ThemeColorPresets)}
            sx={{
              width: 64,
              height: 64,
              cursor: 'pointer',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
              transition: theme.transitions.create(['all']),
              ...(selected && {
                borderColor: preset.color,
                bgcolor: alpha(preset.color, 0.08),
              }),
            }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: preset.color,
                transition: theme.transitions.create('all'),
                ...(selected && {
                  transform: 'scale(1.1)',
                  boxShadow: `0 0 0 4px ${alpha(preset.color, 0.24)}`,
                }),
              }}
            >
              {selected && (
                <Iconify
                  icon="eva:checkmark-fill"
                  width={16}
                  sx={{ color: '#fff' }}
                />
              )}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
