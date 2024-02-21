import React, { useState, useEffect } from "react";
import "./Instructorsettings.scss";
import Panel from "../Panel/Panel";
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
import { TextField, Select, MenuItem } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import CancelIcon from "@mui/icons-material/Cancel";
import Checkbox from "@mui/material/Checkbox";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../../config/Firebase";
import profileplaceholder from "./profileplaceholder.jpeg";
import { useNavigate } from "react-router-dom";

const storage = getStorage(app);

export default function Instructorsettings() {
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    email: "",
    instructorId: "",
    oldpassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const instructor = useSelector((state) => state.instructor.instructor);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (instructor.isInstructor) {
          setLoading(true);
          console.log(instructor.token);
          const response = await axios.get(
            `https://beliverz-server.vercel.app/instructor/get-instructor`,
            {
              headers: {
                Authorization: `Bearer ${instructor.token}`,
              },
            }
          );
          setFormData((prevData) => ({
            ...prevData,
            photo: response.data.instructor.photo,
          }));
          setFormData((prevData) => ({
            ...prevData,
            name: response.data.instructor.instructorName,
          }));
          setFormData((prevData) => ({
            ...prevData,
            email: response.data.instructor.email,
          }));
          setFormData((prevData) => ({
            ...prevData,
            instructorId: response.data.instructor.instructorId,
          }));
          console.log(response.data.instructor);
          setLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setLoading(false);
          return navigate(`/`);
        }
        setAlert(
          <Alert
            style={{
              position: "fixed",
              bottom: "3%",
              left: "2%",
              zIndex: 999,
            }}
            variant="filled"
            severity="error"
          >
            {error.response?.data.error || "An error occurred."}
          </Alert>
        );
        setTimeout(() => setAlert(null), 5000);
        setLoading(false);
      }
    };

    fetchData();
  }, [instructor]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const handlepasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setAlert(
        <Alert
          style={{
            position: "fixed",
            bottom: "3%",
            left: "2%",
            zIndex: 999,
          }}
          variant="filled"
          severity="error"
        >
          <p>Passwords Don't match</p>
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "https://beliverz-server.vercel.app/instructor/change-password",
        {
          formData,
          email: instructor.email,
        },
        {
          headers: {
            Authorization: `Bearer ${instructor.token}`,
          },
        }
      );

      console.log(response);
      setAlert(
        <Alert
          style={{
            position: "fixed",
            bottom: "3%",
            left: "2%",
            zIndex: 999,
          }}
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
          style={{
            position: "fixed",
            bottom: "3%",
            left: "2%",
            zIndex: 999,
          }}
          variant="filled"
          severity="error"
        >
          {error.response?.data.error || "An error occurred."}
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://beliverz-server.vercel.app/instructor/change-photoAndName",
        {
          formData,
          email: instructor.email,
        },
        {
          headers: {
            Authorization: `Bearer ${instructor.token}`,
          },
        }
      );

      console.log(response);
      setAlert(
        <Alert
          style={{
            position: "fixed",
            bottom: "3%",
            left: "2%",
            zIndex: 999,
          }}
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
          style={{
            position: "fixed",
            bottom: "3%",
            left: "2%",
            zIndex: 999,
          }}
          variant="filled"
          severity="error"
        >
          {error.response?.data.error || "An error occurred."}
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      setLoading(false);
    }
  };

  const handleimgchange = async (instructorId, e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const storageRef = ref(storage, `instructors/${instructorId}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        setFormData((prevData) => ({ ...prevData, photo: downloadURL }));
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
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
            <form
              onSubmit={handlepasswordSubmit}
              className="flex flex-col gap-8 w-2/5"
            >
              <p className="text-4xl font-semibold md:text-2xl text-center">
                Change Password
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
                  fullWidth
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
                  label="Old Password"
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
                  fullWidth
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
                <InputLabel htmlFor="confirm-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  className="w-full rounded form-input"
                  type={showconfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  name="confirmPassword"
                  required
                  fullWidth
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
                  label="Confirm Password"
                />
              </FormControl>
              <button className="w-full button-filled py-3">
                Change Password
              </button>
            </form>
            {formData.instructorId ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 w-2/5 items-center"
              >
                <p className="text-4xl font-semibold md:text-2xl">
                  Change Photo and Name
                </p>
                <TextField
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <img
                  src={formData.photo ? formData.photo : profileplaceholder}
                  style={{ objectFit: "cover" }}
                  className="w-80"
                />
                <input
                  type="file"
                  onChange={(e) => handleimgchange(formData.instructorId, e)}
                />
                <button className="w-full button-filled py-3">Update</button>
              </form>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
}
