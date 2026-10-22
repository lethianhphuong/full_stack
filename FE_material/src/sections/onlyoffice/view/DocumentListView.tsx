import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { useTheme } from '@mui/material/styles';
import { Iconify } from '@/components';

import { useDocuments } from '../hooks/useDocuments';
import { documentService } from '@/services';
import type { DocumentItem, DocumentStats, SortOptionValue, ViewMode } from '../types/document.types';
import { PAGE_SIZE_OPTIONS, ACTION_ICONS } from '../constants/document.constants';

import DocumentUploadDialog from '../DocumentUploadDialog';
import DocumentCreateDialog from '../DocumentCreateDialog';
import {
  DocumentStatsCards,
  DocumentFilterTabs,
  DocumentToolbar,
  DocumentTable,
  DocumentGrid,
  DeleteDocumentDialog,
} from '../components';

export type { DocumentItem, DocumentStats };

// ----------------------------------------------------------------------

export default function DocumentListView() {
  const theme = useTheme();

  // Coordinator Hook
  const {
    documents,
    stats,
    totalElements,
    loading,
    page,
    rowsPerPage,
    searchTerm,
    selectedFilter,
    sortBy,
    viewMode,
    setPage,
    setRowsPerPage,
    setSearchTerm,
    setSelectedFilter,
    setSortBy,
    setViewMode,
    refresh,
    deleteDocument,
  } = useDocuments();

  // Dialog State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const BASENAME = (import.meta.env.VITE_APP_BASENAME || '').replace(/\/$/, '');

  // Navigation & Action callbacks
  const handleOpenInNewTab = useCallback(
    (docId: string, readOnly = false) => {
      const basePath = BASENAME ? `${BASENAME}` : '';
      const cleanUrl = `${basePath}/documents/${docId}/view${readOnly ? '?readOnly=true' : ''}`.replace(/\/+/g, '/');
      window.open(cleanUrl, '_blank');
    },
    [BASENAME]
  );

  const handleDownload = useCallback((docId: string) => {
    window.open(documentService.getDownloadUrl(docId), '_blank');
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const success = await deleteDocument(deleteTarget.id);
      if (success) {
        setDeleteTarget(null);
      }
    } catch (e) {
      console.error('Lỗi khi xóa file:', e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack spacing={3}>
      {/* 1. Header & Quick Actions */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Tài liệu văn phòng
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Trang chủ
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              Tiện ích
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Quản lý tài liệu
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon={ACTION_ICONS.create} />}
            onClick={() => setCreateOpen(true)}
            sx={{
              borderRadius: 1.5,
              fontWeight: 600,
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': { border: `1px solid ${theme.palette.text.primary}` },
            }}
          >
            Tạo tài liệu mới
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon={ACTION_ICONS.upload} />}
            onClick={() => setUploadOpen(true)}
            sx={{
              borderRadius: 1.5,
              fontWeight: 600,
              boxShadow: theme.customShadows?.primary || 'none',
            }}
          >
            Tải lên tài liệu
          </Button>
        </Stack>
      </Stack>

      {/* 2. Dải Thống kê kiểu Minimals thống nhất */}
      <DocumentStatsCards
        stats={stats}
        selectedFilter={selectedFilter}
        onFilterChange={(filter: string) => {
          setSelectedFilter(filter);
          setPage(0);
        }}
      />

      {/* 3. Khung hiển thị dữ liệu chính (Main Card Server-Side Filtered) */}
      <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.customShadows?.card || 1 }}>
        {/* Tabs lọc định dạng */}
        <DocumentFilterTabs
          value={selectedFilter}
          stats={stats}
          onChange={(filter: string) => {
            setSelectedFilter(filter);
            setPage(0);
          }}
        />

        {/* Thanh công cụ Tìm kiếm, Sắp xếp, View mode & Refresh */}
        <DocumentToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          sortBy={sortBy}
          onSortChange={(val: SortOptionValue) => {
            setSortBy(val);
            setPage(0);
          }}
          viewMode={viewMode}
          onViewModeChange={(mode: ViewMode) => setViewMode(mode)}
          onRefresh={refresh}
          loading={loading}
        />

        {/* Bảng dữ liệu / Lưới thẻ tài liệu */}
        {viewMode === 'table' ? (
          <DocumentTable
            documents={documents}
            loading={loading}
            onOpen={handleOpenInNewTab}
            onDownload={handleDownload}
            onDelete={(doc: DocumentItem) => setDeleteTarget(doc)}
          />
        ) : (
          <DocumentGrid
            documents={documents}
            loading={loading}
            onOpen={handleOpenInNewTab}
            onDownload={handleDownload}
            onDelete={(doc: DocumentItem) => setDeleteTarget(doc)}
          />
        )}

        {/* Phân trang Server-side */}
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} trên tổng số ${count !== -1 ? count : `hơn ${to}`}`}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </Card>

      {/* Dialog Upload tài liệu */}
      <DocumentUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={refresh}
      />

      {/* Dialog Tạo mới tài liệu */}
      <DocumentCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(newDoc) => {
          refresh();
          if (newDoc?.id) {
            handleOpenInNewTab(newDoc.id);
          }
        }}
      />

      {/* Dialog Xác nhận Xóa */}
      <DeleteDocumentDialog
        open={Boolean(deleteTarget)}
        document={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  );
}
