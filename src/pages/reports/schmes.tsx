import React, { useEffect, useState } from 'react';
import CardFormate from '../../components/common/card';
import { Box, Grid } from '@mui/material';
import axiosInstance from '../../axiosInstance';
import SpinnerLoader from '../../components/spinner/spinner';
import { useNavigate } from 'react-router-dom';
import { SEARCH_REPORTS } from '../../utils/routingPath';
import { COLORS } from '../../utils/constants';
import BorderWithTitle from '../../components/common/borderWithTitle';

export default function SchmesWithCount() {
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fecthIntialData();
  }, []);

  const fecthIntialData = async () => {
    setLoading(true);
    try {
      let { data } = await axiosInstance.post('getDepartments');
      if (data?.code == 200) {
        setDepartments(data.data);
        // setSchemes(data.data);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data.message || 'please try again');
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleSchemesBasedOnDepId = async (obj: any) => {
    setLoading(true);
    try {
      let { data } = await axiosInstance.post('getRoleForReports', {
        DepartmentId: obj.id,
      });
      if (data?.code == 200) {
        setSchemes(data.data);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data.message || 'please try again');
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const onClick = (obj: any) => {
    navigate(SEARCH_REPORTS, { state: obj });
  };

  // let random = Math.floor(Math.random() * COLORS.length);

  return (
    <Box>
      <SpinnerLoader isLoading={loading} />
      <BorderWithTitle title={'Departments'}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            rowGap: 4,
            columnGap: 4,
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{ display: 'flex', alignItems: 'center', padding: 1 }}
          >
            {(departments || []).map((obj, i) => (
              <Grid item xs={4} sm={3}>
                <CardFormate
                  key={i}
                  color={COLORS[i]}
                  obj={obj}
                  onClick={handleSchemesBasedOnDepId}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </BorderWithTitle>
      {(schemes || {}).length !== 0 && (
        <BorderWithTitle title={'Schemes With Count'}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              rowGap: 4,
              columnGap: 4,
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{ display: 'flex', alignItems: 'center', padding: 1 }}
            >
              {(schemes || []).map((obj, i) => (
                <Grid item xs={4} sm={3}>
                  <CardFormate
                    key={i}
                    color={COLORS[i]}
                    obj={obj}
                    onClick={onClick}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </BorderWithTitle>
      )}
    </Box>
  );
}
