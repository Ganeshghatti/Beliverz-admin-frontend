import React, { useState, useEffect } from "react";
import axios from "axios";
// import firebase from "firebase/app";
// import "firebase/storage";
// import { useFirebaseApp, useUser } from "reactfire";
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
import { TextField, Select, MenuItem } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import CancelIcon from "@mui/icons-material/Cancel";
import Checkbox from "@mui/material/Checkbox";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../../config/Firebase";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinnerf from "../../../Components/Spinnerf";
import profileplaceholder from "./profileplaceholder.jpeg";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import plus from "./plus.jpg";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
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
  height: "100vh",
  width: "90vw",
  "@media (min-width: 868px)": {
    width: "75vw",
  },
};

export default function AdminInstructors() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // setFormData({
    //   instructorId: "",
    //   name: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    //   photo: "",
    //   courses: "",
    //   testseries: "",
    // });
    setOpen(false);
  };

  const [editopen, seteditOpen] = useState(false);
  const handleeditOpen = (instructor) => {
    console.log(instructor);
    setFormData({
      instructorId: instructor.instructorId,
      name: instructor.instructorName,
      email: instructor.email,
      password: "",
      confirmPassword: "",
      photo: instructor.photo,
      courses: instructor.coursesAllowed,
      testseries: instructor.testseriesAllowed,
    });
    seteditOpen(true);
  };
  const handleeditClose = () => {
    seteditOpen(false);
    // setFormData({
    //   instructorId: "",
    //   name: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    //   photo: "",
    //   courses: "",
    //   testseries: "",
    // });
  };
  const navigate = useNavigate();

  const admin = useSelector((state) => state.admin.admin);
  const [allinstructors, setallinstructors] = useState();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [allcoursenames, setallcoursenames] = useState();
  const [alltestseries, setalltestseries] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
    confirmPassword: "",
    courses: [],
    testseries: [],
  });
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
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `${SERVER_URL}/admin/get-all-instructors`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          setallinstructors(response.data.instructors);
          setLoading(false);
        }
      } catch (error) {
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

    fetchData();
  }, [admin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `${SERVER_URL}/admin/get-all-course-names`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response);
          setallcoursenames(response.data.courses);
          setLoading(false);
        }
      } catch (error) {
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

    fetchData();
  }, [admin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `${SERVER_URL}/admin/get-all-testseries-names`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response);
          setalltestseries(response.data.testseries);
          setLoading(false);
        }
      } catch (error) {
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

    fetchData();
  }, [admin]);

  const handleCourseCheckboxChange = (courseIdInput, courseNameInput) => {
    console.log(courseIdInput, courseNameInput);

    const updatedCourses = formData.courses.some(
      (course) => course.courseId === courseIdInput
    )
      ? formData.courses.filter((course) => course.courseId !== courseIdInput)
      : [
          ...formData.courses,
          { courseId: courseIdInput, courseName: courseNameInput },
        ];

    setFormData({
      ...formData,
      courses: updatedCourses,
    });
  };

  const handleTestseriesCheckboxChange = (
    testseriesIdInput,
    testseriesNameInput
  ) => {
    console.log(testseriesIdInput, testseriesNameInput);

    const updatedTestseries = formData.testseries.some(
      (testserie) => testserie.testseriesId === testseriesIdInput
    )
      ? formData.testseries.filter(
          (testserie) => testserie.testseriesId !== testseriesIdInput
        )
      : [
          ...formData.testseries,
          {
            testseriesId: testseriesIdInput,
            testseriesName: testseriesNameInput,
          },
        ];

    setFormData({
      ...formData,
      testseries: updatedTestseries,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        `${SERVER_URL}/admin/create-instructor`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      handleClose();
      window.location.reload();
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="success"
        >
          <p>Successfully Added Instructor</p>
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      setLoading(false);
    } catch (error) {
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

  const handleeditSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.patch(
        `${SERVER_URL}/admin/edit-instructor/${formData.instructorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      handleClose();
      window.location.reload();
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="success"
        >
          <p>Successfully Edited</p>
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      setLoading(false);
    } catch (error) {
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

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this instructor?"
    );
    if (isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(
          `${SERVER_URL}/admin/delete-instructor/${formData.instructorId}`,
          {
            headers: {
              Authorization: `Bearer ${admin.token}`,
            },
          }
        );
        setAlert(
          <Alert
            style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
            variant="filled"
            severity="success"
          >
            <p>Instructor deleted successfully</p>
          </Alert>
        );
        setTimeout(() => setAlert(null), 5000);
        setLoading(false);
      } catch (error) {
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
    }
  };

  return (
    <div className="AdminInstructors flex" id="AdminInstructors">
      <Panel tab="Instructors" />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="text-4xl font-semibold poppins text-center my-6">
            Add New Instructor!
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
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
                      {showconfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            {allcoursenames ? (
              <div className="flex flex-col w-full">
                <label className="text-lg font-normal poppins">
                  Select Courses to Allow:
                </label>{" "}
                <div className="flex flex-wrap gap-4">
                  {allcoursenames.map((course) => (
                    <div key={course.courseId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.courses.some(
                              (c) => c.courseId === course.courseId
                            )}
                            onChange={() =>
                              handleCourseCheckboxChange(
                                course.courseId,
                                course.courseName
                              )
                            }
                          />
                        }
                        label={course.courseName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Spinnerf />
            )}

            {alltestseries ? (
              <div className="flex flex-col w-full">
                <label className="text-lg font-normal poppins">
                  Select Testseries to Allow:
                </label>{" "}
                <div className="flex flex-wrap gap-4">
                  {alltestseries.map((testseries) => (
                    <div key={testseries.testseriesId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.testseries.some(
                              (t) => t.testseriesId === testseries.testseriesId
                            )}
                            onChange={() =>
                              handleTestseriesCheckboxChange(
                                testseries.testseriesId,
                                testseries.testseriesName
                              )
                            }
                          />
                        }
                        label={testseries.testseriesName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Spinnerf />
            )}

            <button className="w-full button-filled py-3"> Add New!</button>
          </form>
        </Box>
      </Modal>
      <Modal
        open={editopen}
        onClose={handleeditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="absolute left-1/2 top-1/2 w-1/2 md:w-11/12 bg-white p-8 flex flex-col justify-center gap-4"
          style={{
            transform: "translate(-50%, -50%)",
            border: "2px solid #000",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <h1 className="text-4xl font-semibold poppins text-center my-6">
            Edit Instructor
          </h1>
          <img
            src={formData.photo ? formData.photo : profileplaceholder}
            className="object-contain self-center w-44"
          />
          <form className="flex flex-col gap-4">
            <TextField
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            {allcoursenames ? (
              <div className="flex flex-col w-full">
                <label className="text-lg font-normal poppins">
                  Select Courses to Allow:
                </label>
                <div className="flex flex-wrap gap-4">
                  {allcoursenames.map((course) => (
                    <div key={course.courseId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.courses.some(
                              (c) => c.courseId === course.courseId
                            )}
                            onChange={() =>
                              handleCourseCheckboxChange(
                                course.courseId,
                                course.courseName
                              )
                            }
                          />
                        }
                        label={course.courseName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Spinnerf />
            )}
            {alltestseries ? (
              <div className="flex flex-col w-full">
                <label className="text-lg font-normal poppins">
                  Select Testseries to Allow:
                </label>
                <div className="flex flex-wrap gap-4">
                  {alltestseries.map((testseries) => (
                    <div key={testseries.testseriesId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.testseries.some(
                              (t) => t.testseriesId === testseries.testseriesId
                            )}
                            onChange={() =>
                              handleTestseriesCheckboxChange(
                                testseries.testseriesId,
                                testseries.testseriesName
                              )
                            }
                          />
                        }
                        label={testseries.testseriesName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Spinnerf />
            )}
            <button
              className="w-full button-filled py-3"
              onClick={handleeditSubmit}
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-white py-3 rounded-xl"
              style={{ backgroundColor: "red" }}
            >
              Delete
            </button>
          </form>
        </Box>
      </Modal>
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {allinstructors && (
            <div
              className="flex flex-wrap md:flex-col justify-between  w-3/4 gap-10 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              <div
                className="flex flex-col items-center justify-center cursor-pointer AdminInstructors-card w-2/5 md:w-11/12 p-6"
                onClick={handleOpen}
                style={{ backgroundColor: "#F1F3F2" }}
              >
                <img
                  style={{ objectFit: "contain" }}
                  src={plus}
                  className="w-1/3 md:w-full"
                />
                <p className="font-bold text-2xl md:text-xl">
                  Add New Instructor
                </p>
              </div>

              {allinstructors.map((item, index) => (
                <div
                  key={item.instructorId}
                  onClick={() => handleeditOpen(item, index)}
                  className="cursor-pointer relative AdminInstructors-card flex md:flex-col gap-6 w-2/5 md:w-11/12 p-4"
                  style={{ backgroundColor: "#F7F7F7" }}
                >
                  <div className="w-1/3 flex items-center justify-center md:w-full">
                    <img
                      src={item.photo || profileplaceholder}
                      style={{ objectFit: "cover" }}
                      className="w-full"
                    />
                  </div>

                  <div className="p-4 w-2/3 flex flex-col gap-1 md:w-full">
                    <Chip
                      label={item.instructorId}
                      variant="filled"
                      style={{
                        backgroundColor: "#5A81EE",
                        color: "white",
                      }}
                      className="absolute top-3 left-3 z-50"
                    />

                    <p className="font-medium text-xl md:text-lg">
                      {item.instructorName}
                    </p>
                    <p className="text-lg md:text-base font-medium">
                      {item.email}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.coursesAllowed.map((course, index) => (
                        <Chip
                          key={course.courseId}
                          label={course.courseName}
                          variant="outlined"
                          style={{ backgroundColor: "#5A81EE", color: "white" }}
                          className="text-normal font-semibold OpenSauceSans w-fit"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
