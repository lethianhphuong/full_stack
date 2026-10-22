import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import type { DocumentStats } from '../types/document.types';
import { FILTER_TABS } from '../constants/document.constants';

export interface DocumentFilterTabsProps {
  value: string;
  stats: DocumentStats;
  onChange: (value: string) => void;
}

export default function DocumentFilterTabs({
  value,
  stats,
  onChange,
}: DocumentFilterTabsProps) {
  const theme = useTheme();

  return (
    <Tabs
      value={value}
      onChange={(_, newVal) => onChange(newVal)}
      sx={{
        px: 2.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        '& .MuiTab-root': {
          minHeight: 48,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 14,
        },
      }}
    >
      {FILTER_TABS.map((tab) => {
        const count = stats[tab.countKey] || 0;
        const color = tab.color || theme.palette.primary.main;
        const isSelected = value === tab.value;

        return (
          <Tab
            key={tab.value}
            value={tab.value}
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>{tab.label}</span>
                <Chip
                  label={count}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: isSelected
                      ? alpha(color, 0.16)
                      : alpha(theme.palette.grey[500], 0.12),
                    color: isSelected ? color : 'text.secondary',
                  }}
                />
              </Stack>
            }
          />
        );
      })}
    </Tabs>
  );
}
