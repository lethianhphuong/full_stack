import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from '@/components';
import { getFileTypeColor, getFileTypeIcon } from '../utils/document.utils';

export interface DocumentFileIconProps extends BoxProps {
  fileType: string;
  size?: number;
  iconSize?: number;
}

export default function DocumentFileIcon({
  fileType,
  size = 44,
  iconSize = 26,
  sx,
  ...other
}: DocumentFileIconProps) {
  const theme = useTheme();
  const color = getFileTypeColor(fileType) || theme.palette.primary.main;
  const icon = getFileTypeIcon(fileType);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 1.5,
        bgcolor: alpha(color, 0.1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color,
        ...sx,
      }}
      {...other}
    >
      <Iconify icon={icon} width={iconSize} />
    </Box>
  );
}
