import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';
import { CustomDialog, Iconify } from '@/components';
import { documentService } from '@/services';

// ----------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (newDoc: { id: string; title: string }) => void;
}

const TEMPLATE_OPTIONS = [
  {
    type: 'docx',
    title: 'Word Document',
    desc: 'Tài liệu văn bản (.docx)',
    color: '#2B579A',
    icon: 'solar:document-text-bold-duotone',
    defaultTitle: 'Tài liệu mới',
  },
  {
    type: 'xlsx',
    title: 'Excel Spreadsheet',
    desc: 'Bảng tính trực tuyến (.xlsx)',
    color: '#217346',
    icon: 'solar:chart-square-bold-duotone',
    defaultTitle: 'Bảng tính mới',
  },
  {
    type: 'pptx',
    title: 'PowerPoint Presentation',
    desc: 'Trình chiếu slide (.pptx)',
    color: '#B7472A',
    icon: 'solar:presentation-graph-bold-duotone',
    defaultTitle: 'Bài thuyết trình mới',
  },
];

// ----------------------------------------------------------------------

export default function DocumentCreateDialog({ open, onClose, onSuccess }: Props) {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState('docx');
  const [title, setTitle] = useState('Tài liệu mới');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTemplate = (type: string, defaultTitle: string) => {
    setSelectedType(type);
    setTitle(defaultTitle);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Vui lòng nhập tên tài liệu');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await documentService.createEmptyDocument({
        title: title.trim(),
        fileType: selectedType,
      });

      if (!res.success) {
        throw new Error(res.message || 'Tạo file thất bại');
      }

      onSuccess(res.data);
      onClose();
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Lỗi khi tạo tài liệu mới';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title="Tạo tài liệu mới"
      subtitle="Khởi tạo tài liệu trắng và chỉnh sửa trực tiếp với OnlyOffice"
      titleIcon={
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            color: 'info.main',
          }}
        >
          <Iconify icon="solar:document-add-bold-duotone" width={24} />
        </Box>
      }
      actions={
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
          <Button variant="outlined" color="inherit" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:check-circle-bold" />}
          >
            {loading ? 'Đang tạo...' : 'Tạo và Mở'}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Chọn định dạng tài liệu:
        </Typography>

        <Stack direction="row" spacing={1.5}>
          {TEMPLATE_OPTIONS.map((item) => {
            const isSelected = selectedType === item.type;
            return (
              <Box
                key={item.type}
                sx={{
                  flex: 1,
                  borderRadius: 1.5,
                  border: `2px solid ${isSelected ? item.color : theme.palette.divider}`,
                  backgroundColor: isSelected ? alpha(item.color, 0.06) : 'transparent',
                  overflow: 'hidden',
                  transition: theme.transitions.create(['all']),
                }}
              >
                <CardActionArea
                  onClick={() => handleSelectTemplate(item.type, item.defaultTitle)}
                  sx={{ p: 2, textAlign: 'center' }}
                >
                  <Box sx={{ color: item.color, mb: 1, display: 'flex', justifyContent: 'center' }}>
                    <Iconify icon={item.icon} width={36} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardActionArea>
              </Box>
            );
          })}
        </Stack>

        <TextField
          fullWidth
          label="Tên tài liệu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          autoFocus
        />
      </Stack>
    </CustomDialog>
  );
}
