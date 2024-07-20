// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import useForm from '../components/formhandle/customValidation';
// import { Button } from '@mui/material';

// type Values = {
//   [key: string]: string;
// };

// const initialValues = {
//   username: '',
//   password: '',
// };

// const validationSchema = {
//   username: {
//     validate: (value: string) => {
//       if (!value) {
//         return 'Username is required';
//       }
//       return null;
//     },
//   },
//   password: {
//     validate: (value: string) => {
//       if (!value) {
//         return 'Password is required';
//       }
//       return null;
//     },
//   },
// };

// export default function LoginPage() {
//   const navigate = useNavigate();

//   const onSubmit = (values: Values) => {
//     // Handle form submission logic, e.g., API call
//     console.log('Submitting values:', values);
//   };

//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     setValues,
//   } = useForm({ initialValues, validationSchema, onSubmit });

//   const toggleTheme = () => {
//   const checkTheme = localStorage.getItem("theme");
//    localStorage.setItem("theme", checkTheme == "light" ? "dark" : "light");
//    window.location.reload();
//   };

//   return (
//     <div>
//       <button
//         onClick={() => {
//           localStorage.setItem('token', 'true');
//           navigate('/');
//         }}
//       >
//         CLick to authenticate
//       </button>
//       <div className="App">
//         {/* Your application components go here */}
//         <Button variant="contained" color="primary" onClick={toggleTheme}>
//           Toggle Theme
//         </Button>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Username</label>
//           <input
//             type="text"
//             name="username"
//             value={values.username}
//             onChange={handleChange}
//             onBlur={handleBlur}
//           />
//           {touched.username && errors.username && <div>{errors.username}</div>}
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={values.password}
//             onChange={handleChange}
//             onBlur={handleBlur}
//           />
//           {touched.password && errors.password && <div>{errors.password}</div>}
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

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

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 5 }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [dispatch] = useDisptachForAction();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    dispatch(userLoggedIn());
    navigate('/');
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${require("../assets/Images/bg_water.jpeg")})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'contain',
          backgroundRepeat: 'no-repeat'
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
        <Typography variant="h1" sx={{
          color: 'whitesmoke'
        }} component="h2">
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
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
            <Copyright />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
