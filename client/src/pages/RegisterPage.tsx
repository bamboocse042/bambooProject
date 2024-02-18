import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// function Copyright(props: any) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function RegisterPage() {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>(""); 
  const [submitClicked, setSubmitClicked] = React.useState<boolean>(false);
  const [otp, setOtp] = React.useState("");
  const [verifyOtpPage,setVerifyOtpPage] = React.useState(false); 

  const navigate = useNavigate(); 

  const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitClicked(true);
    console.log("hii");
    const response = await fetch("http://localhost:1111/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });
    const data = await response.json();

    if (data.status === "ok") {
      const otpResponse = await fetch("http://localhost:1111/api/generateOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });
      const responseData = await otpResponse.json();
      if(responseData.status === "ok"){
        setVerifyOtpPage(true);
        setSubmitClicked(false);
      }
    }
    console.log("data", data);
  }

  const verifyOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitClicked(true);
    const response = await fetch("http://localhost:1111/api/verifyOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        otp
      })
    });
    const data = await response.json();
    if (data.status === "ok") {
      navigate("/home");
    }
    else{
        setOtp("");
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitClicked(true);
    console.log({
      name: name,
      email: email,
      password: password,
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {verifyOtpPage===false ? <Box component="form" onSubmit={registerUser} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              value = {name}
              onChange = {(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> {
                setName(e.target.value);
              }}
              error = {submitClicked && name===""}
              helperText = { (submitClicked && name==="") ? "Please your name to sign up" : ""}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value = {email}
              onChange = {(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> {
                setEmail(e.target.value);
              }}
              error = {submitClicked && email===""}
              helperText = { (submitClicked && email==="") ? "Please enter email to sign up" : ""}
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
              value = {password}
              onChange = {(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> {
                setPassword(e.target.value);
              }}
              error = {submitClicked && password===""}
              helperText = { (submitClicked && password==="") ? "Please enter password to sign up" : ""}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box> : <Box component="form" onSubmit={verifyOTP} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              name="otp"
              label="OTP"
              type="otp"
              id="otp"
              value = {otp}
              onChange = {(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=> {
                setOtp(e.target.value);
              }}
              error = {submitClicked && otp===""}
              helperText = { (submitClicked && password==="") ? "Please enter valid OTP to sign up" : ""}
            />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Verify
            </Button>
            </Box>}
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}