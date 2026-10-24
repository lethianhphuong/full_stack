import { useEffect, useId, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BaseSelect, BaseSwitch, BaseTextField, CustomDialog, FormProvider } from '@/components';
import { collectDescendantIds, findRoute, findRouteWithSection } from '../route-tree';
import type { ManagedRoute, ManagedRouteSection, RouteEditorValues, RouterRowItem } from '../types';
import RouterIconPicker from './RouterIconPicker';

type FormValues = {
  title: string;
  path: string;
  location: string;
  newSectionName: string;
  icon: string;
  info: string;
  index: boolean;
  hideInMenu: boolean;
};

const DEFAULT_VALUES: FormValues = {
  title: '',
  path: '',
  location: '',
  newSectionName: '',
  icon: 'solar:route-bold-duotone',
  info: '',
  index: false,
  hideInMenu: false,
};

const schema: yup.ObjectSchema<FormValues> = yup.object({
  title: yup.string().trim().required('Nhập tiêu đề'),
  path: yup.string().trim().required('Nhập đường dẫn'),
  location: yup.string().required('Chọn vị trí menu'),
  newSectionName: yup.string().defined(),
  icon: yup.string().trim().required('Chọn icon'),
  info: yup.string().defined(),
  index: yup.boolean().defined(),
  hideInMenu: yup.boolean().defined(),
});

type Props = {
  open: boolean;
  config: ManagedRouteSection[];
  initialItem?: RouterRowItem;
  suggestedParent?: RouterRowItem;
  onClose: () => void;
  onSave: (values: RouteEditorValues) => void;
};

function flattenLocationOptions(config: ManagedRouteSection[], excludedIds: Set<string>) {
  const result: Array<{ value: string; label: string; depth: number; isSection?: boolean; isAction?: boolean }> = [];

  config.forEach((section) => {
    result.push({
      value: `section:${section.subheader}`,
      label: section.subheader,
      depth: 0,
      isSection: true,
    });

    const visit = (items: ManagedRoute[], parentNumber = '', depth = 1) => {
      let indexCounter = 1;
      items.forEach((item) => {
        if (!excludedIds.has(item.id)) {
          const stt = parentNumber ? `${parentNumber}.${indexCounter}` : `${indexCounter}`;
          indexCounter++;

          result.push({
            value: `route:${item.id}`,
            label: `${stt}. ${item.title}`,
            depth,
          });
          if (item.children) visit(item.children, stt, depth + 1);
        }
      });
    };

    visit(section.items, '', 1);
  });

  result.push({
    value: '__CREATE_NEW_GROUP__',
    label: '+ Tạo nhóm menu mới',
    depth: 0,
    isAction: true,
  });

  return result;
}

