import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Iconify from '@/components/iconify';
import { OnlyOfficeEditor } from '@/components/only-office';
import { FILE_TYPE_ICONS, type OnlyOfficeConfig, type OnlyOfficeTheme, type SupportedFileType } from '@/components/only-office/types';
import { documentService } from '@/services/onlyoffice';

// ----------------------------------------------------------------------

export default function OnlyOfficeFullscreenPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const readOnlyParam = searchParams.get('readOnly') === 'true';

  const [editorConfig, setEditorConfig] = useState<OnlyOfficeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorTheme, setEditorTheme] = useState<OnlyOfficeTheme>('theme-classic-light');

  const fetchConfig = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await documentService.getDocumentConfig(id, readOnlyParam);
      if (res?.success && res?.data) {
        setEditorConfig(res.data);
      } else {
        setError(res?.message || 'Không thể tải cấu hình tài liệu từ máy chủ.');
      }
    } catch (e: unknown) {
      console.error('[OnlyOfficeFullscreen] Lỗi nạp tài liệu:', e);
      const message = (e as { message?: string })?.message || 'Không thể kết nối đến máy chủ Backend Spring Boot.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id, readOnlyParam]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Cập nhật title của tab trình duyệt theo tên tài liệu
  useEffect(() => {
    if (editorConfig?.displayName) {
      document.title = `${editorConfig.displayName} - OnlyOffice Editor`;
    }
    return () => {
      document.title = 'Material UI Application';
    };
  }, [editorConfig?.displayName]);

  const navigate = useNavigate();

  const handleDownload = useCallback(() => {
    if (id) {
      documentService.downloadDocument(id);
    }
  }, [id]);

  const handleBack = useCallback(() => {
    if (window.opener && !window.opener.closed) {
      window.close();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/components/onlyoffice-editor');
    }
  }, [navigate]);

  const handleCloseTab = useCallback(() => {
    window.close();
    navigate('/components/onlyoffice-editor');
  }, [navigate]);

  const fileType = (editorConfig?.config?.document?.fileType || 'docx').toLowerCase() as SupportedFileType;
  const isReadOnly = readOnlyParam;

  if (loading) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          bgcolor: '#F4F6F8',
        }}
      >
        <CircularProgress size={48} sx={{ color: '#00A76F' }} />
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Đang khởi tạo trình soạn thảo OnlyOffice...
        </Typography>
      </Box>
    );
  }

  if (error || !editorConfig) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          bgcolor: '#F4F6F8',
        }}
      >
        <Alert
          severity="error"
          sx={{ maxWidth: 500, mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchConfig}>
              Thử lại
            </Button>
          }
        >
          <strong>Không thể mở tài liệu</strong>
          <br />
          {error || 'Không tìm thấy dữ liệu tài liệu'}
        </Alert>
        <Button variant="outlined" startIcon={<Iconify icon="solar:close-circle-bold" />} onClick={handleCloseTab}>
          Đóng tab
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar màu xanh ngọc bích sang trọng */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: 48,
          px: 2,
          background: 'linear-gradient(135deg, #00A76F 0%, #007867 100%)',
          color: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 120, 103, 0.25)',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Left: Back Button, File Icon, Title, Badges */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <Tooltip title="Quay lại danh sách tài liệu">
            <IconButton
              size="small"
              onClick={handleBack}
              sx={{
                color: '#FFFFFF',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.35)' },
              }}
            >
              <Iconify icon="solar:arrow-left-bold" width={18} />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Iconify icon={FILE_TYPE_ICONS[fileType] || 'solar:file-bold'} width={18} sx={{ color: '#FFFFFF' }} />
          </Box>

          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: 14, letterSpacing: 0.2 }}
          >
            {editorConfig.displayName || editorConfig.config?.document?.title || 'Tài liệu'}
          </Typography>

          <Chip
            size="small"
            label={fileType.toUpperCase()}
            sx={{
              height: 20,
              fontSize: 10,
              fontWeight: 700,
              bgcolor: 'rgba(255, 255, 255, 0.22)',
              color: '#FFFFFF',
            }}
          />

          <Chip
            size="small"
            icon={
              <Iconify
                icon={isReadOnly ? 'solar:eye-bold' : 'solar:pen-bold'}
                width={12}
                sx={{ color: '#FFFFFF !important' }}
              />
            }
            label={isReadOnly ? 'Chỉ xem' : 'Chỉnh sửa'}
            sx={{
              height: 20,
              fontSize: 11,
              bgcolor: isReadOnly ? 'rgba(255, 171, 0, 0.35)' : 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              '& .MuiChip-label': { px: 0.8 },
            }}
          />

        </Stack>

        {/* Right: Theme Toggle, Download, Close Tab */}
        <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
          {/* Theme switcher */}
          <ToggleButtonGroup
            size="small"
            value={editorTheme}
            exclusive
            onChange={(_, newTheme) => {
              if (newTheme) setEditorTheme(newTheme);
            }}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.18)',
              borderRadius: 1,
              p: 0.2,
              '& .MuiToggleButton-root': {
                border: 'none',
                color: 'rgba(255, 255, 255, 0.75)',
                py: 0.2,
                px: 0.8,
                fontSize: 11,
                textTransform: 'none',
                '&.Mui-selected': {
                  bgcolor: '#FFFFFF',
                  color: '#007867',
                  fontWeight: 700,
                  borderRadius: 0.8,
                },
              },
            }}
          >
            <ToggleButton value="theme-classic-light" title="Giao diện chuẩn Office (Excel màu xanh lá)">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Iconify icon="solar:leaf-bold" width={12} />
                <span>Cổ điển</span>
              </Stack>
            </ToggleButton>
            <ToggleButton value="theme-light" title="Giao diện sáng hiện đại">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Iconify icon="solar:sun-bold" width={12} />
                <span>Sáng</span>
              </Stack>
            </ToggleButton>
            <ToggleButton value="theme-dark" title="Giao diện tối">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Iconify icon="solar:moon-bold" width={12} />
                <span>Tối</span>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.25)', my: 0.5 }} />

          <Tooltip title="Tải file về máy tính">
            <Button
              size="small"
              variant="outlined"
              onClick={handleDownload}
              startIcon={<Iconify icon="solar:download-minimalistic-bold" width={14} />}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                textTransform: 'none',
                fontSize: 12,
                py: 0.3,
                '&:hover': {
                  borderColor: '#FFFFFF',
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              Tải về
            </Button>
          </Tooltip>

          <Tooltip title="Đóng tab tài liệu này">
            <IconButton
              size="small"
              onClick={handleCloseTab}
              sx={{
                color: '#FFFFFF',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              <Iconify icon="solar:close-circle-bold" width={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Vùng Editor OnlyOffice Toàn màn hình 100vw x calc(100vh - 48px) */}
      <Box sx={{ flex: 1, width: '100%', height: 'calc(100vh - 48px)', bgcolor: '#F4F6F8' }}>
        <OnlyOfficeEditor
          key={`${id}-${editorConfig.config?.document?.key}-${editorTheme}`}
          config={editorConfig}
          editorTheme={editorTheme}
          readOnly={isReadOnly}
          onDocumentReady={() => {
            console.log('[OnlyOfficeFullscreen] Tài liệu đã sẵn sàng:', id);
          }}
          onError={(err) => {
            console.error('[OnlyOfficeFullscreen] Lỗi OnlyOffice:', err);
          }}
        />
      </Box>
    </Box>
  );
}
