import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Chart from './Chart';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  total: number;
  percent: number;
  icon: string;
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  chart: {
    colors?: string[];
    series: number[];
  };
};

export default function EcommerceWidgetSummary({
  title,
  total,
  percent,
  icon,
  color = 'primary',
  chart,
  ...other
}: Props) {
  const theme = useTheme();

  const { colors = [theme.palette[color].main], series } = chart;

  const chartOptions = {
    colors,
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value: number) => `${value}`,
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
  };

  const renderTrending = (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Iconify
        icon={percent >= 0 ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'}
        width={20}
        sx={{
          color: percent >= 0 ? 'success.main' : 'error.main',
        }}
      />

      <Typography variant="subtitle2" component="span">
        {percent >= 0 ? '+' : ''}
        {percent}%
      </Typography>

      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
        last week
      </Typography>
    </Stack>
  );

  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      {...other}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="h3" sx={{ mb: 1 }}>
          {total.toLocaleString()}
        </Typography>

        {renderTrending}
      </Box>

      <Box sx={{ width: 120, height: 80 }}>
        <Chart type="line" series={[{ data: series }]} options={chartOptions} height={80} />
      </Box>
    </Card>
  );
}
