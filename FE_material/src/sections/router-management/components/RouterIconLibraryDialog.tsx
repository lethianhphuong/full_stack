import { useMemo, useRef, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CustomDialog, Iconify } from '@/components';
import { createIconOption, ICON_OPTIONS, type IconOption } from './icon-options';

type ViewMode = 'large' | 'compact' | 'list';

const ICONS_PER_BATCH = 20;
const ICON_LIBRARY_HEIGHT = { xs: 360, sm: 500 };

type Props = {
  open: boolean;
  value: string;
  onClose: () => void;
  onSelect: (value: string) => void;
};

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[-_:]/g, ' ');
}

function IconCard({ option, mode, selected, onSelect }: { option: IconOption; mode: ViewMode; selected: boolean; onSelect: () => void }) {
  if (mode === 'list') {
    return (
      <Box
        component="button"
        type="button"
        onClick={onSelect}
        sx={(theme) => ({
          display: 'flex', width: '100%', alignItems: 'center', gap: 1.5, p: 1,
          textAlign: 'left', color: 'text.primary', bgcolor: selected ? 'action.selected' : 'transparent',
          border: 0, borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 1 },
        })}
      >
        <Iconify icon={option.value} width={24} sx={{ flexShrink: 0, color: selected ? 'primary.main' : 'text.secondary' }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap>{option.label}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{option.value}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Tooltip title={option.value} enterDelay={500}>
      <Box
        component="button"
        type="button"
        onClick={onSelect}
        sx={(theme) => ({
          minWidth: 0, minHeight: mode === 'large' ? 96 : 72, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0.75, p: 1, color: selected ? 'primary.main' : 'text.secondary',
          bgcolor: selected ? 'action.selected' : 'background.paper', border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 1.5, cursor: 'pointer', transition: theme.transitions.create(['background-color', 'border-color', 'color']),
          '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 1 },
        })}
      >
        <Iconify icon={option.value} width={mode === 'large' ? 32 : 24} />
        <Typography variant="caption" noWrap sx={{ maxWidth: '100%' }}>{option.label}</Typography>
      </Box>
    </Tooltip>
  );
}

export default function RouterIconLibraryDialog({ open, value, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('all');
  const [mode, setMode] = useState<ViewMode>('compact');
  const [draftValue, setDraftValue] = useState(value);
  const [loadedCount, setLoadedCount] = useState(ICONS_PER_BATCH);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const catalogOptions = useMemo(() => {
    if (!value || ICON_OPTIONS.some((option) => option.value === value)) return ICON_OPTIONS;
    return [createIconOption(value), ...ICON_OPTIONS];
  }, [value]);
  const collections = useMemo(() => ['all', ...Array.from(new Set(catalogOptions.map((option) => option.collection)))], [catalogOptions]);
  const options = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    return catalogOptions.filter((option) => {
      const matchesCollection = collection === 'all' || option.collection === collection;
      const matchesQuery = !normalizedQuery || normalizeSearch(`${option.label} ${option.value}`).includes(normalizedQuery);
      return matchesCollection && matchesQuery;
    });
  }, [catalogOptions, collection, query]);
  const visibleOptions = options.slice(0, loadedCount);
  const hasMoreOptions = loadedCount < options.length;

  const resetLoadedOptions = () => {
    setLoadedCount(ICONS_PER_BATCH);
    scrollContainerRef.current?.scrollTo({ top: 0 });
  };
  const handleIconListScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !hasMoreOptions) return;
    const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 96;
    if (isNearBottom) setLoadedCount((current) => Math.min(current + ICONS_PER_BATCH, options.length));
  };

  const commitSelection = () => {
    onSelect(draftValue);
    onClose();
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Thư viện icon"
      subtitle={`${options.length} icon phù hợp trong ${catalogOptions.length} icon của project`}
      maxWidth="lg"
      dividers
      slotProps={{
        paper: {
          sx: {
            height: { xs: 'calc(100dvh - 24px)', sm: 760 },
            maxHeight: 'calc(100dvh - 24px)',
          },
        },
      }}
      actions={<><Button onClick={onClose}>Hủy</Button><Button variant="contained" onClick={commitSelection} disabled={!draftValue}>Chọn icon</Button></>}
    >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            autoFocus
            size="small"
            label="Tìm icon"
            placeholder="Ví dụ: user, calendar, solar:route..."
            value={query}
            onChange={(event) => { setQuery(event.target.value); resetLoadedOptions(); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon="solar:magnifer-bold-duotone" width={20} /></InputAdornment> }}
          />
          <TextField select size="small" label="Bộ icon" value={collection} onChange={(event) => { setCollection(event.target.value); resetLoadedOptions(); }} sx={{ minWidth: { sm: 180 } }}>
            {collections.map((item) => <MenuItem key={item} value={item}>{item === 'all' ? 'Tất cả bộ icon' : item}</MenuItem>)}
          </TextField>
          <ToggleButtonGroup exclusive size="small" value={mode} onChange={(_, nextMode: ViewMode | null) => { if (nextMode) { setMode(nextMode); resetLoadedOptions(); } }} aria-label="Kiểu hiển thị icon">
            <ToggleButton value="large" aria-label="Lưới lớn"><Iconify icon="solar:widget-4-bold" width={20} /></ToggleButton>
            <ToggleButton value="compact" aria-label="Lưới nhỏ"><Iconify icon="solar:widget-6-bold" width={20} /></ToggleButton>
            <ToggleButton value="list" aria-label="Danh sách"><Iconify icon="solar:list-bold-duotone" width={20} /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Box
          ref={scrollContainerRef}
          onScroll={handleIconListScroll}
          role="region"
          aria-label="Danh sách icon"
          sx={{ height: ICON_LIBRARY_HEIGHT, overflowY: 'auto', overscrollBehavior: 'contain', pr: 0.5 }}
        >
          {options.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', color: 'text.secondary' }}>
              <Iconify icon="solar:magnifer-zoom-in-bold-duotone" width={40} sx={{ mb: 1, color: 'text.disabled' }} />
              <Typography variant="subtitle2">Không tìm thấy icon</Typography>
              <Typography variant="body2">Thử từ khóa khác hoặc chọn lại bộ icon.</Typography>
            </Stack>
          ) : (
            <>
              <Box sx={mode === 'list' ? { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 0.5 } : { display: 'grid', gridTemplateColumns: mode === 'large' ? { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)', md: 'repeat(7, 1fr)' } : { xs: 'repeat(4, 1fr)', sm: 'repeat(7, 1fr)', md: 'repeat(10, 1fr)' }, gap: 1 }}>
                {visibleOptions.map((option) => <IconCard key={option.value} option={option} mode={mode} selected={draftValue === option.value} onSelect={() => setDraftValue(option.value)} />)}
              </Box>
              {hasMoreOptions && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', py: 2, textAlign: 'center' }}>Cuộn xuống để tải thêm icon…</Typography>}
            </>
          )}
        </Box>
    </CustomDialog>
  );
}
