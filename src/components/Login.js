import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const INITIAL_FORM_STATE = { username: "", password: "" };
const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
   function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setFormData(INITIAL_FORM_STATE);
  }

  function renderError(message, variant) {
    enqueueSnackbar(message, {
      variant,
    });
  }

    // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
   const persistLogin = (username, token, balance) => {
    localStorage.clear();
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('balance', balance);
   };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = ({username, password}) => {
    username = username.trim();
    let hasError = false;
    if (!username) {
      renderError("Username is a required field", "error");
      hasError = true;
    } else if (!password) {
      renderError("Password is a required field", "error");
      hasError = true;
    }
    return hasError;
  };

  const {username, password} = formData;
  async function loginHandler() {
    const hasError = validateInput({ username, password });
    if(hasError) {
      return;
    }
    try {
      // API call and POST data
      setLoading(true);
      const res = await axios.post(`${config.endpoint}/auth/login`, {
        password,
        username,
      });
      if (res.status === 201) {
        renderError("Logged in successfully", "success");
        resetForm();
        const {username, token, balance} = res.data
        persistLogin(username, token, balance);
        setLoading(false);
        history.push("/");
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        renderError(error.response.data.message, "error");
        return;
      }

      renderError(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        "error"
      );
    }
  }


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons="false" />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Username"
            fullWidth
            value={username}
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
          {loading ? (
            <div className="text-center">
              <CircularProgress color="success" />
            </div>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={loginHandler}
            >
              LOGIN TO QKART
            </Button>
          )}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to='/register'>
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
