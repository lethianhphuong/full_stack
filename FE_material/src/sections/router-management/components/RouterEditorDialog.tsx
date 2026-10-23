import { useEffect, useId, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BaseSelect, BaseSwitch, BaseTextField, CustomDialog, FormProvider } from '@/components';
import { collectDescendantIds, findRoute } from '../route-tree';
import type { ManagedRouteSection, RouteEditorValues, RouterRowItem } from '../types';
import RouterIconPicker from './RouterIconPicker';

const DEFAULT_VALUES: RouteEditorValues = {
  title: '', path: '', section: '', parentId: '',
  icon: 'solar:route-bold-duotone', info: '', index: false, hideInMenu: false,
};

const schema: yup.ObjectSchema<RouteEditorValues> = yup.object({
  title: yup.string().trim().required('Nhập tiêu đề'),
  path: yup.string().trim().required('Nhập đường dẫn'),
  section: yup.string().required('Chọn section'),
  parentId: yup.string().defined(),
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

function flattenParentOptions(config: ManagedRouteSection[], section: string, excludedIds: Set<string>) {
  const result: Array<{ value: string; label: string }> = [{ value: '', label: 'Cấp gốc của section' }];
  const visit = (items: ManagedRouteSection['items'], depth = 0) => items.forEach((item) => {
    if (!excludedIds.has(item.id)) {
      result.push({ value: item.id, label: `${'— '.repeat(depth)}${item.title}` });
      if (item.children) visit(item.children, depth + 1);
    }
  });
  const target = config.find((item) => item.subheader === section);
  if (target) visit(target.items);
  return result;
}

export default function RouterEditorDialog({ open, config, initialItem, suggestedParent, onClose, onSave }: Props) {
  const formId = useId();
  const methods = useForm<RouteEditorValues>({ resolver: yupResolver(schema), defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, setError, control, formState: { isSubmitting } } = methods;
  const section = useWatch({ control, name: 'section' });

  useEffect(() => {
    if (!open) return;
    reset(initialItem ? {
      title: initialItem.title, path: initialItem.path,
      section: initialItem.sectionTitle, parentId: initialItem.parentId ?? '',
      icon: initialItem.icon ?? 'solar:route-bold-duotone', info: initialItem.info?.toString() ?? '',
      index: Boolean(initialItem.isIndex), hideInMenu: Boolean(initialItem.hideInMenu),
    } : { ...DEFAULT_VALUES, section: suggestedParent?.sectionTitle ?? config[0]?.subheader ?? '', parentId: suggestedParent?.id ?? '' });
  }, [config, initialItem, open, reset, suggestedParent]);

  const excludedIds = useMemo(() => {
    if (!initialItem) return new Set<string>();
    const route = findRoute(config, initialItem.id);
    const ids = route ? collectDescendantIds(route) : new Set<string>();
    ids.add(initialItem.id);
    return ids;
  }, [config, initialItem]);

  const parentOptions = useMemo(() => flattenParentOptions(config, section, excludedIds), [config, excludedIds, section]);
  const sectionOptions = config.map((item) => ({ value: item.subheader, label: item.subheader }));

  const submit = handleSubmit((values) => {
    const normalizedPath = values.path.replace(/^\/+/, '');
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
    onSave({ ...values, path: normalizedPath });
    onClose();
  });

  return (
    <CustomDialog open={open} onClose={onClose} title={initialItem ? 'Chỉnh sửa route' : 'Thêm route'} subtitle="Thay đổi có hiệu lực trong phiên hiện tại" dividers maxWidth="md" actions={<><Button onClick={onClose}>Hủy</Button><Button form={formId} type="submit" variant="contained" loading={isSubmitting}>Lưu route</Button></>}>
      <FormProvider id={formId} methods={methods} onSubmit={submit}>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="title" label="Tiêu đề *" /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="path" label="Đường dẫn *" helperText="Không cần dấu / ở đầu" /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><RouterIconPicker name="icon" /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BaseSelect name="section" label="Section *" options={sectionOptions} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BaseSelect name="parentId" label="Route cha" options={parentOptions} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><BaseTextField name="info" label="Badge" placeholder="VD: 12 hoặc Mới" /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Stack direction="row" spacing={2} flexWrap="wrap"><BaseSwitch name="index" label="Index route" /><BaseSwitch name="hideInMenu" label="Ẩn khỏi menu" /></Stack></Grid>
          <Grid size={{ xs: 12 }}><Typography variant="caption" color="text.secondary">ID được tự sinh. Khi đổi URL route cha, các URL con cùng tiền tố cũng được cập nhật. Dữ liệu chỉ tồn tại đến khi tải lại trang.</Typography></Grid>
        </Grid>
      </FormProvider>
    </CustomDialog>
  );
}
