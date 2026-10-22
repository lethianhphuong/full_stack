import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Chiều cao tối thiểu vùng soạn thảo (px) */
  minHeight?: number;
};

// ----------------------------------------------------------------------

/**
 * RichText Editor — dùng React Quill (giống template Minimal Dashboard).
 * Giá trị lưu dạng HTML string trong form.
 *
 * LƯU Ý CÀI ĐẶT (máy local):
 *   npm i react-quill-new
 *   (bản fork của react-quill đã hỗ trợ React 19)
 *   Sau khi cài xong, XÓA file src/types/react-quill-new.d.ts
 *
 * @example
 * <BaseEditor name="content" label="Nội dung" placeholder="Viết gì đó hay ho..." />
 */
export default function BaseEditor({
  name,
  label,
  helperText,
  disabled,
  placeholder = 'Write something awesome...',
  minHeight = 200,
}: Props) {
  const theme = useTheme();
  const { control } = useFormContext();

  // Cấu hình toolbar — memoize để Quill không bị re-init khi render lại
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['blockquote', 'code-block', 'link'],
        ['clean'],
      ],
    }),
    []
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth disabled={disabled} error={!!error}>
          {label && (
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {label}
            </Typography>
          )}

          <Box
            sx={{
              // Style Quill theo theme MUI
              '& .quill': { display: 'flex', flexDirection: 'column' },
              '& .ql-toolbar': {
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderColor: theme.palette.divider,
                bgcolor: alpha(theme.palette.grey[500], 0.06),
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 0.5,
              },
              '& .ql-container': {
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderColor: error ? theme.palette.error.main : theme.palette.divider,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body2.fontSize,
                color: theme.palette.text.primary,
                transition: theme.transitions.create(['border-color']),
                '&.ql-focused': {
                  borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(
                    error ? theme.palette.error.main : theme.palette.primary.main,
                    0.15
                  )}`,
                },
              },
              '& .ql-editor': {
                minHeight,
                '&.ql-blank::before': {
                  fontStyle: 'normal',
                  color: theme.palette.text.disabled,
                },
              },
              // Icon & text trên toolbar
              '& .ql-toolbar button, & .ql-toolbar .ql-picker-label': {
                color: theme.palette.text.secondary,
              },
              '& .ql-toolbar button:hover, & .ql-toolbar button.ql-active': {
                color: theme.palette.primary.main,
              },
              '& .ql-toolbar .ql-stroke': { stroke: 'currentColor' },
              '& .ql-toolbar .ql-fill': { fill: 'currentColor' },
              '& .ql-toolbar .ql-picker-label:hover, & .ql-toolbar .ql-picker-label.ql-active': {
                color: theme.palette.primary.main,
              },
              // Nội dung trong editor
              '& .ql-editor a': { color: theme.palette.primary.main },
              '& .ql-editor blockquote': {
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                color: theme.palette.text.secondary,
              },
              '& .ql-editor pre.ql-syntax': {
                bgcolor: theme.palette.grey[900],
                color: theme.palette.grey[100],
                borderRadius: 1,
              },
            }}
          >
            <ReactQuill
              theme="snow"
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value)}
              onBlur={() => field.onBlur()}
              readOnly={disabled}
              placeholder={placeholder}
              modules={modules}
            />
          </Box>

          {(error?.message ?? helperText) && (
            <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
