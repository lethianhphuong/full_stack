import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CustomDialog } from '@/components';
import { collectDescendantIds, findRoute } from '../route-tree';
import type { ManagedRoute, ManagedRouteSection, RouteDestination, RouterRowItem } from '../types';

type Props = {
  open: boolean;
  item?: RouterRowItem;
  config: ManagedRouteSection[];
  onClose: () => void;
  onMove: (destination: RouteDestination) => void;
};

function findChildren(config: ManagedRouteSection[], section: string, parentId: string) {
  if (!parentId) return config.find((item) => item.subheader === section)?.items ?? [];
  return findRoute(config, parentId)?.children ?? [];
}

function parentOptions(config: ManagedRouteSection[], section: string, excluded: Set<string>) {
  const options: Array<{ value: string; label: string }> = [{ value: '', label: 'Cấp gốc của section' }];
  const visit = (items: ManagedRoute[], depth = 0) => items.forEach((route) => {
    if (!excluded.has(route.id)) {
      options.push({ value: route.id, label: `${'— '.repeat(depth)}${route.title}` });
      if (route.children) visit(route.children, depth + 1);
    }
  });
  const target = config.find((item) => item.subheader === section);
  if (target) visit(target.items);
  return options;
}

export default function RouterMoveDialog({ open, item, config, onClose, onMove }: Props) {
  const [section, setSection] = useState(item?.sectionTitle ?? config[0]?.subheader ?? '');
  const [parentId, setParentId] = useState(item?.parentId ?? '');
  const [index, setIndex] = useState(-1);

  const excluded = useMemo(() => {
    if (!item) return new Set<string>();
    const route = findRoute(config, item.id);
    const result = route ? collectDescendantIds(route) : new Set<string>();
    result.add(item.id);
    return result;
  }, [config, item]);
  const parents = useMemo(() => parentOptions(config, section, excluded), [config, excluded, section]);
  const siblings = findChildren(config, section, parentId).filter((route) => route.id !== item?.id);

  return (
    <CustomDialog open={open} onClose={onClose} title="Di chuyển route" subtitle={item?.title} dividers actions={<><Button onClick={onClose}>Hủy</Button><Button variant="contained" onClick={() => { onMove({ section, parentId: parentId || undefined, index: index < 0 ? undefined : index }); onClose(); }}>Di chuyển</Button></>}>
      <Stack spacing={2} sx={{ pt: 0.5 }}>
        <TextField select fullWidth size="small" label="Section đích" value={section} onChange={(event) => { setSection(event.target.value); setParentId(''); setIndex(-1); }}>
          {config.map((target) => <MenuItem key={target.subheader} value={target.subheader}>{target.subheader}</MenuItem>)}
        </TextField>
        <TextField select fullWidth size="small" label="Route cha đích" value={parentId} onChange={(event) => { setParentId(event.target.value); setIndex(-1); }}>
          {parents.map((parent) => <MenuItem key={parent.value || 'root'} value={parent.value}>{parent.label}</MenuItem>)}
        </TextField>
        <TextField select fullWidth size="small" label="Vị trí" value={index} onChange={(event) => setIndex(Number(event.target.value))}>
          <MenuItem value={-1}>Cuối danh sách</MenuItem>
          {siblings.map((route, routeIndex) => <MenuItem key={route.id} value={routeIndex}>Trước “{route.title}”</MenuItem>)}
        </TextField>
        <Typography variant="caption" color="text.secondary">Không thể di chuyển một route vào chính nó hoặc cây con của nó.</Typography>
      </Stack>
    </CustomDialog>
  );
}
