import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import TargetVsRealityChart from '../targetVsReality/TargetVsRealityChart';
import IconifyIcon from '../../Icons/iconifyIcon';
import { salesData, targetVsReality } from '../../../dummyData/targetVsReality';
import "./index.css";

const TargetVsReality = () => {
  return (
    <Paper id="container" sx={{ p: 3 }}>
      <Typography variant="h4" id='title' color="#05004E" mb={1.25}>
        Target
      </Typography>

      <TargetVsRealityChart style={{ height: 150 }} data={targetVsReality} />

      <Stack mt={2.25} spacing={1.875}>
        {salesData.map((item) => (
          <Stack key={item.label} direction="row" alignItems="center">
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{ width: 36, height: 36, bgcolor: item.iconBgColor, borderRadius: 2, mr: 1.25 }}
            >
              <IconifyIcon icon={item.icon} sx={{ color: item.iconColor }} />
            </Stack>
            <div>
              <Typography
                variant="caption"
                sx={(theme) => ({
                  color: '#151D48',
                  fontWeight: theme.typography.h3.fontWeight,
                  whiteSpace: 'nowrap',
                })}
              >
                {item.label}
              </Typography>
              <Typography
                sx={(theme) => ({
                  color: 'grey',
                  fontWeight: 'fontWeightRegular',
                  fontSize: theme.typography.fontSize / 1.4,
                })}
              >
                {item.type}
              </Typography>
            </div>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 'fontWeightMedium',
                color: item.color,
                ml: { xs: 10, sm: 30, md: 10, xl: 5 },
              }}
            >
              {item.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default TargetVsReality;
