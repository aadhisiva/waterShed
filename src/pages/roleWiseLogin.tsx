import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import useDisptachForAction from '../components/customHooks/useDis';
import useForm from '../components/formhandle/customValidation';
import TextFieldMU from '../components/formhandle/TextField';
import axiosInstance from '../axiosInstance';
import { LoadingButton } from '@mui/lab';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import OtpVerifyPage from './OtpVerifyPage';

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 5 }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://edcs.karnataka.gov.in/">
        Directorate of EDCS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type Values = {
  [key: string]: string;
};

export default function RoleWiseLogin() {
  const [loading, setLoading] = React.useState(false);
  const [isOtpValidate, setIsOtpValidate] = React.useState(false);
  const [userData, setUsersData] = React.useState<any>({});
  const initialValues = {
    Mobile: '',
  };

  const [dispatch] = useDisptachForAction();

  const validationSchema = {
    Mobile: {
      validate: (value: string) => {
        if (!value) {
          return 'Enter Mobile Number';
        }
        const regex = /^[0-9]{10}$/;
        let checked = regex.test(value);
        if (!checked) return 'Enter Valid Mobile Number';
        return null;
      },
    },
  };

  const onSubmit = async (values: Values) => {
    console.log("values",values)
    setLoading(true);
    setTimeout(async () => {
      let { data } = await axiosInstance.post('checkMobileLogin', {
        Mobile: values.Mobile,
      });
      if (data?.code == 200) {
        setUsersData(data.data);
        setIsOtpValidate(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, 2000);
  };

  const handleResendOTP = () => {
    setLoading(true);
    setTimeout(async () => {
      let { data } = await axiosInstance.post('checkMobileLogin', {
        Mobile: userData['Mobile'],
      });
      if (data?.code == 200) {
        setUsersData(data.data);
        setIsOtpValidate(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, 2000);
  }

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm({ initialValues, validationSchema, onSubmit });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={false} sm={4} md={7}>
        <Grid
          item
          md={12}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Box
            component="img"
            sx={{
              height: 200,
              width: 200,
              maxHeight: { xs: 250, md: 280 },
              maxWidth: { xs: 250, md: 280 },
            }}
            alt="watershed Logo."
            src={require('../assets/Images/logo.png')}
            loading="lazy"
          />
          <Box
            component="img"
            sx={{
              height: 180,
              width: 200,
              maxHeight: { xs: 250, md: 280 },
              maxWidth: { xs: 250, md: 280 },
            }}
            loading="lazy"
            alt="Karnataka Logo."
            src={require('../assets/Images/karnataka.png')}
          />
        </Grid>
        <Grid
          item
          md={12}
          mt={10}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'black',
            }}
            component="h2"
          >
            WaterShed
          </Typography>
        </Grid>
      </Grid>
      {!isOtpValidate ? (
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              ml: 7,
              mr: 7,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <Grid
                container
                spacing={2}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Grid item md={12}>
                  <TextFieldMU
                    name="Mobile"
                    label="Mobile Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Mobile}
                    error={touched.Mobile && Boolean(errors.Mobile)}
                    helperText={touched.Mobile && errors.Mobile}
                  />
                </Grid>
                <Grid item md={12}>
                  <LoadingButton
                    color="primary"
                    type="submit"
                    loading={loading}
                    loadingPosition="start"
                    fullWidth
                    endIcon={<LockOpenIcon />}
                    variant="contained"
                  >
                    <span>Send OTP</span>
                  </LoadingButton>
                </Grid>
              </Grid>
              <Copyright />
            </Box>
          </Box>
        </Grid>
      ) : (
        <OtpVerifyPage userData={userData} handleResendOTP={handleResendOTP} />
      )}
    </Grid>
  );
}
