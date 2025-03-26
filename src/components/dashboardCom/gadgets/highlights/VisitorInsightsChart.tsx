import React from "react";
import { useTheme } from '@mui/material';
import { MutableRefObject, useMemo } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  VisualMapComponent,
  TitleComponent,
  ToolboxComponent 
} from 'echarts/components';
import { LineChart, LineSeriesOption, MapChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import EChartsReactCore from 'echarts-for-react/lib/core';
import ReactEchart from '../../base/ReactEhart';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  VisualMapComponent,
  TitleComponent,
  MapChart,
  ToolboxComponent    
]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GridComponentOption | LegendComponentOption | LineSeriesOption
>;

interface VisitorInsightsChartProps {
  chartRef: MutableRefObject<EChartsReactCore | null>;
  data: {
    'Agriculture': number[];
    'Forestery': number[];
    'Horticulture': number[];
  };
  style?: {
    height: number;
    width?: number;
  };
}

const VisitorInsightsChart = ({ chartRef, data, style }: VisitorInsightsChartProps) => {
  const theme = useTheme();

  const visitorInsightsChartOption: any = useMemo(() => {
    const option: EChartsOption = {
      color: [
        theme.palette.primary.dark,
        theme.palette.success.dark,
        theme.palette.error.dark,
      ],

      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          lineStyle: {
            color: theme.palette.error.main,
          },
        },
      },

      legend: {
        show: false,
      },

      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontFamily: theme.typography.button.fontFamily,
          fontSize: theme.typography.fontSize / 1.4,
          color: theme.palette.grey[600],
        },
        axisLine: {
          show: false,
        },
      },

      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: theme.typography.caption.fontSize,
          color: theme.palette.grey[600],
        },
        splitLine: {
          lineStyle: {
            color: theme.palette.grey.A200,
          },
        },
      },

      grid: {
        top: 8,
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true,
      },

      series: [
        {
          name: 'Agriculture',
          type: 'line',
          data: data['Agriculture'],
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 14,

          lineStyle: {
            width: 4,
          },
        },
        {
          name: 'Forestery',
          type: 'line',
          data: data['Forestery'],
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 14,
          lineStyle: {
            width: 4,
          },
        },
        {
          name: 'Horticulture',
          type: 'line',
          data: data['Horticulture'],
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 14,
          lineStyle: {
            width: 4,
          },
        },
      ],
    };
    return option;
  }, [theme, data]);

  return (
    <ReactEchart
      echarts={echarts}
      option={visitorInsightsChartOption}
      ref={chartRef}
      style={style}
    />
  );
};

export default VisitorInsightsChart;
