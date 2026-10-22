import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Iconify } from '@/components';
import type { DocumentItem } from '../types/document.types';
import DocumentCard from './DocumentCard';
import { ACTION_ICONS } from '../constants/document.constants';

export interface DocumentGridProps {
  documents: DocumentItem[];
  loading?: boolean;
  emptyText?: string;
  onOpen: (id: string, readOnly?: boolean) => void;
  onDownload: (id: string) => void;
  onDelete: (doc: DocumentItem) => void;
}

export default function DocumentGrid({
  documents,
  loading = false,
  emptyText = 'Không tìm thấy tài liệu nào phù hợp',
  onOpen,
  onDownload,
  onDelete,
}: DocumentGridProps) {
  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 1 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (documents.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 1,
        }}
      >
        <Iconify icon={ACTION_ICONS.empty} width={56} sx={{ color: 'text.disabled', mb: 1.5 }} />
        <Typography variant="body1" color="text.secondary">
          {emptyText}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2.5,
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2.5,
      }}
    >
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onOpen={onOpen}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
