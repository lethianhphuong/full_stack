import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CustomDialog } from '@/components';
import { collectDescendantIds, findRoute, findRouteWithSection } from '../route-tree';
import type { ManagedRoute, ManagedRouteSection, RouteDestination, RouterRowItem } from '../types';

type Props = {
  open: boolean;
  item?: RouterRowItem;
  config: ManagedRouteSection[];
  onClose: () => void;
  onMove: (destination: RouteDestination) => void;
};

type LocationOption = {
  value: string;
  label: string;
  depth: number;
  isSection?: boolean;
};

function flattenLocationOptions(config: ManagedRouteSection[], excluded: Set<string>): LocationOption[] {
  const result: LocationOption[] = [];

  config.forEach((section) => {
    result.push({
      value: `section:${section.subheader}`,
      label: section.subheader,
      depth: 0,
      isSection: true,
    });

    const visit = (items: ManagedRoute[], parentNumber = '', depth = 1) => {
      let indexCounter = 1;
      items.forEach((route) => {
        if (!excluded.has(route.id)) {
          const stt = parentNumber ? `${parentNumber}.${indexCounter}` : `${indexCounter}`;
          indexCounter++;

          result.push({
            value: `route:${route.id}`,
            label: `${stt}. ${route.title}`,
            depth,
          });
          if (route.children) visit(route.children, stt, depth + 1);
        }
      });
    };

    visit(section.items, '', 1);
  });

  return result;
}

export default function RouterMoveDialog({ open, item, config, onClose, onMove }: Props) {
  const initialLoc = useMemo(() => {
    if (item?.parentId && findRoute(config, item.parentId)) {
      return `route:${item.parentId}`;
    }
    return `section:${item?.sectionTitle ?? config[0]?.subheader ?? ''}`;
  }, [config, item]);

  const [location, setLocation] = useState(initialLoc);
  const [index, setIndex] = useState(-1);

  const excluded = useMemo(() => {
    if (!item) return new Set<string>();
    const route = findRoute(config, item.id);
    const result = route ? collectDescendantIds(route) : new Set<string>();
    result.add(item.id);
    return result;
  }, [config, item]);

  const locationOptions = useMemo(() => flattenLocationOptions(config, excluded), [config, excluded]);

  // Xác định section và parentId từ location đang chọn
  const resolvedTarget = useMemo(() => {
    if (location.startsWith('route:')) {
      const parentRouteId = location.slice('route:'.length);
      const found = findRouteWithSection(config, parentRouteId);
      return {
        section: found?.sectionTitle ?? '',
        parentId: parentRouteId,
        parentRoute: found?.route,
      };
    }
    const sectionName = location.slice('section:'.length);
    return {
      section: sectionName,
      parentId: '',
      parentRoute: undefined,
    };
  }, [config, location]);

  const siblings = useMemo(() => {
    if (resolvedTarget.parentId) {
      return (resolvedTarget.parentRoute?.children ?? []).filter((route) => route.id !== item?.id);
    }
    const targetSection = config.find((s) => s.subheader === resolvedTarget.section);
    return (targetSection?.items ?? []).filter((route) => route.id !== item?.id);
  }, [config, item?.id, resolvedTarget]);

  const handleConfirmMove = () => {
    if (!resolvedTarget.section) return;
    onMove({
      section: resolvedTarget.section,
      parentId: resolvedTarget.parentId || undefined,
      index: index < 0 ? undefined : index,
    });
    onClose();
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Di chuyển route"
      subtitle={item?.title}
      dividers
      actions={
        <>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmMove}>
            Di chuyển
          </Button>
        </>
      }
    >
      <Stack spacing={2} sx={{ pt: 0.5 }}>
        <TextField
          select
          fullWidth
          size="small"
          label="Vị trí menu đích"
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
            setIndex(-1);
          }}
          SelectProps={{
            renderValue: (selectedVal) => {
              const opt = locationOptions.find((o) => o.value === selectedVal);
              if (!opt) return '';
              if (opt.isSection) return `${opt.label} (Cấp gốc nhóm)`;
              return opt.label;
            },
          }}
        >
          {locationOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.isSection ? (
                <Box
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{opt.label}</span>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontWeight: 400, fontStyle: 'italic', ml: 1 }}
                  >
                    (Cấp gốc)
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ pl: opt.depth * 1.5, display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span>{opt.label}</span>
                </Box>
              )}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          size="small"
          label="Thứ tự hiển thị"
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
        >
          <MenuItem value={-1}>Cuối danh sách</MenuItem>
          <MenuItem value={0}>Đầu danh sách</MenuItem>
          {siblings.map((route, routeIndex) => (
            <MenuItem key={route.id} value={routeIndex}>
              Trước “{route.title}”
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="caption" color="text.secondary">
          Không thể di chuyển một route vào chính nó hoặc cây con của nó.
        </Typography>
      </Stack>
    </CustomDialog>
  );
}
