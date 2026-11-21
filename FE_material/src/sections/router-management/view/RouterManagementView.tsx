import { useCallback, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
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
  const info = values.info && /^\d+$/.test(values.info) ? Number(values.info) : values.info || undefined;
  return {
    title: values.title?.trim() ?? '',
    path: (values.path ?? '').replace(/^\/+/, ''),
    icon: values.icon?.trim() || undefined,
    index: values.index || undefined,
    hideInMenu: values.hideInMenu || undefined,
    info,
  };
}

export default function RouterManagementView() {
  const { enqueueSnackbar } = useSnackbar();
  const addSection = useManagedRouterStore((state) => state.addSection);
  const renameSection = useManagedRouterStore((state) => state.renameSection);
  const moveSection = useManagedRouterStore((state) => state.moveSection);
  const deleteSection = useManagedRouterStore((state) => state.deleteSection);
  const addRoute = useManagedRouterStore((state) => state.addRoute);
  const updateRoute = useManagedRouterStore((state) => state.updateRoute);
  const moveRoute = useManagedRouterStore((state) => state.moveRoute);
  const moveRouteSibling = useManagedRouterStore((state) => state.moveRouteSibling);
  const deleteRoute = useManagedRouterStore((state) => state.deleteRoute);
  const reload = useManagedRouterStore((state) => state.reload);
  const loadFromApi = useManagedRouterStore((state) => state.loadFromApi);
  const loading = useManagedRouterStore((state) => state.loading);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RouterRowItem>();
  const [suggestedParent, setSuggestedParent] = useState<RouterRowItem>();
  const [movingItem, setMovingItem] = useState<RouterRowItem>();
  const [deletingItem, setDeletingItem] = useState<RouterRowItem>();
  const [deletingSection, setDeletingSection] = useState<{ title: string; routeCount: number }>();
  const [resetOpen, setResetOpen] = useState(false);
  const {
    routesConfig, sections, filters, collapsedMap, toggleCollapse, resetFilters,
    handleSearchChange, handleSubheaderChange,
    filteredSections, totalEntries, totalConfiguredEntries,
  } = useRouterTreeTable();

  // Tải danh sách menu từ API khi mở trang
  useEffect(() => {
    loadFromApi().then((ok) => {
      if (!ok) {
        const message = useManagedRouterStore.getState().error;
        enqueueSnackbar(message ?? 'Không tải được danh sách menu', { variant: 'error' });
      }
    });
  }, [loadFromApi, enqueueSnackbar]);

  const openAdd = useCallback((parent?: RouterRowItem) => {
    setEditingItem(undefined);
    setSuggestedParent(parent);
    setEditorOpen(true);
  }, []);

  const openEdit = useCallback((item: RouterRowItem) => {
    setSuggestedParent(undefined);
    setEditingItem(item);
    setEditorOpen(true);
  }, []);

  const handleSave = useCallback((values: RouteEditorValues) => {
    if (values.isOnlyCreateGroup && values.newSectionName) {
      addSection(values.newSectionName);
      const updatedTableData = useManagedRouterStore.getState().routes;
      console.log('1. [Data thêm mới nhóm menu]:', {
        type: 'ADD_SECTION',
        subheader: values.newSectionName,
      });
      console.log('2. [Data toàn bộ table]:', updatedTableData);
      enqueueSnackbar(`Đã tạo nhóm menu “${values.newSectionName}”`, { variant: 'success' });
      return;
    }

    const route = toRouteConfig(values);
    if (values.newSectionName) {
      addSection(values.newSectionName);
    }
    if (editingItem) {
      updateRoute(editingItem.id, route);
      if (values.section !== editingItem.sectionTitle || (values.parentId || '') !== (editingItem.parentId || '')) {
        moveRoute(editingItem.id, { section: values.section || '', parentId: values.parentId || undefined });
      }
      const updatedTableData = useManagedRouterStore.getState().routes;
      console.log('1. [Data edit route]:', {
        type: 'EDIT_ROUTE',
        id: editingItem.id,
        previousItem: editingItem,
        updatedValues: route,
        destination: { section: values.section || '', parentId: values.parentId || undefined },
      });
      console.log('2. [Data toàn bộ table]:', updatedTableData);
      enqueueSnackbar(`Đã cập nhật route “${values.title ?? ''}”`, { variant: 'success' });
    } else {
      const newRoute = { id: crypto.randomUUID(), ...route } as ManagedRoute;
      addRoute(newRoute, { section: values.section || '', parentId: values.parentId || undefined });
      const updatedTableData = useManagedRouterStore.getState().routes;
      console.log('1. [Data thêm mới route]:', {
        type: 'ADD_ROUTE',
        newRoute,
        destination: { section: values.section || '', parentId: values.parentId || undefined },
      });
      console.log('2. [Data toàn bộ table]:', updatedTableData);
      enqueueSnackbar(`Đã thêm route “${values.title ?? ''}”`, { variant: 'success' });
    }
  }, [addRoute, addSection, editingItem, enqueueSnackbar, moveRoute, updateRoute]);

  const handleMoveSibling = useCallback((item: RouterRowItem, offset: -1 | 1) => {
    const success = moveRouteSibling(item.id, offset);
    if (success) {
      const updatedTableData = useManagedRouterStore.getState().routes;
      console.log('1. [Data di chuyển thứ tự route]:', {
        type: 'MOVE_ROUTE_SIBLING',
        item,
        direction: offset === -1 ? 'UP' : 'DOWN',
      });
      console.log('2. [Data toàn bộ table]:', updatedTableData);
    } else {
      enqueueSnackbar('Route đã ở vị trí giới hạn', { variant: 'info' });
    }
  }, [moveRouteSibling, enqueueSnackbar]);

  const handleMoveSection = useCallback((sectionTitle: string, offset: -1 | 1) => {
    const success = moveSection(sectionTitle, offset);
    if (success) {
      const updatedTableData = useManagedRouterStore.getState().routes;
      console.log('1. [Data di chuyển nhóm menu]:', {
        type: 'MOVE_SECTION',
        sectionTitle,
        direction: offset === -1 ? 'UP' : 'DOWN',
      });
      console.log('2. [Data toàn bộ table]:', updatedTableData);
      enqueueSnackbar(`Đã di chuyển nhóm “${sectionTitle}”`, { variant: 'success' });
    }
  }, [moveSection, enqueueSnackbar]);

  const handleRenameSection = useCallback((oldTitle: string, newTitle: string) => {
    const success = renameSection(oldTitle, newTitle);
    if (success) {
      const updatedTableData = useManagedRouterStore.getState().routes;
      console.log('1. [Data edit nhóm menu (đổi tên)]:', {
        type: 'RENAME_SECTION',
        oldTitle,
        newTitle,
      });
      console.log('2. [Data toàn bộ table]:', updatedTableData);
      enqueueSnackbar(`Đã đổi tên nhóm thành “${newTitle}”`, { variant: 'success' });
    }
    return success;
  }, [renameSection, enqueueSnackbar]);

  const handleSaveInlineRow = useCallback((id: string, updates: Partial<ManagedRoute>) => {
    updateRoute(id, updates);
    const updatedTableData = useManagedRouterStore.getState().routes;
    console.log('1. [Data edit route (inline)]:', {
      type: 'INLINE_EDIT_ROUTE',
      id,
      updates,
    });
    console.log('2. [Data toàn bộ table]:', updatedTableData);
    enqueueSnackbar('Đã cập nhật route', { variant: 'success' });
  }, [updateRoute, enqueueSnackbar]);

  const handleDeleteSectionClick = useCallback((sectionTitle: string) => {
    const sec = sections.find((s) => s.title === sectionTitle);
    setDeletingSection({ title: sectionTitle, routeCount: sec?.routeCount ?? 0 });
  }, [sections]);

  const handleCloseEditor = useCallback(() => setEditorOpen(false), []);
  const handleOpenReset = useCallback(() => setResetOpen(true), []);
  const handleCloseReset = useCallback(() => setResetOpen(false), []);
  const handleCloseMove = useCallback(() => setMovingItem(undefined), []);
  const handleCloseDelete = useCallback(() => setDeletingItem(undefined), []);
  const handleCloseDeleteSection = useCallback(() => setDeletingSection(undefined), []);

  return (
    <AppPageContainer sx={{ p: { xs: 2, md: 3 } }} hideTitle>
      <Card sx={{ borderRadius: 2, boxShadow: (theme) => theme.customShadows.card, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <RouterToolbar filters={filters} sections={sections} onSearchChange={handleSearchChange} onSubheaderChange={handleSubheaderChange} onReset={resetFilters} onAdd={openAdd} onResetConfig={handleOpenReset} />
        {loading && <LinearProgress />}
        <RouterTreeTable
          sections={filteredSections}
          collapsedMap={collapsedMap}
          onToggleCollapse={toggleCollapse}
          onAddChild={openAdd}
          onEdit={openEdit}
          onMove={setMovingItem}
          onMoveSibling={handleMoveSibling}
          onMoveSection={handleMoveSection}
          onRenameSection={handleRenameSection}
          onSaveInlineRow={handleSaveInlineRow}
          onDelete={setDeletingItem}
          onDeleteSection={handleDeleteSectionClick}
        />
        <RouterStatusBar totalEntries={totalEntries} totalConfiguredEntries={totalConfiguredEntries} />
      </Card>

      {editorOpen && (
        <RouterEditorDialog
          open={editorOpen}
          config={routesConfig}
          initialItem={editingItem}
          suggestedParent={suggestedParent}
          onClose={handleCloseEditor}
          onSave={handleSave}
        />
      )}
      {Boolean(movingItem) && (
        <RouterMoveDialog
          key={movingItem?.id ?? 'move-dialog'}
          open={Boolean(movingItem)}
          item={movingItem}
          config={routesConfig}
          onClose={handleCloseMove}
          onMove={(destination) => {
            if (movingItem) {
              moveRoute(movingItem.id, destination);
              const updatedTableData = useManagedRouterStore.getState().routes;
              console.log('1. [Data di chuyển route (sang nhóm/cha khác)]:', {
                type: 'MOVE_ROUTE',
                item: movingItem,
                destination,
              });
              console.log('2. [Data toàn bộ table]:', updatedTableData);
              enqueueSnackbar(`Đã di chuyển route “${movingItem.title}”`, { variant: 'success' });
            }
          }}
        />
      )}
      {Boolean(deletingItem) && (
        <RouterConfirmDialog
          open={Boolean(deletingItem)}
          title="Xóa route?"
          message={`Route “${deletingItem?.title ?? ''}” và toàn bộ route con sẽ bị xóa khỏi phiên hiện tại.`}
          confirmLabel="Xóa route"
          onClose={handleCloseDelete}
          onConfirm={() => {
            if (deletingItem) {
              deleteRoute(deletingItem.id);
              const updatedTableData = useManagedRouterStore.getState().routes;
              console.log('1. [Data xóa route]:', {
                type: 'DELETE_ROUTE',
                item: deletingItem,
              });
              console.log('2. [Data toàn bộ table]:', updatedTableData);
              enqueueSnackbar(`Đã xóa route “${deletingItem.title}”`, { variant: 'success' });
            }
          }}
        />
      )}
      {resetOpen && (
        <RouterConfirmDialog
          open={resetOpen}
          title="Tải lại dữ liệu từ server?"
          message="Mọi thay đổi thêm, sửa, xóa và di chuyển chưa lưu trong phiên hiện tại sẽ bị hủy và dữ liệu được tải lại từ server."
          confirmLabel="Tải lại"
          color="warning"
          onClose={handleCloseReset}
          onConfirm={() => {
            reload().then((ok) => {
              if (ok) enqueueSnackbar('Đã tải lại dữ liệu từ server', { variant: 'success' });
              else enqueueSnackbar(useManagedRouterStore.getState().error ?? 'Không tải được danh sách menu', { variant: 'error' });
            });
          }}
        />
      )}
      {Boolean(deletingSection) && (
        <RouterConfirmDialog
          open={Boolean(deletingSection)}
          title="Xóa nhóm menu?"
          message={
            deletingSection?.routeCount
              ? `Nhóm “${deletingSection.title}” đang có ${deletingSection.routeCount} menu con. Bạn có chắc chắn muốn xóa nhóm này cùng toàn bộ menu con bên trong?`
              : `Bạn có chắc chắn muốn xóa nhóm menu “${deletingSection?.title ?? ''}”?`
          }
          confirmLabel="Xóa nhóm"
          onClose={handleCloseDeleteSection}
          onConfirm={() => {
            if (deletingSection) {
              deleteSection(deletingSection.title);
              const updatedTableData = useManagedRouterStore.getState().routes;
              console.log('1. [Data xóa nhóm menu]:', {
                type: 'DELETE_SECTION',
                section: deletingSection,
              });
              console.log('2. [Data toàn bộ table]:', updatedTableData);
              enqueueSnackbar(`Đã xóa nhóm menu “${deletingSection.title}”`, { variant: 'success' });
            }
          }}
        />
      )}
    </AppPageContainer>
  );
}
