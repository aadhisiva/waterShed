import * as React from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import useDisptachForAction from '../components/customHooks/useDis';
import { userLoggedIn } from '../reducers/authReducer';
import useForm from '../components/formhandle/customValidation';
import TextFieldMU from '../components/formhandle/TextField';
import axiosInstance from '../axiosInstance';
import { LoadingButton } from '@mui/lab';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { otpValid } from '../utils/validations';
import SelectField from '../components/formhandle/SelectField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Paper, Typography } from '@mui/material';

type Values = {
  [key: string]: string;
};

interface RoleAccess {
  RoleId: string;
  RoleName: string;
}

export default function OtpVerifyPage({ userData, handleResendOTP }: any) {
  const [loading, setLoading] = React.useState(false);
  const initialValues = {
    Mobile: userData?.Mobile,
    RoleId: '',
    Otp: '',
  };

  const navigate = useNavigate();
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
    RoleId: {
      validate: (value: string) => {
        if (!value) {
          return 'Role required';
        }
        return null;
      },
    },
    Otp: {
      validate: (value: string) => {
        if (!value) {
          return 'Otp required';
        }
        return otpValid(value);
      },
    },
  };

  // Handle form submission
  const onSubmit = async (values: any) => {
    // Handle form data submission here
    if (values.Otp !== userData.Otp) return alert('Enter Valid Otp.');
    let findObj = (userData.UserData || []).find(
      (obj: RoleAccess) => obj.RoleId == values.RoleId,
    );
    let { data } = await axiosInstance.post('getAccessById', {
      RoleId: values.RoleId,
    });
    if (data.code !== 200) return alert(data.message || 'Please try again');
    dispatch(
      userLoggedIn({
        ...userData,
        ...{
          RoleName: findObj.RoleName,
          RoleId: values.RoleId,
          RoleAccess: data.data,
        },
      }),
    );
    navigate('/');
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm({ initialValues, validationSchema, onSubmit });

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
  };

  return (
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
              <SelectField
                name="RoleId"
                label="Role Name"
                value={values.RoleId}
                onChange={handleChange}
                options={(userData.UserData || []).map((obj: RoleAccess) => {
                  return { value: obj.RoleId, name: obj.RoleName };
                })}
                onBlur={handleBlur}
                error={touched.RoleId && Boolean(errors.RoleId)}
                helperText={touched.RoleId && errors.RoleId}
              />
            </Grid>
            <Grid item md={12}>
              <TextFieldMU
                name="Otp"
                label="OTP"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Otp}
                error={touched.Otp && Boolean(errors.Otp)}
                helperText={touched.Otp && errors.Otp}
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
                <span>Verify OTP</span>
              </LoadingButton>
            </Grid>
            <Grid
              item
              md={12}
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <Grid item>
                <Link onClick={handleResendOTP} variant="body2">
                  {'RESEND OTP'}
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Copyright />
        </Box>
      </Box>
    </Grid>
  );
}
