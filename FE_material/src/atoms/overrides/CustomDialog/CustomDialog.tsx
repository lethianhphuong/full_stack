import { useId } from 'react';
import type { ReactNode, Ref } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import type { DialogProps } from '@mui/material/Dialog';
import type { SxProps, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

export interface CustomDialogProps extends Omit<DialogProps, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  actions?: ReactNode;
  actionsSx?: SxProps<Theme>;
  contentRef?: Ref<HTMLDivElement>;
  onCloseButtonClick?: () => void;
  showCloseButton?: boolean;
  dividers?: boolean;
}

// ----------------------------------------------------------------------

export default function CustomDialog({
  open,
  onClose,
  title,
  subtitle,
  titleIcon,
  actions,
  actionsSx,
  contentRef,
  onCloseButtonClick,
  showCloseButton = true,
  dividers = false,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  scroll = 'paper',
  'aria-labelledby': ariaLabelledBy,
  ...other
}: CustomDialogProps) {
  const titleId = useId();
  const resolvedTitleId = ariaLabelledBy ?? (title ? titleId : undefined);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      aria-labelledby={resolvedTitleId}
      {...other}
    >
      {(title || showCloseButton) && (
        <DialogTitle id={resolvedTitleId} sx={{ m: 0, p: 2.5, pb: subtitle ? 1 : 2, flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
              {titleIcon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{titleIcon}</Box>}
              <Box sx={{ minWidth: 0 }}>
                {typeof title === 'string' ? (
                  <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                ) : (
                  title
                )}
                {subtitle && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>

            {showCloseButton && (onClose || onCloseButtonClick) && (
              <IconButton
                aria-label="Đóng hộp thoại"
                onClick={(event) => {
                  if (onCloseButtonClick) onCloseButtonClick();
                  else onClose?.(event, 'escapeKeyDown');
                }}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                  p: 0.75,
                }}
              >
                <Iconify icon="solar:close-circle-bold" width={22} />
              </IconButton>
            )}
          </Stack>
        </DialogTitle>
      )}

      <DialogContent
        ref={contentRef}
        dividers={dividers}
        sx={{
          px: 2.5,
          py: 2,
          flex: '1 1 auto',
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          scrollbarColor: (theme) => `${alpha(theme.palette.text.primary, 0.24)} ${alpha(theme.palette.text.primary, 0.08)}`,
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': {
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.08),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.24),
            borderRadius: 1,
            '&:hover': { backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.4) },
          },
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={[
            { px: 2.5, py: 2, flexShrink: 0, justifyContent: 'flex-end', borderTop: dividers ? 0 : 1, borderColor: 'divider' },
            ...(Array.isArray(actionsSx) ? actionsSx : actionsSx ? [actionsSx] : []),
          ]}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
