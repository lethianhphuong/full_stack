import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

type QuickSettingItem = {
  key: string;
  label: string;
  icon: string;
  checked: boolean;
  onChange: () => void;
  tooltip?: string;
};

type Props = {
  items: QuickSettingItem[];
};

// ----------------------------------------------------------------------

export default function QuickSettings({ items }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 1.5,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.key}
          sx={{
            p: 2,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.grey[500], 0.08),
            border: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
          }}
        >
          {/* Top row: Icon + Switch */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Iconify
              icon={item.icon}
              width={24}
              sx={{
                color: item.checked ? 'primary.main' : 'text.secondary',
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Switch
                size="small"
                checked={item.checked}
                onChange={item.onChange}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: 'primary.main',
                  },
                }}
              />
              {item.tooltip && (
                <Tooltip title={item.tooltip} placement="top">
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
                      cursor: 'help',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'text.disabled',
                      }}
                    >
                      i
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Bottom row: Label */}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: item.checked ? 'text.primary' : 'text.secondary',
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
