import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import type { ThemeLayout } from '@/types/settings';

// ----------------------------------------------------------------------

type Props = {
  value: ThemeLayout;
  onChange: (value: ThemeLayout) => void;
};

const layouts = [
  { value: 'vertical', label: 'Dọc' },
  { value: 'horizontal', label: 'Ngang' },
  { value: 'mini', label: 'Thu gọn' },
] as const;

export default function LayoutOptions({ value, onChange }: Props) {
  const theme = useTheme();

  const renderLayoutPreview = (layout: typeof layouts[number]['value'], isSelected: boolean) => {
    const activeColor = isSelected ? theme.palette.primary.main : theme.palette.text.disabled;
    const inactiveColor = alpha(theme.palette.grey[500], 0.24);

    if (layout === 'vertical') {
      return (
        <Stack direction="row" sx={{ width: 36, height: 32 }} spacing={0.5}>
          {/* Sidebar */}
          <Box
            sx={{
              width: 10,
              height: '100%',
              borderRadius: 0.5,
              bgcolor: activeColor,
            }}
          />
          {/* Content */}
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Box sx={{ height: 6, borderRadius: 0.5, bgcolor: inactiveColor }} />
            <Box sx={{ flex: 1, borderRadius: 0.5, bgcolor: inactiveColor }} />
          </Stack>
        </Stack>
      );
    }

    if (layout === 'horizontal') {
      return (
        <Stack sx={{ width: 36, height: 32 }} spacing={0.5}>
          {/* Header */}
          <Box sx={{ height: 6, borderRadius: 0.5, bgcolor: activeColor }} />
          {/* Content */}
          <Box sx={{ flex: 1, borderRadius: 0.5, bgcolor: inactiveColor }} />
        </Stack>
      );
    }

    // Mini
    return (
      <Stack direction="row" sx={{ width: 36, height: 32 }} spacing={0.5}>
        {/* Mini Sidebar */}
        <Box
          sx={{
            width: 6,
            height: '100%',
            borderRadius: 0.5,
            bgcolor: activeColor,
          }}
        />
        {/* Content */}
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Box sx={{ height: 6, borderRadius: 0.5, bgcolor: inactiveColor }} />
          <Box sx={{ flex: 1, borderRadius: 0.5, bgcolor: inactiveColor }} />
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack direction="row" spacing={1.5}>
      {layouts.map((layout) => {
        const selected = value === layout.value;

        return (
          <Box
            key={layout.value}
            onClick={() => onChange(layout.value as ThemeLayout)}
            sx={{
              flex: 1,
              py: 2,
              cursor: 'pointer',
              borderRadius: 1.5,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
              transition: theme.transitions.create(['all']),
              ...(selected && {
                bgcolor: alpha(theme.palette.grey[500], 0.08),
                borderColor: theme.palette.text.primary,
              }),
            }}
          >
            <Box sx={{ mb: 1 }}>
              {renderLayoutPreview(layout.value, selected)}
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: selected ? 600 : 400,
                color: selected ? 'text.primary' : 'text.secondary',
              }}
            >
              {layout.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
