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
      type: string;
      fill: string;
      data: number[];
    }[];
  };
};

export default function AppWebsiteVisits({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const { labels, colors, series } = chart;

  const chartOptions = {
    colors: colors || [
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.info.main,
    ],
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime' as const,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} visits`;
          }
          return value;
        },
      },
    },
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="line"
        series={series}
        options={chartOptions}
        width="100%"
        height={364}
      />
    </Card>
  );
}
