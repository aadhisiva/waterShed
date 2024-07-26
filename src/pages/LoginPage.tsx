import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import useDisptachForAction from '../components/customHooks/useDis';
import { userLoggedIn } from '../reducers/authReducer';
import useForm from '../components/formhandle/customValidation';
import TextFieldMU from '../components/formhandle/TextField';
import axiosInstance from '../axiosInstance';

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 5 }}
    >
      {'Copyright © '}
      <Link color="inherit" href="">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type Values = {
  [key: string]: string;
};

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const initialValues = {
    Username: '',
    Password: '',
  };

  const navigate = useNavigate();
  const [dispatch] = useDisptachForAction();

  const validationSchema = {
    Username: {
      validate: (value: string) => {
        if (!value) {
          return 'Username is required';
        }
        const regex =
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$/;
        let checked = regex.test(value);
        if (!checked) return 'Enter Email or Mobile Number';
        return null;
      },
    },
    Password: {
      validate: (value: string) => {
        if (!value) {
          return 'Password is required';
        }
        const regex =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.]).{6,20}$/;
        let checked = regex.test(value);
        if (!checked)
          return `Password must containe one lowercase character and one uppercase character and one 
        special character and password should be between 6 and 20 characters length and one digit`;
        return null;
      },
    },
  };

  const onSubmit = async (values: Values) => {
    setLoading(true);
    let response: any = await axiosInstance.post('/superLogin', {
      ...{ ReqType: 'Get' },
      ...values,
    });
    if (response?.data?.code == 200) {
      dispatch(userLoggedIn(response.data.data));
      navigate('/');
    } else {
      setLoading(false);
    }
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

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${require('../assets/Images/bg_water.jpeg')})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          component="img"
          sx={{
            height: 250,
            width: 280,
            maxHeight: { xs: 250, md: 280 },
            maxWidth: { xs: 250, md: 280 },
          }}
          alt="Karnataka Logo."
          src={require('../assets/Images/karnataka.png')}
        />
        <Typography
          variant="h1"
          sx={{
            color: 'whitesmoke',
          }}
          component="h2"
        >
          WaterShed
        </Typography>
      </Grid>
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
                  name="Username"
                  label="Username or Email Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Username}
                  error={touched.Username && Boolean(errors.Username)}
                  helperText={touched.Username && errors.Username}
                />
              </Grid>
              <Grid item md={12}>
                <TextFieldMU
                  name="Password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Password}
                  error={touched.Password && Boolean(errors.Password)}
                  helperText={touched.Password && errors.Password}
                />
              </Grid>
              <Grid item md={12}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
              <Grid item md={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item md={12} style={{display: 'flex', flexDirection: 'row'}}>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
            <Copyright />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}