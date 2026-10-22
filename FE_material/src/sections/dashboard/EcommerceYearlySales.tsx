import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import Chart from './Chart';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  subheader?: string;
  chart: {
    labels: string[];
    colors?: string[];
    series: {
      name: string;
      data: number[];
    }[];
  };
};

export default function EcommerceYearlySales({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const { labels, colors, series } = chart;

  const chartOptions = {
    colors: colors || [
      theme.palette.primary.main,
      theme.palette.warning.main,
    ],
    chart: {
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: labels,
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
      },
    },
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart type="bar" series={series} options={chartOptions} height={364} />
    </Card>
  );
}
