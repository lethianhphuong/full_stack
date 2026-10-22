import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from '@/components';
import type { DocumentStats } from '../types/document.types';
import { FILE_TYPE_COLORS, FILE_TYPE_ICONS, ACTION_ICONS } from '../constants/document.constants';

export interface DocumentStatsCardsProps {
  stats: DocumentStats;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function DocumentStatsCards({
  stats,
  selectedFilter,
  onFilterChange,
}: DocumentStatsCardsProps) {
  const theme = useTheme();

  const statsItems = [
    {
      key: 'all',
      label: 'Tất cả tài liệu',
      countKey: 'total' as const,
      color: theme.palette.primary.main,
      icon: ACTION_ICONS.all,
    },
    {
      key: 'docx',
      label: 'Word (.docx)',
      countKey: 'docx' as const,
      color: FILE_TYPE_COLORS.docx,
      icon: FILE_TYPE_ICONS.docx,
    },
    {
      key: 'xlsx',
      label: 'Excel (.xlsx)',
      countKey: 'xlsx' as const,
      color: FILE_TYPE_COLORS.xlsx,
      icon: FILE_TYPE_ICONS.xlsx,
    },
    {
      key: 'pptx',
      label: 'PowerPoint (.pptx)',
      countKey: 'pptx' as const,
      color: FILE_TYPE_COLORS.pptx,
      icon: FILE_TYPE_ICONS.pptx,
    },
    {
      key: 'pdf',
      label: 'PDF (.pdf)',
      countKey: 'pdf' as const,
      color: FILE_TYPE_COLORS.pdf,
      icon: FILE_TYPE_ICONS.pdf,
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        overflow: 'hidden',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        {statsItems.map((item) => {
          const isSelected = selectedFilter === item.key;

          return (
            <Stack
              key={item.key}
              direction="row"
              alignItems="center"
              spacing={2}
              onClick={() => onFilterChange(item.key)}
              sx={{
                flex: 1,
                p: 2.5,
                cursor: 'pointer',
                bgcolor: isSelected ? alpha(item.color, 0.08) : 'transparent',
                transition: (t) => t.transitions.create(['background-color']),
                '&:hover': { bgcolor: alpha(item.color, 0.04) },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(item.color, 0.12),
                  color: item.color,
                  flexShrink: 0,
                }}
              >
                <Iconify icon={item.icon} width={26} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ fontWeight: 500 }}>
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25, color: item.color }}>
                  {stats[item.countKey] || 0}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}
