import React  from 'react';
import { Typography, Grid, Paper, Stack, Button } from '@mui/material';
import IconifyIcon from '../../Icons/iconifyIcon';
import { sales } from '../../../dummyData/surveyCounts';
import SurveyCardDetails from './surveyCountsCard';
import "./index.css";

const SurveyCountGadget = () => {
  return (
    <Paper id='container' sx={{ pt: 1.875, pb: 1, px: 4, height: '348px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5.375}>
        <div>
          <Typography mb={0.5} id='headerContainer'>
            Total Survey
          </Typography>
          <Typography variant="subtitle1" id='subTitle' color="primary.lighter">
            Survey Report
          </Typography>
        </div>
        <Button variant="outlined" startIcon={<IconifyIcon icon="solar:upload-linear" />}>
          Export
        </Button>
      </Stack>

      <Grid container spacing={{ xs: 3.875, xl: 2 }} columns={{ xs: 1, sm: 2, md: 4 }}>
        {sales.map((item) => (
          <Grid item xs={1} key={item.label}>
            <SurveyCardDetails className={'childContainer'} item={item} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SurveyCountGadget;
