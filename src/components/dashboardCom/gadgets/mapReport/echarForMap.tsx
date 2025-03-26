import React, { useEffect, useRef, useState } from "react";
import * as echarts from 'echarts/core';
import usaGeoJsonData from "../../../dummyData/district.json"
import ReactEchart from '../../base/ReactEhart';
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    LegendComponent,
    LegendComponentOption,
  } from 'echarts/components';  
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { UniversalTransition } from "echarts/features";

echarts.use([
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
  ]);
  
const DistrictWiseMapReports = () => {
const chartRef = useRef(null);
const usaGeoJson: any = usaGeoJsonData;
  useEffect(() => {
    echarts.registerMap("Karnataka", usaGeoJson);
  }, []);

  const option: any = {
    title: {
      text: "Karnataka",
      subtext: "",
      left: "right"
    },
    tooltip: { trigger: "item", showDelay: 0, transitionDuration: 0.2 },
    visualMap: {
      left: "right",
      min: 50000,
      max: 38000000,
      inRange: {
        color: ["#eb4034", "#fa6b61", "#9e2921"]
      },
      text: ["High", "Low"],
      calculable: true
    },
    toolbox: {
      show: true,
      left: "left",
      top: "top",
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: "Karnataka application counts",
        type: "map",
        roam: true,
        map: "Karnataka",
        emphasis: { label: { show: true } },
        data: [
          { name: "Bagalkot", value: 4822023 },
          { name: "Bangalore", value: 4822023 },
          { name: "Bangalore", value: 4822023 },
          { name: "Belgaum", value: 4822023 },
          { name: "Bellary", value: 4822023 },
          { name: "Bidar", value: 4822023 },
          { name: "Bijapur", value: 4822023 },
          { name: "Chamrajnagar", value: 4822023 },
          { name: "Chikkaballapura", value: 4822023 },
          { name: "Chikmagalur", value: 4822023 },
          { name: "Chitradurga", value: 4822023 },
          { name: "Dakshina", value: 4822023 },
          { name: "Davanagere", value: 4822023 },
          { name: "Dharwad", value: 4822023 },
          { name: "Gadag", value: 4822023 },
          { name: "Gulbarga", value: 4822023 },
          { name: "Hassan", value: 4822023 },
          { name: "Haveri", value: 4822023 },
          { name: "Kodagu", value: 4822023 },
          { name: "Kolar", value: 4822023 },
          { name: "Koppal", value: 4822023 },
          { name: "Mandya", value: 4822023 },
          { name: "Mysore", value: 4822023 },
          { name: "Raichur", value: 4822023 },
          { name: "Ramanagara", value: 4822023 },
          { name: "Shimoga", value: 4822023 },
          { name: "Tumkur", value: 4822023 },
          { name: "Udupi", value: 4822023 },
          { name: "Uttara", value: 4822023 },
          { name: "Yadgir", value: 4822023 },
          { name: "Uttara Kannada", value: 4822023 },
          { name: "Dakshina Kannada", value: 4822023 },
          { name: "Bangalore Rural", value: 4822023 },
        ]
      }
    ]
  };

  return  <ReactEchart
  echarts={echarts}
  option={option}
  ref={chartRef}
  style={{height: '328px'}}
/>;
};

export default DistrictWiseMapReports;