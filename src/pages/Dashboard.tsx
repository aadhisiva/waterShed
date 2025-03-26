import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSelectorForUser from '../components/customHooks/useSelectForUser';
import useDisptachForAction from '../components/customHooks/useDis';
import { Grid } from '@mui/material';
import SurveyCountGadget from '../components/dashboardCom/gadgets/surveyCounts';
import TargetVsReality from '../components/dashboardCom/gadgets/targetVsReality';
import VisitorInsights from '../components/dashboardCom/gadgets/highlights';
import PieChartReports from '../components/dashboardCom/gadgets/pieCharts';
import MapReports from '../components/dashboardCom/gadgets/mapReport';

export default function Dashboard() {
  const navigate = useNavigate();
  const [state] = useSelectorForUser();
  const [dispatch] = useDisptachForAction();

  return (
    <div
      style={{
        backgroundColor: 'rgb(247, 250, 252)',
        padding: 10,
      }}
    >
      {/* <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 4}}>
        <img
            srcSet={`${require("../assets/Images/logo.png")}`}
            src={`${require("../assets/Images/logo.png")}`}
            alt={"watershed"}
            loading="lazy"
            width={300}
            height={300}
          />
          <Typography variant='h4'>
            Watershed
          </Typography>
      </Box> */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <SurveyCountGadget />
        </Grid>
        <Grid item xs={12} md={4}>
          <MapReports />
        </Grid>
        <Grid item xs={12} md={3}>
          <TargetVsReality />
        </Grid>
        <Grid item xs={12} md={7} xl={5}>
          <VisitorInsights />
        </Grid>
        {/* <Grid item xs={12} md={5} xl={3}>
          <IndiaDistrictsMap />
        </Grid> */}
        <Grid item xs={12} md={7} xl={5}>
          <PieChartReports />
        </Grid>
      </Grid>
    </div>
  );
}
