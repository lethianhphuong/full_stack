import { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
import { usePreferencesStore } from '@/store';
import type { ThemeColorPresets, ThemeLayout, ThemeFontFamily, ThemeTransition } from '@/types/settings';
import PresetsOptions from './PresetsOptions';
import LayoutOptions from './LayoutOptions';
import TransitionOptions from './TransitionOptions';
import QuickSettings from './QuickSettings';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 300;

const labelStyles = {
  mb: 1.5,
  color: 'text.disabled',
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase' as const,
};

const FONT_OPTIONS: { value: ThemeFontFamily; label: string }[] = [
  { value: 'Public Sans', label: 'Public Sans' },
  { value: 'Inter', label: 'Inter' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Nunito Sans', label: 'Nunito Sans' },
];

export default function SettingsDrawer() {
  const settings = usePreferencesStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Memoized handlers
  const handleToggleContrast = useCallback(() => {
    settings.onUpdate('themeContrast', settings.themeContrast === 'default' ? 'bold' : 'default');
  }, [settings.themeContrast, settings.onUpdate]);

  const handleToggleDirection = useCallback(() => {
    settings.onUpdate('themeDirection', settings.themeDirection === 'ltr' ? 'rtl' : 'ltr');
  }, [settings.themeDirection, settings.onUpdate]);

  const handleLayoutChange = useCallback((layout: ThemeLayout) => {
    settings.onUpdate('themeLayout', layout);
  }, [settings.onUpdate]);

  const handlePresetsChange = useCallback((preset: ThemeColorPresets) => {
    settings.onUpdate('themeColorPresets', preset);
  }, [settings.onUpdate]);

  const handleFontFamilyChange = useCallback((font: ThemeFontFamily) => {
    settings.onUpdate('themeFontFamily', font);
  }, [settings.onUpdate]);

  const handleFontSizeChange = useCallback((_: Event, value: number | number[]) => {
    settings.onUpdate('themeFontSize', value as number);
  }, [settings.onUpdate]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleToggleCompact = useCallback(() => {
    settings.onUpdate('themeCompact', !settings.themeCompact);
  }, [settings.themeCompact, settings.onUpdate]);

  const handleToggleTransition = useCallback(() => {
    settings.onUpdate('transitionEnabled', !settings.transitionEnabled);
  }, [settings.transitionEnabled, settings.onUpdate]);

  const handleTransitionChange = useCallback((transition: ThemeTransition) => {
    settings.onUpdate('themeTransition', transition);
  }, [settings.onUpdate]);

  // Don't render content if drawer is closed
  if (!settings.settingsOpen) {
    return (
      <Drawer
        anchor="right"
        open={false}
        onClose={settings.onClose}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: DRAWER_WIDTH, bgcolor: 'background.default' } }}
      />
    );
  }

  const canReset = settings.canReset();

  return (
    <Drawer
      anchor="right"
      open={settings.settingsOpen}
      onClose={settings.onClose}
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: DRAWER_WIDTH, bgcolor: 'background.default' } }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Cài đặt</Typography>
        <Tooltip title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}>
          <IconButton onClick={handleFullscreen}>
            <Iconify icon={isFullscreen ? 'solar:quit-full-screen-bold' : 'solar:full-screen-bold'} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Đặt lại">
          <IconButton onClick={settings.onReset} sx={{ ...(canReset && { color: 'error.main' }) }}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>
        <IconButton onClick={settings.onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 2.5 }}>
          {/* Quick Settings - Grid 2x2 */}
          <QuickSettings
            items={[
              {
                key: 'mode',
                label: 'Chế độ',
                icon: settings.themeMode === 'dark' ? 'solar:moon-bold' : 'solar:sun-bold',
                checked: settings.themeMode === 'dark',
                onChange: settings.onToggleMode,
              },
              {
                key: 'contrast',
                label: 'Độ tương phản',
                icon: 'solar:palette-bold',
                checked: settings.themeContrast === 'bold',
                onChange: handleToggleContrast,
              },
              {
                key: 'direction',
                label: 'Phải sang trái',
                icon: 'solar:align-right-bold',
                checked: settings.themeDirection === 'rtl',
                onChange: handleToggleDirection,
              },
              {
                key: 'compact',
                label: 'Thu gọn',
                icon: 'solar:minimize-square-bold',
                checked: settings.themeCompact,
                onChange: handleToggleCompact,
                tooltip: 'Giới hạn chiều rộng nội dung',
              },
            ]}
          />

          {/* Layout */}
          <Box>
            <Typography variant="caption" sx={labelStyles}>Bố cục</Typography>
            <LayoutOptions value={settings.themeLayout} onChange={handleLayoutChange} />
          </Box>

          {/* Font Family */}
          <Box>
            <Typography variant="caption" sx={labelStyles}>Phông chữ</Typography>
            <Stack spacing={1}>
              {FONT_OPTIONS.map((option) => {
                const selected = settings.themeFontFamily === option.value;
                return (
                  <Box
                    key={option.value}
                    onClick={() => handleFontFamilyChange(option.value)}
                    sx={{
                      py: 1.5, px: 2, cursor: 'pointer', borderRadius: 1.5,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
                      ...(selected && { bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08), borderColor: 'text.primary' }),
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: `"${option.value}", sans-serif`,
                        fontWeight: selected ? 600 : 400, 
                        color: selected ? 'text.primary' : 'text.secondary' 
                      }}
                    >
                      {option.label}
                    </Typography>
                    {selected && <Iconify icon="eva:checkmark-fill" sx={{ color: 'primary.main' }} width={20} />}
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Font Size - Slider */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ ...labelStyles, mb: 0 }}>Kích thước</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {settings.themeFontSize}px
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 12 }}>Aa</Typography>
              <Slider
                value={settings.themeFontSize}
                onChange={handleFontSizeChange}
                min={12}
                max={20}
                step={1}
                marks={[
                  { value: 12, label: '' },
                  { value: 14, label: '' },
                  { value: 16, label: '' },
                  { value: 18, label: '' },
                  { value: 20, label: '' },
                ]}
                sx={{
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    '&:before': {
                      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.2)',
                    },
                  },
                  '& .MuiSlider-track': {
                    height: 4,
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    height: 4,
                    opacity: 0.24,
                  },
                  '& .MuiSlider-mark': {
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: 'currentColor',
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 18, fontWeight: 600 }}>Aa</Typography>
            </Stack>
          </Box>

          {/* Presets */}
          <Box>
            <Typography variant="caption" sx={labelStyles}>Màu sắc</Typography>
            <PresetsOptions value={settings.themeColorPresets} onChange={handlePresetsChange} />
          </Box>

          {/* Page Transition */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ ...labelStyles, mb: 0 }}>Hiệu ứng chuyển trang</Typography>
              <Switch
                size="small"
                checked={settings.transitionEnabled}
                onChange={handleToggleTransition}
              />
            </Stack>
            {settings.transitionEnabled && (
              <TransitionOptions value={settings.themeTransition} onChange={handleTransitionChange} />
            )}
          </Box>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
