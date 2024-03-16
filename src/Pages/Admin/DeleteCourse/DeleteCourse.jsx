import React, { useState, useEffect } from "react";
import "./DeleteCourse.scss";
import Panel from "../Panel/Panel";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinnerf from "../../../Components/Spinnerf";
import imgplaceholder from "./imgplaceholder.png";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
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
import { SERVER_URL } from "../../../config/server";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  border: "2px solid #000",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
  padding: "16px",
  overflow: "auto",
  height: "auto",
  width: "40vw",
  "@media (min-width: 868px)": {
    width: "75vw",
  },
};

export default function DeleteCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [allcourses, setallcourses] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const admin = useSelector((state) => state.admin.admin);
  const [adminFormData, setAdminFormData] = useState({
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
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `${SERVER_URL}/admin/get-all-course`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response.data.courses);
          setallcourses(response.data.courses);
          setLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setLoading(false);
          return navigate(`/`);
        }
        console.log(error);
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

    fetchData();
  }, [admin]);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log(adminFormData);
      const response = await axios.post(
        `${SERVER_URL}/admin/login`,
        adminFormData
      );
      console.log(response);
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
      console.log(error);
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
    <div className="DeleteCourse flex" id="DeleteCourse">
      <Panel tab="Delete Courses" />
      <Stack spacing={2}>{alert}</Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="text-4xl font-semibold poppins text-center my-6 text-[#FF0000]">
            Are you sure you want to delete the Course ?
          </h1>
          <form
            onSubmit={handleAdminSubmit}
            className="rounded md:w-11/12 w-1/3 p-12 flex flex-col gap-3 md:p-6"
            style={{ backgroundColor: "white" }}
          >
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
              fullWidth
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
              className="bg-blue border-1 border-solid border-blue text-white rounded w-full py-3 hero-hover-animated-button"
            >
              Admin Login
            </button>
          </form>
        </Box>
      </Modal>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {allcourses && (
            <div
              className="flex flex-wrap md:flex-col justify-center gap-8 w-3/4 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              {allcourses.map((item, index) => (
                <div
                  className="cursor-pointer relative admin-delete-courses-card gap-3 rounded-xl flex flex-col items-center"
                  key={item.courseId}
                >
                  <img
                    src={item.thumbnail || imgplaceholder}
                    className="h-72 w-full object-cover rounded-xl"
                  />
                  <Chip
                    label={
                      item.payment === "free" ? (
                        item.payment
                      ) : (
                        <p className="text-sm p-1 flex justify-center items-center">
                          <CurrencyRupeeIcon style={{ fontSize: "16px" }} />
                          {item.amountInINR}
                        </p>
                      )
                    }
                    variant={
                      item.coursepayment === "free" ? "filled" : "outlined"
                    }
                    style={{
                      backgroundColor: "#5A81EE",
                      color: "white",
                    }}
                    className="absolute top-3 right-3 z-50"
                  />
                  <div className="w-11/12 flex justify-between">
                    <p className="text-sm font-normal text-black1">
                      {item.language}
                    </p>
                    <p className="text-sm font-normal text-black1">
                      {item.courseInfo.totalEnrollments} enrollments
                    </p>
                  </div>
                  <p className="w-11/12 font-medium text-black1 text-xl">
                    {item.courseName}
                  </p>{" "}
                  <button
                    onClick={handleOpen}
                    className="w-full py-4 flex items-center bg-[#FF0000] border-2 border-white border-solid text-white font-medium justify-center"
                  >
                    <DeleteIcon />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
