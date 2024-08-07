import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";


const INITIAL_FORM_STATE = { username: "", password: "", confirmPassword: "" };
const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {};

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  function renderError(message, variant) {
    enqueueSnackbar(message, {
      variant,
    });
  }
  const validateInput = ({ password, username, confirmPassword }) => {
    username = username.trim();
    let hasError = false;
    if (!username) {
      renderError("Username is a required field", "error");
      hasError = true;
    } else if (username.length < 6) {
      renderError("Username must be at least 6 characters", "warning");
      hasError = true;
    }

    if (!password) {
      renderError("Password is a required field", "error");
      hasError = true;
    } else if (password.length < 6) {
      renderError("Password must be at least 6 characters", "warning");
      hasError = true;
    }

    if (password !== confirmPassword) {
      renderError("Passwords do not match", "error");
      hasError = true;
    }
    return hasError;
  };
  const { password, username, confirmPassword } = formData;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setFormData(INITIAL_FORM_STATE);
  }

  async function submitHandler() {
    const hasError = validateInput(formData);
    if (hasError) {
      return;
    }

    try {
      // API call and POST data
      setLoading(true);
      const res = await axios.post(`${config.endpoint}/auth/register`, {
        password,
        username,
      });
      if (res.status === 201) {
        renderError("Registered successfully", "success");
        resetForm();
        setLoading(false);
        history.push('/login');
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={handleChange}
            value={username}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleChange}
            value={password}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={handleChange}
            value={confirmPassword}
          />
          {loading ? (
            <div className="text-center">
              <CircularProgress color="success" />
            </div>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={submitHandler}
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to='/login'>
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
