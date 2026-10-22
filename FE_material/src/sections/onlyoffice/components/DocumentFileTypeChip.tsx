import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import { getFileTypeColor } from '../utils/document.utils';

export interface DocumentFileTypeChipProps extends Omit<ChipProps, 'color'> {
  fileType: string;
  showLabel?: boolean;
}

export default function DocumentFileTypeChip({
  fileType,
  showLabel = true,
  sx,
  size = 'small',
  ...other
}: DocumentFileTypeChipProps) {
  const theme = useTheme();
  const color = getFileTypeColor(fileType) || theme.palette.grey[500];
  const label = showLabel ? fileType.toUpperCase() : '';

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: 11,
        bgcolor: alpha(color, 0.12),
        color,
        border: `1px solid ${alpha(color, 0.24)}`,
        borderRadius: 1,
        px: 0.5,
        ...sx,
      }}
      {...other}
    />
  );
}
