import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '../../components/iconify';
import Chart from './Chart';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  total: number;
  percent: number;
  chart: {
    colors?: string[];
    series: number[];
  };
};

export default function AppWidgetSummary({ title, percent, total, chart, ...other }: Props) {
  const theme = useTheme();

  const { colors = [theme.palette.primary.main], series } = chart;

  const chartOptions = {
    colors,
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
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
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Iconify
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: 'success.main',
          bgcolor: alpha(theme.palette.success.main, 0.16),
          ...(percent < 0 && {
            color: 'error.main',
            bgcolor: alpha(theme.palette.error.main, 0.16),
          }),
        }}
      />

      <Typography variant="subtitle2" component="div" noWrap>
        {percent > 0 && '+'}
        {percent}%
        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {' than last week'}
        </Box>
      </Typography>
    </Stack>
  );

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>

        <Typography variant="h3" sx={{ mt: 1 }}>
          {total.toLocaleString()}
        </Typography>

        {renderTrending}
      </Box>

      <Chart type="bar" series={[{ data: series }]} options={chartOptions} width={60} height={36} />
    </Card>
  );
}
