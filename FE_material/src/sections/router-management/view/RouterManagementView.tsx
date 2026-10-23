import { useState } from 'react';
import Card from '@mui/material/Card';
import { useSnackbar } from 'notistack';
import { AppPageContainer } from '@/components';
import RouterConfirmDialog from '../components/RouterConfirmDialog';
import RouterEditorDialog from '../components/RouterEditorDialog';
import RouterMoveDialog from '../components/RouterMoveDialog';
import RouterStatusBar from '../components/RouterStatusBar';
import RouterToolbar from '../components/RouterToolbar';
import RouterTreeTable from '../components/RouterTreeTable';
import { useRouterTreeTable } from '../hooks/useRouterTreeTable';
import { useManagedRouterStore } from '../store';
import type { ManagedRoute, RouteEditorValues, RouterRowItem } from '../types';

function toRouteConfig(values: RouteEditorValues): Partial<ManagedRoute> {
  const info = /^\d+$/.test(values.info) ? Number(values.info) : values.info || undefined;
  return {
    title: values.title.trim(), path: values.path.replace(/^\/+/, ''), icon: values.icon.trim(),
    index: values.index || undefined, hideInMenu: values.hideInMenu || undefined, info,
  };
}

export default function RouterManagementView() {
  const { enqueueSnackbar } = useSnackbar();
  const addRoute = useManagedRouterStore((state) => state.addRoute);
  const updateRoute = useManagedRouterStore((state) => state.updateRoute);
  const moveRoute = useManagedRouterStore((state) => state.moveRoute);
  const moveRouteSibling = useManagedRouterStore((state) => state.moveRouteSibling);
  const deleteRoute = useManagedRouterStore((state) => state.deleteRoute);
  const resetMock = useManagedRouterStore((state) => state.resetMock);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RouterRowItem>();
  const [suggestedParent, setSuggestedParent] = useState<RouterRowItem>();
  const [movingItem, setMovingItem] = useState<RouterRowItem>();
  const [deletingItem, setDeletingItem] = useState<RouterRowItem>();
  const [resetOpen, setResetOpen] = useState(false);
  const {
    routesConfig, sections, filters, collapsedMap, toggleCollapse, resetFilters,
    handleSearchChange, handleSubheaderChange,
    filteredSections, totalEntries, totalConfiguredEntries,
  } = useRouterTreeTable();

  const openAdd = (parent?: RouterRowItem) => { setEditingItem(undefined); setSuggestedParent(parent); setEditorOpen(true); };
  const openEdit = (item: RouterRowItem) => { setSuggestedParent(undefined); setEditingItem(item); setEditorOpen(true); };
  const handleSave = (values: RouteEditorValues) => {
    const route = toRouteConfig(values);
    if (editingItem) {
      updateRoute(editingItem.id, route);
      if (values.section !== editingItem.sectionTitle || (values.parentId || '') !== (editingItem.parentId || '')) {
        moveRoute(editingItem.id, { section: values.section, parentId: values.parentId || undefined });
      }
      enqueueSnackbar(`Đã cập nhật route “${values.title}”`, { variant: 'success' });
    } else {
      addRoute({ id: crypto.randomUUID(), ...route } as ManagedRoute, { section: values.section, parentId: values.parentId || undefined });
      enqueueSnackbar(`Đã thêm route “${values.title}”`, { variant: 'success' });
    }
  };

  return (
    <AppPageContainer sx={{ p: { xs: 2, md: 3 } }} hideTitle>
      <Card sx={{ borderRadius: 2, boxShadow: (theme) => theme.customShadows.card, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <RouterToolbar filters={filters} sections={sections} onSearchChange={handleSearchChange} onSubheaderChange={handleSubheaderChange} onReset={resetFilters} onAdd={() => openAdd()} onResetConfig={() => setResetOpen(true)} />
        <RouterTreeTable sections={filteredSections} collapsedMap={collapsedMap} onToggleCollapse={toggleCollapse} onAddChild={openAdd} onEdit={openEdit} onMove={setMovingItem} onMoveSibling={(item, offset) => { moveRouteSibling(item.id, offset); enqueueSnackbar('Đã thay đổi thứ tự route', { variant: 'success' }); }} onDelete={setDeletingItem} />
        <RouterStatusBar totalEntries={totalEntries} totalConfiguredEntries={totalConfiguredEntries} />
      </Card>

      <RouterEditorDialog open={editorOpen} config={routesConfig} initialItem={editingItem} suggestedParent={suggestedParent} onClose={() => setEditorOpen(false)} onSave={handleSave} />
      <RouterMoveDialog key={movingItem?.id ?? 'move-dialog'} open={Boolean(movingItem)} item={movingItem} config={routesConfig} onClose={() => setMovingItem(undefined)} onMove={(destination) => { if (movingItem) { moveRoute(movingItem.id, destination); enqueueSnackbar(`Đã di chuyển route “${movingItem.title}”`, { variant: 'success' }); } }} />
      <RouterConfirmDialog open={Boolean(deletingItem)} title="Xóa route?" message={`Route “${deletingItem?.title ?? ''}” và toàn bộ route con sẽ bị xóa khỏi phiên hiện tại.`} confirmLabel="Xóa route" onClose={() => setDeletingItem(undefined)} onConfirm={() => { if (deletingItem) { deleteRoute(deletingItem.id); enqueueSnackbar(`Đã xóa route “${deletingItem.title}”`, { variant: 'success' }); } }} />
      <RouterConfirmDialog open={resetOpen} title="Khôi phục dữ liệu mock?" message="Mọi thay đổi thêm, sửa, xóa và di chuyển trong phiên hiện tại sẽ bị hủy. Router và sidebar thật không bị ảnh hưởng." confirmLabel="Khôi phục" color="warning" onClose={() => setResetOpen(false)} onConfirm={() => { resetMock(); enqueueSnackbar('Đã khôi phục dữ liệu mock ban đầu', { variant: 'success' }); }} />
    </AppPageContainer>
  );
}
