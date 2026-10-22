import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from '@/components';
import type { DocumentItem } from '../types/document.types';
import DocumentFileIcon from './DocumentFileIcon';
import DocumentFileTypeChip from './DocumentFileTypeChip';
import { formatBytes, formatDate } from '../utils/document.utils';
import { ACTION_ICONS } from '../constants/document.constants';

export interface DocumentCardProps {
  document: DocumentItem;
  onOpen: (id: string, readOnly?: boolean) => void;
  onDownload: (id: string) => void;
  onDelete: (doc: DocumentItem) => void;
}

export default function DocumentCard({
  document: doc,
  onOpen,
  onDownload,
  onDelete,
}: DocumentCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <DocumentFileIcon fileType={doc.fileType} size={48} iconSize={28} />
          <DocumentFileTypeChip fileType={doc.fileType} />
        </Stack>

        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
            noWrap
            onClick={() => onOpen(doc.id)}
          >
            {doc.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ mt: 0.25 }}>
            {doc.fileName}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {formatBytes(doc.fileSize)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(doc.updatedAt || doc.createdAt)}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 2.5, pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}
      >
        <Button
          size="small"
          variant="contained"
          fullWidth
          startIcon={<Iconify icon={ACTION_ICONS.edit} />}
          onClick={() => onOpen(doc.id, false)}
          sx={{
            borderRadius: 1.25,
            fontWeight: 600,
          }}
        >
          Sửa
        </Button>
        <IconButton
          size="small"
          onClick={() => onDownload(doc.id)}
          sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.25 }}
        >
          <Iconify icon={ACTION_ICONS.download} width={18} />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(doc)}
          sx={{
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            borderRadius: 1.25,
            bgcolor: alpha(theme.palette.error.main, 0.04),
          }}
        >
          <Iconify icon={ACTION_ICONS.delete} width={18} />
        </IconButton>
      </Stack>
    </Card>
  );
}
