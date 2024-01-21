import React, { useState, useEffect } from "react";
import "./Adminsettings.scss";
import Panel from "../Panel/Panel";
import { TextField, Select, MenuItem } from "@mui/material";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import Spinnerf from "../../../Components/Spinnerf";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import axios from "axios";

export default function Adminsettings() {
  const [formData, setFormData] = useState({
    oldpassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const admin = useSelector((state) => state.admin.admin);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [showoldPassword, setShowoldPassword] = useState(false);
  const handleClickShowoldPassword = () => setShowoldPassword((show) => !show);
  const handleMouseDownoldPassword = (event) => {
    event.preventDefault();
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const handleClickShowconfirmPassword = () =>
    setShowconfirmPassword((show) => !show);
  const handleMouseDownconfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="error"
        >
          <p>Passwords Don't match</p>
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log(formData);
      const response = await axios.post(
        "https://beliverz-admin-server.vercel.app/admin/change-password",
        {
          formData,
          email: admin.email,
        },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      console.log(response);
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="success"
        >
          <p>{response.data.msg}</p>
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setLoading(false);
        return navigate(`/`);
      }
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
      setLoading(false);
    }
  };

  return (
    <div className="Adminsettings flex" id="Adminsettings">
      <Panel tab="Settings" />
      <Stack spacing={2}>{alert}</Stack>

      <div
        className="flex flex-wrap md:flex-col justify-between w-3/4 gap-10 h-full md:items-center"
        style={{ marginLeft: "1vw", marginTop: "10vh" }}
      >
        {loading ? (
          <Spinnerf />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-1/3 md:w-full">
              <p className="text-4xl font-semibold md:text-2xl">
                Change Admin Password
              </p>
              <FormControl variant="outlined">
                <InputLabel htmlFor="admin-oldpassword">
                  Old Password
                </InputLabel>
                <OutlinedInput
                  id="admin-oldpassword"
                  className="w-full rounded"
                  type={showoldPassword ? "text" : "password"}
                  value={formData.oldpassword}
                  onChange={handleInputChange}
                  name="oldpassword"
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowoldPassword}
                        onMouseDown={handleMouseDownoldPassword}
                        edge="end"
                      >
                        {showoldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel htmlFor="instructor-password">Password</InputLabel>
                <OutlinedInput
                  id="instructor-password"
                  className="w-full rounded form-input"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
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

              <FormControl variant="outlined">
                <InputLabel htmlFor="instructor-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="instructor-password"
                  className="w-full rounded form-input"
                  type={showconfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  name="confirmPassword"
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowconfirmPassword}
                        onMouseDown={handleMouseDownconfirmPassword}
                        edge="end"
                      >
                        {showconfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <button className="w-full button-filled py-3">
                {" "}
                Change Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