export default function RouterEditorDialog({ open, config, initialItem, suggestedParent, onClose, onSave }: Props) {
  const formId = useId();
  const methods = useForm<FormValues>({ resolver: yupResolver(schema), defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, setError, control, formState: { isSubmitting } } = methods;
  const location = useWatch({ control, name: 'location' });

  useEffect(() => {
    if (!open) return;
    if (initialItem) {
      const initialLocation = initialItem.parentId && findRoute(config, initialItem.parentId)
        ? `route:${initialItem.parentId}`
        : `section:${initialItem.sectionTitle}`;
      reset({
        title: initialItem.title,
        path: initialItem.path,
        location: initialLocation,
        newSectionName: '',
        icon: initialItem.icon ?? 'solar:route-bold-duotone',
        info: initialItem.info?.toString() ?? '',
        index: Boolean(initialItem.isIndex),
        hideInMenu: Boolean(initialItem.hideInMenu),
      });
    } else {
      const defaultLoc = suggestedParent
        ? `route:${suggestedParent.id}`
        : `section:${config[0]?.subheader ?? ''}`;
      reset({
        ...DEFAULT_VALUES,
        location: defaultLoc,
        newSectionName: '',
      });
    }
  }, [config, initialItem, open, reset, suggestedParent]);

  const excludedIds = useMemo(() => {
    if (!initialItem) return new Set<string>();
    const route = findRoute(config, initialItem.id);
    const ids = route ? collectDescendantIds(route) : new Set<string>();
    ids.add(initialItem.id);
    return ids;
  }, [config, initialItem]);

  const locationOptions = useMemo(() => flattenLocationOptions(config, excludedIds), [config, excludedIds]);

  const submit = handleSubmit((values) => {
    const normalizedPath = values.path.replace(/^\/+/, '');

    let targetSection = '';
    let targetParentId = '';
    let isNewSection = false;

    if (values.location === '__CREATE_NEW_GROUP__') {
      const trimmedName = values.newSectionName.trim();
      if (!trimmedName) {
        setError('newSectionName', { message: 'Nhập tên nhóm menu mới' });
        return;
      }
      const isDuplicate = config.some(
        (s) => s.subheader.trim().toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicate) {
        setError('newSectionName', { message: 'Tên nhóm menu đã tồn tại' });
        return;
      }
      targetSection = trimmedName;
      targetParentId = '';
      isNewSection = true;
    } else if (values.location.startsWith('section:')) {
      targetSection = values.location.slice('section:'.length);
      targetParentId = '';
    } else if (values.location.startsWith('route:')) {
      const parentRouteId = values.location.slice('route:'.length);
      const found = findRouteWithSection(config, parentRouteId);
      if (!found) {
        setError('location', { message: 'Route cha không hợp lệ' });
        return;
      }
      targetSection = found.sectionTitle;
      targetParentId = parentRouteId;
    } else {
      setError('location', { message: 'Chọn vị trí menu hợp lệ' });
      return;
    }

    let duplicatePath = false;
    const visit = (items: ManagedRouteSection['items']) => items.forEach((item) => {
      if (item.id !== initialItem?.id && item.path.replace(/^\/+/, '') === normalizedPath) duplicatePath = true;
      if (item.children) visit(item.children);
    });
    config.forEach((item) => visit(item.items));
    if (duplicatePath) { setError('path', { message: 'Đường dẫn route đã tồn tại' }); return; }

    if (values.index) {
      let hasAnotherIndex = false;
      const findIndex = (items: ManagedRouteSection['items']) => items.forEach((item) => {
        if (item.id !== initialItem?.id && item.index) hasAnotherIndex = true;
        if (item.children) findIndex(item.children);
      });
      config.forEach((item) => findIndex(item.items));
      if (hasAnotherIndex) {
        setError('index', { message: 'Cấu hình đã có một index route' }); return;
      }
    }

    onSave({
      ...values,
      path: normalizedPath,
      section: targetSection,
      parentId: targetParentId,
      newSectionName: isNewSection ? targetSection : undefined,
    });
    onClose();
  });

  return (
    <CustomDialog open={open} onClose={onClose} title={initialItem ? 'Chỉnh sửa route' : 'Thêm route'} subtitle="Thay đổi có hiệu lực trong phiên hiện tại" dividers maxWidth="md" actions={<><Button onClick={onClose}>Hủy</Button><Button form={formId} type="submit" variant="contained" loading={isSubmitting}>Lưu route</Button></>}>
      <FormProvider id={formId} methods={methods} onSubmit={submit}>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="title" label="Tiêu đề *" placeholder="VD: Trang chủ, Người dùng..." /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="path" label="Đường dẫn *" placeholder="VD: user/profile (không cần / ở đầu)" /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><RouterIconPicker name="icon" /></Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <BaseSelect
              name="location"
              label="Vị trí menu *"
              options={locationOptions}
              renderOption={(option) => {
                const opt = locationOptions.find((o) => o.value === option.value);
                if (opt?.isAction) {
                  return (
                    <Box sx={{ color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      {option.label}
                    </Box>
                  );
                }
                if (opt?.isSection) {
                  return (
                    <Box sx={{ fontWeight: 700, color: 'text.primary', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{opt.label}</span>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400, fontStyle: 'italic', ml: 1 }}>
                        (Cấp gốc)
                      </Typography>
                    </Box>
                  );
                }
                return (
                  <Box sx={{ pl: (opt?.depth ?? 1) * 1.5, display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span>{option.label}</span>
                  </Box>
                );
              }}
              SelectProps={{
                renderValue: (selectedVal) => {
                  const opt = locationOptions.find((o) => o.value === selectedVal);
                  if (!opt) return '';
                  if (opt.isAction) return '+ Tạo nhóm menu mới';
                  if (opt.isSection) return `${opt.label} (Cấp gốc nhóm)`;
                  return opt.label;
                },
              }}
            />
          </Grid>
          {location === '__CREATE_NEW_GROUP__' && (
            <Grid size={{ xs: 12 }}>
              <BaseTextField
                name="newSectionName"
                label="Tên nhóm menu mới *"
                placeholder="VD: Tiện ích, Báo cáo..."
                autoFocus
                helperText="Nhóm menu mới sẽ được tạo cùng lúc khi lưu route"
              />
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="info" label="Badge" placeholder="VD: 12 hoặc Mới" /></Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: 40, display: 'flex', alignItems: 'center' }}>
              <Stack direction="row" spacing={3}>
                <BaseSwitch name="index" label="Index route" />
                <BaseSwitch name="hideInMenu" label="Ẩn khỏi menu" />
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}><Typography variant="caption" color="text.secondary">ID được tự sinh. Khi đổi URL route cha, các URL con cùng tiền tố cũng được cập nhật. Dữ liệu chỉ tồn tại đến khi tải lại trang.</Typography></Grid>
        </Grid>
      </FormProvider>
    </CustomDialog>
  );
}
