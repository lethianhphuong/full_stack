import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from '@/components';

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  /** Chọn được nhiều file */
  multiple?: boolean;
  /** Loại file chấp nhận, VD: 'image/*' */
  accept?: string;
  /** Dung lượng tối đa mỗi file (MB) */
  maxSize?: number;
  /** Số file tối đa */
  maxFiles?: number;
};

// ----------------------------------------------------------------------

/** Format dung lượng file: KB / MB */
function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Upload — drag & drop + click chọn file, preview ảnh, validate dung lượng/số lượng.
 * Giá trị trong form: File[]
 *
 * @example
 * <BaseUpload name="attachments" label="Tệp đính kèm" multiple maxSize={5} />
 * <BaseUpload name="avatar" label="Ảnh đại diện" accept="image/*" />
 */
export default function BaseUpload({
  name,
  label,
  helperText,
  disabled,
  multiple,
  accept,
  maxSize,
  maxFiles,
}: Props) {
  const theme = useTheme();
  const { control } = useFormContext();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAdd = useCallback(
    (current: File[], incoming: FileList | File[], onChange: (files: File[]) => void) => {
      let next = [...current];
      const newFiles = Array.from(incoming);

      for (const file of newFiles) {
        // Validate dung lượng
        if (maxSize && file.size > maxSize * 1024 * 1024) {
          enqueueSnackbar(`File "${file.name}" vượt quá ${maxSize}MB`, { variant: 'warning' });
          continue;
        }
        // Validate số lượng
        if (maxFiles && next.length >= maxFiles) {
          enqueueSnackbar(`Chỉ được chọn tối đa ${maxFiles} file`, { variant: 'warning' });
          break;
        }
        // Bỏ qua file trùng tên + dung lượng
        if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
        next = multiple ? [...next, file] : [file];
      }

      onChange(next);
    },
    [enqueueSnackbar, maxFiles, maxSize, multiple]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const files: File[] = Array.isArray(field.value) ? field.value : [];

        const removeFile = (index: number) => {
          field.onChange(files.filter((_, i) => i !== index));
        };

        return (
          <FormControl fullWidth disabled={disabled} error={!!error}>
            {label && <FormLabel>{label}</FormLabel>}

            {/* Vùng drop */}
            <Card
              variant="outlined"
              onClick={() => !disabled && inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (!disabled && event.dataTransfer.files.length > 0) {
                  validateAndAdd(files, event.dataTransfer.files, field.onChange);
                }
              }}
              sx={{
                p: 3,
                cursor: disabled ? 'default' : 'pointer',
                textAlign: 'center',
                borderStyle: 'dashed',
                opacity: disabled ? 0.5 : 1,
                transition: theme.transitions.create(['background-color', 'border-color']),
                '&:hover': disabled
                  ? undefined
                  : {
                      borderColor: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
              }}
            >
              <Iconify icon="solar:upload-square-bold-duotone" width={40} sx={{ color: 'primary.main', mb: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Kéo thả file vào đây hoặc <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>chọn file</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {accept ? `Định dạng: ${accept}` : ''}
                {maxSize ? ` · Tối đa ${maxSize}MB` : ''}
                {maxFiles ? ` · Tối đa ${maxFiles} file` : ''}
              </Typography>
              <input
                ref={inputRef}
                type="file"
                hidden
                multiple={multiple}
                accept={accept}
                disabled={disabled}
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) {
                    validateAndAdd(files, event.target.files, field.onChange);
                  }
                  event.target.value = ''; // reset để chọn lại cùng file
                }}
              />
            </Card>

            {/* Danh sách file đã chọn */}
            {files.length > 0 && (
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {files.map((file, index) => (
                  <FileItem key={`${file.name}-${file.size}`} file={file} onRemove={() => removeFile(index)} />
                ))}
              </Stack>
            )}

            {(error?.message ?? helperText) && (
              <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

type FileItemProps = {
  file: File;
  onRemove: () => void;
};

/** Item hiển thị 1 file — quản lý object URL riêng, revoke khi unmount để tránh leak bộ nhớ */
function FileItem({ file, onRemove }: FileItemProps) {
  const isImage = file.type.startsWith('image/');

  const previewUrl = useMemo(() => (isImage ? URL.createObjectURL(file) : null), [file, isImage]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {isImage && previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt={file.name}
            sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
          />
        ) : (
          <Iconify icon="solar:document-bold-duotone" width={32} sx={{ color: 'text.disabled', flexShrink: 0 }} />
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" noWrap>
            {file.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {formatFileSize(file.size)}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onRemove} aria-label="Xóa file">
          <Iconify icon="solar:trash-bin-trash-bold" width={18} sx={{ color: 'error.main' }} />
        </IconButton>
      </Stack>
    </Card>
  );
}
