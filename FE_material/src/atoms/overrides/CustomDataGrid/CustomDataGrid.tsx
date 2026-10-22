import { DataGrid } from '@mui/x-data-grid';
import type { DataGridProps } from '@mui/x-data-grid';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CustomDataGridProps extends DataGridProps {
  cardBorder?: boolean;
}

// ----------------------------------------------------------------------

export default function CustomDataGrid({
  cardBorder = true,
  sx,
  ...other
}: CustomDataGridProps) {
  const theme = useTheme();

  return (
    <DataGrid
      sx={{
        border: cardBorder ? `1px solid ${theme.palette.divider}` : 'none',
        borderRadius: 2,
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.6) : theme.palette.grey[100],
          color: theme.palette.text.secondary,
          fontWeight: 600,
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
          outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
          outline: 'none',
        },
        ...sx,
      }}
      {...other}
    />
  );
}
