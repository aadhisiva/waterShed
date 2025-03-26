import React, { useState }  from 'react';
import { Grid, Paper } from '@mui/material';
import DistrictWiseMapReports from './echarForMap';

const MapReports = () => {
  return (
    <Paper id='container' sx={{ pt: 1.875, pb: 1, px: 2 }}>
      <Grid>
      {/* <ComposableMap projection="geoMercator" projectionConfig={{ scale: 7000, center: [76.5, 15.5] }}> */}
      {/* <Geographies geography={DistrictWiseCoordinates}>
        {({ geographies }) =>
          geographies.map((geo: any) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onMouseEnter={() => {
                const geoData: any = JSON.parse(JSON.stringify(geo));
                console.log(`Hovered over ${geoData.properties.DISTRICT}`);
                setDistrictTooltip(geoData.properties.DISTRICT);
              }}
              onClick={() => {
                const geoData: any = JSON.parse(JSON.stringify(geo));
                alert(`Clicked on ${geoData.properties.DISTRICT}`);
              }}
              style={{
                default: { fill: "#ee1c2f", stroke: "#FFF", strokeWidth: 0.5 },
                hover: { fill: "#FFD700", stroke: "#FFF", strokeWidth: 1 },
                pressed: { fill: "#FF6347", stroke: "#FFF", strokeWidth: 1.5 },
              }}
            />
          ))
        }
      </Geographies> */}
    {/* </ComposableMap> */}
      <DistrictWiseMapReports />
      </Grid>
    </Paper>
  );
};

export default MapReports;
