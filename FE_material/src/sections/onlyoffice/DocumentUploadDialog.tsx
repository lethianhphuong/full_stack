import { useState, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';
import { CustomDialog, Iconify } from '@/components';
import { documentService } from '@/services';

// ----------------------------------------------------------------------

const ALLOWED_EXTENSIONS = ['docx', 'xlsx', 'pptx', 'pdf'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ----------------------------------------------------------------------

export default function DocumentUploadDialog({ open, onClose, onSuccess }: Props) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setTitle('');
    setError(null);
    setLoading(false);
    setIsDragOver(false);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    resetState();
    onClose();
  }, [loading, resetState, onClose]);

  const validateAndSetFile = useCallback((file: File) => {
    setError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Chỉ hỗ trợ các định dạng file: ${ALLOWED_EXTENSIONS.map((e) => '.' + e).join(', ')}`);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Dung lượng file không được vượt quá 50MB.');
      return;
    }
    setSelectedFile(file);
    setTitle(file.name);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn một file tài liệu.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await documentService.uploadDocument(selectedFile, title.trim());
      if (!res.success) {
        throw new Error(res.message || 'Upload thất bại');
      }

      resetState();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Đã có lỗi xảy ra khi upload file';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title="Tải lên tài liệu mới"
      subtitle="Hỗ trợ các định dạng Word (.docx), Excel (.xlsx), PowerPoint (.pptx), PDF (.pdf)"
      titleIcon={
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
          }}
        >
          <Iconify icon="solar:cloud-upload-bold-duotone" width={24} />
        </Box>
      }
      actions={
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
          <Button variant="outlined" color="inherit" onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="solar:upload-bold" />}
          >
            {loading ? 'Đang tải lên...' : 'Tải lên tài liệu'}
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

        <Box
          component="input"
          ref={fileInputRef}
          type="file"
          accept=".docx,.xlsx,.pptx,.pdf"
          sx={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 3,
            border: `2px dashed ${
              isDragOver ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.32)
            }`,
            borderRadius: 2,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragOver
              ? alpha(theme.palette.primary.main, 0.04)
              : alpha(theme.palette.grey[500], 0.02),
            transition: theme.transitions.create(['border-color', 'background-color']),
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <Iconify icon="solar:cloud-upload-bold-duotone" width={32} />
          </Box>
          <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
            Kéo & thả file vào đây hoặc <Box component="span" sx={{ color: 'primary.main' }}>chọn từ máy tính</Box>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Kích thước tối đa: 50MB (DOCX, XLSX, PPTX, PDF)
          </Typography>
        </Box>

        {selectedFile && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  boxShadow: theme.shadows[1],
                }}
              >
                <Iconify icon="solar:document-bold-duotone" width={24} />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
              <Button
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setTitle('');
                }}
              >
                Gỡ bỏ
              </Button>
            </Stack>
          </Box>
        )}

        <TextField
          fullWidth
          label="Tên hiển thị tài liệu"
          placeholder="Nhập tiêu đề hoặc tên tài liệu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading || !selectedFile}
          helperText="Mặc định lấy theo tên file gốc"
        />
      </Stack>
    </CustomDialog>
  );
}
