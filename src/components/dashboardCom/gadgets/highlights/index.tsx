import React from "react";
import { Paper, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { visitorInsightsData } from '../../../dummyData/visitorInsightsData';
import LegendToggleButton from '../../../common/LegendToggleButton';
import VisitorInsightsChart from './VisitorInsightsChart';
import "./index.css";

const VisitorInsights = () => {
  const chartRef = useRef<EChartsReactCore | null>(null);

  const [legend, setLegend] = useState({
    'Agriculture': false,
    'Forestery': false,
    'Horticulture': false,
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
      <Typography id="title" mb={4}>
        Highlights
      </Typography>

      <VisitorInsightsChart
        chartRef={chartRef}
        data={visitorInsightsData}
        style={{ height: 176 }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="flex-start"
        mt={4}
        px={{ xs: 0, sm: 1, lg: 0 }}
        rowGap={1}
        columnGap={{ sm: 1, md: 0.5, lg: 1, xl: 0.5 }}
      >
        <LegendToggleButton
          name="Agriculture"
          icon="ic:round-square"
          color="blue"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />

        <LegendToggleButton
          name="Forestery"
          icon="ic:round-square"
          color="green"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />

        <LegendToggleButton
          name="Horticulture"
          icon="ic:round-square"
          color="red"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />
      </Stack>
    </Paper>
  );
};

export default VisitorInsights;
