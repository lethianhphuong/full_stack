import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

export interface CustomTableColumn<T = Record<string, unknown>> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  minWidth?: string | number;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface CustomTableProps<T = Record<string, unknown>> {
  columns: CustomTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  dense?: boolean;
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  sx?: object;
  bordered?: boolean;
}

// ----------------------------------------------------------------------

export default function CustomTable<T = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyText = 'Không tìm thấy dữ liệu',
  dense = false,
  rowKey,
  onRowClick,
  sx,
  bordered = false,
}: CustomTableProps<T>) {
  const theme = useTheme();

  return (
    <TableContainer
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        border: bordered ? `1px solid ${theme.palette.divider}` : 'none',
        ...sx,
      }}
    >
      <Table size={dense ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  backgroundColor: theme.palette.background.neutral,
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: 13,
                  py: 1.75,
                  width: column.width,
                  minWidth: column.minWidth,
                  whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'} sx={{ py: 2 }}>
                    <Skeleton variant="rounded" height={24} sx={{ borderRadius: 1 }} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.grey[500], 0.08),
                      color: 'text.disabled',
                      mb: 2,
                    }}
                  >
                    <Iconify icon="solar:folder-open-broken" width={36} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
                    {emptyText}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
                    Thử tìm kiếm với từ khóa khác hoặc tải lên tệp mới
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const key = rowKey ? rowKey(row, index) : index;
              return (
                <TableRow
                  key={key}
                  hover
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: (t) => t.transitions.create(['background-color']),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                    '& td': {
                      py: 1.75,
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    },
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render
                        ? column.render(row, index)
                        : ((row as Record<string, unknown>)[column.id] as React.ReactNode) ?? '—'}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
