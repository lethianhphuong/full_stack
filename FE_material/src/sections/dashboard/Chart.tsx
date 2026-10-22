import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { alpha, useTheme, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledChart = styled(ReactApexChart)(({ theme }) => ({
  '& .apexcharts-canvas': {
    // Tooltip
    '& .apexcharts-tooltip': {
      color: theme.palette.text.primary,
      boxShadow: theme.customShadows.dropdown,
      borderRadius: Number(theme.shape.borderRadius) * 1.25,
      '&.apexcharts-theme-light': {
        borderColor: 'transparent',
        backgroundColor: theme.palette.background.paper,
      },
    },
    '& .apexcharts-xaxistooltip': {
      borderColor: 'transparent',
      color: theme.palette.text.primary,
      boxShadow: theme.customShadows.dropdown,
      borderRadius: Number(theme.shape.borderRadius) * 1.25,
      backgroundColor: theme.palette.background.paper,
      '&:before': {
        borderBottomColor: alpha(theme.palette.grey[500], 0.24),
      },
      '&:after': {
        borderBottomColor: theme.palette.background.paper,
      },
    },

    // Legend
    '& .apexcharts-legend': {
      padding: 0,
    },
    '& .apexcharts-legend-series': {
      display: 'inline-flex !important',
      alignItems: 'center',
    },
    '& .apexcharts-legend-marker': {
      marginRight: 8,
    },
    '& .apexcharts-legend-text': {
      lineHeight: '18px',
      textTransform: 'capitalize',
    },
  },
}));

// ----------------------------------------------------------------------

type ChartSeries = number[] | { name?: string; type?: string; data: number[] }[];

type Props = {
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  series: ChartSeries;
  options?: ApexOptions;
  width?: number | string;
  height?: number | string;
};

export default function Chart({ type, series, options, width = '100%', height = 320 }: Props) {
  const theme = useTheme();

  const baseOptions: ApexOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily as string,
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        filter: {
          type: 'darken',
        },
      },
    },
    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round',
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: 'false',
      x: {
        show: true,
      },
    },
    legend: {
      show: true,
      fontSize: '13px',
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        offsetX: -3,
      },
      fontWeight: 500,
      itemMargin: {
        horizontal: 10,
      },
      labels: {
        colors: theme.palette.text.primary,
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '40%',
            },
          },
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '32%',
            },
          },
        },
      },
    ],
  };

  return (
    <StyledChart
      type={type}
      series={series}
      options={{ ...baseOptions, ...options }}
      width={width}
      height={height}
    />
  );
}
