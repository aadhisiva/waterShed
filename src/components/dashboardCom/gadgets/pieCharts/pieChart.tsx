import React from 'react';
import { LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEchart from '../../base/ReactEhart';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { pieChartDataProps } from '../../../dummyData/pieChartData';
import { EChartsOption } from 'echarts';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
]);

interface PieChartOptionProps {
  chartRef: MutableRefObject<EChartsReactCore | null>;
  data: pieChartDataProps[];
  style?: {
    height: number;
    width?: number;
  };
}
export const PieChartOption = ({
  chartRef,
  data,
  style,
}: PieChartOptionProps) => {

  const radius = ['30%', '100%'];
  const pieOption: EChartsOption | any = {
    tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
    series: [
      {
        type: 'pie',
        id: 'distribution',
        radius: radius,
        label: {
          show: false,
        },
        universalTransition: true,
        animationDurationUpdate: 1000,
        data: data,
        emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
      },
    ]
  };

  return (
      <ReactEchart
        echarts={echarts}
        option={pieOption}
        ref={chartRef}
        style={style}
      />
  );
};
