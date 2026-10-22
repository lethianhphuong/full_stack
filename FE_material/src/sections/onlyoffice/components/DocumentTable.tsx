import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CustomTable, Iconify, type CustomTableColumn } from '@/components';
import type { DocumentItem } from '../types/document.types';
import DocumentFileIcon from './DocumentFileIcon';
import DocumentFileTypeChip from './DocumentFileTypeChip';
import DocumentActionsMenu from './DocumentActionsMenu';
import { formatBytes, formatDate } from '../utils/document.utils';
import { ACTION_ICONS } from '../constants/document.constants';

export interface DocumentTableProps {
  documents: DocumentItem[];
  loading?: boolean;
  emptyText?: string;
  onOpen: (id: string, readOnly?: boolean) => void;
  onDownload: (id: string) => void;
  onDelete: (doc: DocumentItem) => void;
}

export default function DocumentTable({
  documents,
  loading = false,
  emptyText = 'Không tìm thấy tài liệu nào phù hợp',
  onOpen,
  onDownload,
  onDelete,
}: DocumentTableProps) {
  const columns: CustomTableColumn<DocumentItem>[] = useMemo(
    () => [
      {
        id: 'title',
        label: 'Tài liệu',
        minWidth: 280,
        render: (doc) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <DocumentFileIcon fileType={doc.fileType} size={44} iconSize={26} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle2"
                noWrap
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(doc.id);
                }}
                sx={{
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                }}
              >
                {doc.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {doc.fileName}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        id: 'fileType',
        label: 'Định dạng',
        width: 130,
        render: (doc) => <DocumentFileTypeChip fileType={doc.fileType} />,
      },
      {
        id: 'fileSize',
        label: 'Dung lượng',
        width: 120,
        render: (doc) => (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {formatBytes(doc.fileSize)}
          </Typography>
        ),
      },
      {
        id: 'updatedAt',
        label: 'Cập nhật lần cuối',
        width: 170,
        render: (doc) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatDate(doc.updatedAt || doc.createdAt)}
          </Typography>
        ),
      },
      {
        id: 'actions',
        label: 'Thao tác',
        align: 'right',
        width: 140,
        render: (doc) => (
          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon={ACTION_ICONS.edit} width={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onOpen(doc.id, false);
              }}
              sx={{
                borderRadius: 1.25,
                textTransform: 'none',
                fontWeight: 600,
                px: 1.5,
                py: 0.5,
              }}
            >
              Sửa
            </Button>

            <DocumentActionsMenu
              document={doc}
              onEdit={() => onOpen(doc.id, false)}
              onView={() => onOpen(doc.id, true)}
              onDownload={() => onDownload(doc.id)}
              onDelete={() => onDelete(doc)}
            />
          </Stack>
        ),
      },
    ],
    [onOpen, onDownload, onDelete]
  );

  return (
    <CustomTable
      columns={columns}
      data={documents}
      loading={loading}
      emptyText={emptyText}
      rowKey={(row) => row.id}
    />
  );
}
