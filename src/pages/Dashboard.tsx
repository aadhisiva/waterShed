import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSelectorForUser from '../components/customHooks/useSelectForUser';
import useDisptachForAction from '../components/customHooks/useDis';
import { clearSessionEndTime, userLoggedOut } from '../reducers/authReducer';
import { Box, Typography } from '@mui/material';
import { Image } from '@mui/icons-material';

export default function Dashboard() {
  const navigate = useNavigate();
  const [state] = useSelectorForUser();
  const [dispatch] = useDisptachForAction();

  return (
    <div>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 4}}>
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
      </Box>
    </div>
  );
}
