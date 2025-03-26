import React, { useRef, useState } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import './index.css';
import LegendToggleButton from '../../../common/LegendToggleButton';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { PieChartOption } from './pieChart';
import { pieChartData } from '../../../dummyData/pieChartData';

const PieChartReports = () => {
  const chartRef = useRef<EChartsReactCore | null>(null);

  const [legend, setLegend] = useState({
    Agriculture: false,
    Forestery: false,
    Horticulture: false,
  });

  const handleLegendToggle = (name: keyof typeof legend) => {
    setLegend((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));

    if (chartRef.current) {
      const instance = chartRef.current.getEchartsInstance();
      instance.dispatchAction({
        type: 'legendToggleSelect',
        name: name,
      });
    }
  };

  return (
    <Paper id="conatiner" sx={{ p: 3 }}>
      <Typography id="title" mb={1}>
        Highlights
      </Typography>

      <PieChartOption
        chartRef={chartRef}
        data={pieChartData}
        style={{ height: 220 }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="flex-start"
        mt={2}
        px={{ xs: 0, sm: 1, lg: 0 }}
        rowGap={1}
        columnGap={{ sm: 1, md: 0.5, lg: 1, xl: 0.5 }}
      >
        <Typography whiteSpace="wrap" sx={{ color: '#464E5F', fontWeight: '400', fontSize: '10px' }}>
            <span style={{color: 'red', fontWeight: '600', fontSize: '10px'}}>**Note</span> This chart represents the year-wise surveyed data conducted by surveyors, expressed in percentage.
        </Typography>
      </Stack>
    </Paper>
  );
};

export default PieChartReports;
