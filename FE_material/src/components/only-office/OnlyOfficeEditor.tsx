import { memo, useCallback, useMemo, useState, useId } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { DocumentEditor } from '@onlyoffice/document-editor-react';
import type { DocumentEditorProps } from '@onlyoffice/document-editor-react';
import { usePreferencesStore } from '@/store';
import type { OnlyOfficeEditorProps } from './types';

// ----------------------------------------------------------------------

const OnlyOfficeEditor = memo(function OnlyOfficeEditor({
  config,
  editorTheme,
  readOnly = false,
  onDocumentReady,
  onError,
}: OnlyOfficeEditorProps) {
  const { themeMode } = usePreferencesStore();
  const isDark = themeMode === 'dark';

  const [dangTai, setDangTai] = useState(true);
  const [loiTaiApi, setLoiTaiApi] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const fallbackId = useId();

  const documentServerUrl = config?.documentServerUrl;
  const innerConfig = config?.config;

  const editorId = useMemo(() => {
    return `onlyoffice-editor-${innerConfig?.document?.key || fallbackId.replace(/:/g, '_')}`;
  }, [innerConfig?.document?.key, fallbackId]);

  // Ưu tiên editorTheme truyền vào, nếu không có thì sáng dùng theme-classic-light, tối dùng theme-dark
  const resolvedTheme = editorTheme || (isDark ? 'theme-dark' : 'theme-classic-light');

  const editorConfig = useMemo<DocumentEditorProps['config'] | null>(() => {
    if (!innerConfig) return null;

    const fileType = (innerConfig.document?.fileType || '').toLowerCase();
    const isPdf = fileType === 'pdf';
    const canEdit = !readOnly;
    const mode = readOnly ? 'view' : 'edit';
    const resolvedDocType = isPdf ? 'pdf' : (innerConfig.documentType || 'word');

    return {
      ...innerConfig,
      documentType: resolvedDocType,
      document: {
        ...innerConfig.document,
        permissions: {
          ...innerConfig.document?.permissions,
          edit: canEdit,
          review: canEdit,
          comment: canEdit,
          fillForms: canEdit,
          modifyFilter: canEdit,
          modifyContentControl: canEdit,
          copy: true,
          download: true,
          print: true,
        },
      },
      editorConfig: {
        ...innerConfig.editorConfig,
        mode,
        customization: {
          ...innerConfig.editorConfig?.customization,
          uiTheme: resolvedTheme,
          logo: {
            visible: false,
            image: '',
            url: '',
            ...(innerConfig.editorConfig?.customization?.logo || {}),
          },
          help: false,
          feedback: false,
        },
      },
      height: '100%',
      width: '100%',
      type: 'desktop',
    } as unknown as DocumentEditorProps['config'];
  }, [innerConfig, resolvedTheme, readOnly]);

  const handleAppReady = useCallback(() => {
    setDangTai(false);
  }, []);

  const handleDocumentReady = useCallback(() => {
    setDangTai(false);
    onDocumentReady?.();
  }, [onDocumentReady]);

  const handleError = useCallback(
    (event: object) => {
      const errorEvent = event as { data?: { errorCode?: number; errorDescription?: string } };
      const errorMsg = errorEvent?.data?.errorDescription || 'Lỗi không xác định từ trình soạn thảo';
      setLoiTaiApi(errorMsg);
      setDangTai(false);
      onError?.(event);
    },
    [onError]
  );

  const handleLoadComponentError = useCallback(
    (errorCode: number, errorDescription: string) => {
      let errorMsg = 'Không thể tải trình soạn thảo';
      switch (errorCode) {
        case -1:
          errorMsg = 'Lỗi không xác định khi tải trình soạn thảo';
          break;
        case -2:
          errorMsg = 'Không thể kết nối đến Document Server. Vui lòng kiểm tra kết nối mạng.';
          break;
        case -3:
          errorMsg = 'DocsAPI không được định nghĩa. Document Server có thể chưa sẵn sàng.';
          break;
        default:
          errorMsg = errorDescription || 'Không thể tải trình soạn thảo';
      }
      setLoiTaiApi(errorMsg);
      setDangTai(false);
      onError?.({ errorCode, errorDescription });
    },
    [onError]
  );

  const handleRetry = useCallback(() => {
    setLoiTaiApi(null);
    setDangTai(true);
    setRetryKey((prev) => prev + 1);
  }, []);

  // Thiếu cấu hình
  if (!documentServerUrl || !editorConfig) {
    return (
      <Box sx={{ width: 1, height: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="warning" sx={{ maxWidth: 480 }}>
          <strong>Thiếu cấu hình trình soạn thảo</strong>
          <br />
          Không có thông tin cấu hình để tải trình soạn thảo.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 1, height: 1, position: 'relative' }}>
      {/* Overlay loading */}
      {dangTai && !loiTaiApi && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            bgcolor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)',
          }}
        >
          <CircularProgress size={40} />
          <Box sx={{ color: isDark ? 'common.white' : 'text.primary' }}>
            Đang tải trình soạn thảo...
          </Box>
        </Box>
      )}

      {/* Overlay lỗi */}
      {loiTaiApi && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)',
          }}
        >
          <Alert
            severity="error"
            sx={{ maxWidth: 520 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Thử lại
              </Button>
            }
          >
            <strong>Không thể tải trình soạn thảo tài liệu</strong>
            <br />
            {loiTaiApi}
          </Alert>
        </Box>
      )}

      {editorConfig && (
        <DocumentEditor
          key={`${editorId}-${retryKey}`}
          id={editorId}
          documentServerUrl={documentServerUrl}
          config={editorConfig}
          events_onAppReady={handleAppReady}
          events_onDocumentReady={handleDocumentReady}
          events_onError={handleError}
          onLoadComponentError={handleLoadComponentError}
        />
      )}
    </Box>
  );
});

export default OnlyOfficeEditor;
