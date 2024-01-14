import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveadmin } from "../../features/Admin";
import { saveinstructor } from "../../features/Instructor";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Login.css";
import Spinnerf from "../../Components/Spinnerf";
import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
  });

  const [instructorFormData, setInstructorFormData] = useState({
    email: "",
    password: "",
  });

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData({
      ...adminFormData,
      [name]: value,
    });
  };

  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setInstructorFormData({
      ...instructorFormData,
      [name]: value,
    });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log(adminFormData)
      const response = await axios.post(
        "https://beliverz-admin-server.vercel.app/admin/login",
        adminFormData
      );
      console.log(response)
      const admin = {
        email: response.data.email,
        token: response.data.token,
        isAdmin: response.data.isAdmin,
      };

      localStorage.setItem("admin", JSON.stringify(admin));
      dispatch(
        saveadmin({
          email: response.data.email,
          token: response.data.token,
          isAdmin: response.data.isAdmin,
        })
      );
      navigate(`/admin/dashboard`);
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="error"
        >
          {error.response.data.error}
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "https://beliverz-admin-server.vercel.app/instructor/login",
        instructorFormData
      );
      const instructor = {
        email: response.data.email,
        token: response.data.token,
        isInstructor: response.data.isInstructor,
      };

      localStorage.setItem("instructor", JSON.stringify(instructor));
      dispatch(
        saveinstructor({
          email: response.data.email,
          token: response.data.token,
          isInstructor: response.data.isInstructor,
        })
      );
      navigate(`/instructor/dashboard`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="error"
        >
          {error.response.data.error}
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <section
      className="w-screen h-screen flex md:flex-col justify-center items-center"
      id="login"
    >
      {loading && <Spinnerf />} <Stack spacing={2}>{alert}</Stack>{" "}
      <form
        onSubmit={handleInstructorSubmit}
        className="rounded md:w-11/12 w-1/3 p-12 flex flex-col gap-3 md:p-6"
        style={{ backgroundColor: "white" }}
      >
        <p className="text-navyblue text-3xl font-semibold text-center">
          INSTRUCTOR LOGIN
        </p>
        <TextField
          id="instructor-email"
          variant="outlined"
          type="email"
          name="email"
          value={instructorFormData.email}
          label="Email ID"
          onChange={handleInstructorChange}
          className="w-full rounded form-input"
          required
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="instructor-password">Password</InputLabel>
          <OutlinedInput
            id="instructor-password"
            className="w-full rounded form-input"
            type={showPassword ? "text" : "password"}
            value={instructorFormData.password}
            onChange={handleInstructorChange}
            name="password"
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <button
          type="submit"
          className="bg-navyblue border-1 border-solid border-navyblue text-white rounded w-full py-3 hero-hover-animated-button"
        >
          Instructor Login
        </button>
      </form>
      <form
        onSubmit={handleAdminSubmit}
        className="rounded md:w-11/12 w-1/3 p-12 flex flex-col gap-3 md:p-6"
        style={{ backgroundColor: "white" }}
      >
        <p className="text-navyblue text-3xl font-semibold text-center">
          ADMIN LOGIN
        </p>
        <TextField
          id="admin-email"
          variant="outlined"
          type="email"
          name="email"
          value={adminFormData.email}
          label="Email ID"
          onChange={handleAdminChange}
          className="w-full rounded form-input"
          required
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="admin-password">Password</InputLabel>
          <OutlinedInput
            id="admin-password"
            className="w-full rounded form-input"
            type={showPassword ? "text" : "password"}
            value={adminFormData.password}
            onChange={handleAdminChange}
            name="password"
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <button
          type="submit"
          className="bg-navyblue border-1 border-solid border-navyblue text-white rounded w-full py-3 hero-hover-animated-button"
        >
          Admin Login
        </button>
      </form>
    </section>
  );
};

export default Login;
