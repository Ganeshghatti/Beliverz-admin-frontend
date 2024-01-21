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
import "./AdminCourses.scss";
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
import { Link, useNavigate } from "react-router-dom";
import Spinnerf from "../../../Components/Spinnerf";
import imgplaceholder from "./imgplaceholder.jpg";
import plus from "./plus.jpg";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const storage = getStorage(app);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75vw",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  height: "100vh",
};

export default function AdminCourses() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const admin = useSelector((state) => state.admin.admin);
  const [allcourses, setallcourses] = useState();
  const [allinstructors, setallinstructors] = useState();
  const [allcategory, setallcategory] = useState();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    courseName: "",
    payment: "free",
    amountInINR: 0,
    courseDescription: "",
    level: "beginner",
    tags: [],
    tagInput: "",
    requirements: [],
    requirementInput: "",
    totalHours: "",
    selectedCategories: [],
    categories: [],
    introVideo: null,
    videoUrl: "",
    whatWillYouLearn: [],
    whatWillYouLearnInput: "",
    instructors: [],
    selectedInstructors: [],
    language: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `https://beliverz-admin-server.vercel.app/admin/get-all-course`,
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
            `https://beliverz-admin-server.vercel.app/admin/get-all-instructors`,
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
            `https://beliverz-admin-server.vercel.app/admin/get-all-category`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response.data.category);
          setallcategory(response.data.category);
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

  const handleTagAdd = (e) => {
    e.preventDefault();

    if (formData.tagInput.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, prevData.tagInput],
        tagInput: "",
      }));
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleRequirementAdd = (e) => {
    e.preventDefault();

    if (formData.requirementInput.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        requirements: [...prevData.requirements, prevData.requirementInput],
        requirementInput: "",
      }));
    }
  };

  const handleRequirementDelete = (requirementToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      requirements: prevData.requirements.filter(
        (req) => req !== requirementToDelete
      ),
    }));
  };

  const handleWhatwillyoulearnAdd = (e) => {
    e.preventDefault();

    if (formData.whatWillYouLearnInput.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        whatWillYouLearn: [
          ...prevData.whatWillYouLearn,
          prevData.whatWillYouLearnInput,
        ],
        whatWillYouLearnInput: "",
      }));
    }
  };

  const handlewhatWillYouLearnDelete = (whatWillYouLearnToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      whatWillYouLearn: prevData.whatWillYouLearn.filter(
        (req) => req !== whatWillYouLearnToDelete
      ),
    }));
  };

  const handleCategoryChange = (categoryIdinput, categoryNameInput) => {
    const updatedcategory = formData.categories.some(
      (category) => category.categoryId === categoryIdinput
    )
      ? formData.categories.filter(
          (category) => category.categoryId !== categoryIdinput
        )
      : [
          ...formData.categories,
          {
            categoryId: categoryIdinput,
            categoryName: categoryNameInput,
          },
        ];

    setFormData({
      ...formData,
      categories: updatedcategory,
    });
  };

  const handleInstructorChange = (instructorIdinput, instructorNameInput) => {
    const updatedInstructors = formData.instructors.some(
      (instructor) => instructor.instructorId === instructorIdinput
    )
      ? formData.instructors.filter(
          (instructor) => instructor.instructorId !== instructorIdinput
        )
      : [
          ...formData.instructors,
          {
            instructorId: instructorIdinput,
            instructorName: instructorNameInput,
          },
        ];

    setFormData({
      ...formData,
      instructors: updatedInstructors,
    });
  };

  // const handleVideoUpload = async (e) => {
  //   console.log(formData.courseName);
  //   if (!formData.courseName) {
  //     setAlert(
  //       <Alert
  //         style={{ position: "fixed", bottom: "3", left: "2", zIndex: "999" }}
  //         variant="filled"
  //         severity="warning"
  //       >
  //         Please enter course Name
  //       </Alert>
  //     );
  //     setTimeout(() => setAlert(null), 5000);
  //     return;
  //   }
  //   try {
  //     const file = e.target.files[0];
  //     const storageRef = ref(
  //       storage,
  //       `courses/${formData.courseName}/introVideo`
  //     );

  //     const snapshot = await uploadBytes(storageRef, file);
  //     const downloadURL = await getDownloadURL(snapshot.ref);
  //     console.log(downloadURL);

  //     setFormData((prevData) => ({
  //       ...prevData,
  //       introVideo: file,
  //       videoUrl: downloadURL,
  //     }));
  //   } catch (error) {
  //     console.error(`Error uploading ${file.name}:`, error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(
        "https://beliverz-admin-server.vercel.app/admin/create-course",
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
          <p>Course Created Successfully</p>
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
  return (
    <div className="AdminCourses flex">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="text-4xl font-semibold poppins text-center my-6">
            Create New Course!
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-8"
          >
            <TextField
              label="Course Name"
              type="text"
              className="w-full"
              value={formData.courseName}
              required
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  courseName: e.target.value,
                }))
              }
            />
            <label className="flex flex-col w-full gap-2">
              <p className="text-lg font-normal poppins">Payment:</p>
              <Select
                value={formData.payment}
                label="Course type"
                className="w-full"
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    payment: e.target.value,
                  }))
                }
              >
                <MenuItem value="free" className="w-full">
                  Free
                </MenuItem>
                <MenuItem value="paid" className="w-full">
                  Paid
                </MenuItem>
              </Select>
            </label>
            {formData.payment === "paid" && (
              <TextField
                label="Course Amount in INR"
                className="w-full"
                type="number"
                value={formData.amountInINR}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    amountInINR: parseInt(e.target.value),
                  }))
                }
              />
            )}
            <TextareaAutosize
              className="w-full border-2 border-solid border-gray2 border-opacity-50 rounded p-2"
              aria-label="minimum height"
              minRows={3}
              placeholder="Fill Course Description"
              value={formData.courseDescription}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  courseDescription: e.target.value,
                }))
              }
            />

            <div className="flex flex-col w-full">
              <p className="text-lg font-normal poppins">Tags:</p>
              <label className="flex w-full justify-between gap-3">
                <TextField
                  type="text"
                  placeholder="Enter Course Tags. Ex:- web development"
                  className="w-3/4"
                  value={formData.tagInput}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      tagInput: e.target.value,
                    }))
                  }
                />
                <button onClick={handleTagAdd} className="w-1/4 button-filled">
                  Add
                </button>
              </label>
              <div className="flex gap-4">
                {formData.tags.map((tag) => (
                  <div key={tag}>
                    {tag}
                    <CancelIcon
                      onClick={() => handleTagDelete(tag)}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-lg font-normal poppins">Requirements:</p>
              <label className="flex w-full justify-between gap-3">
                <TextField
                  type="text"
                  placeholder="Enter Requirements. Ex:- Must Know Basics of Web Development"
                  className="w-3/4"
                  value={formData.requirementInput}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      requirementInput: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={handleRequirementAdd}
                  className="w-1/4 button-filled"
                >
                  Add
                </button>
              </label>
              <div className="flex gap-4">
                {formData.requirements.map((req) => (
                  <div key={req}>
                    {req}
                    <CancelIcon
                      onClick={() => handleRequirementDelete(req)}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            <TextField
              label="Number of Hours"
              className="w-full"
              value={formData.totalHours}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  totalHours: e.target.value,
                }))
              }
            />

            {allcategory ? (
              <div className="flex flex-col w-full">
                <label className="text-lg font-normal poppins">
                  Categories:
                </label>
                <div className="flex flex-wrap gap-4">
                  {allcategory.map((category) => (
                    <div key={category.categoryId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.categories.some(
                              (c) => c.categoryId === category.categoryId
                            )}
                            onChange={() =>
                              handleCategoryChange(
                                category.categoryId,
                                category.categoryName
                              )
                            }
                          />
                        }
                        label={category.categoryName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Spinnerf />
            )}

            {/* <label className="flex flex-col w-full gap-2">
              <p className="text-lg font-normal poppins">Intro Video:</p>
              <input type="file" onChange={handleVideoUpload} />
            </label> */}

            <div className="flex flex-col w-full">
              <p className="text-lg font-normal poppins">What Will you learn</p>
              <p className="text-sm font-normal poppins text-gray">
                To fit best in design, add 4-7 points, each point consisting
                around 12 words
              </p>
              <label className="flex w-full justify-between gap-3">
                <TextField
                  type="text"
                  placeholder="Enter Top Learnings. Ex:- HTML, CSS "
                  className="w-3/4"
                  value={formData.whatWillYouLearnInput}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      whatWillYouLearnInput: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={handleWhatwillyoulearnAdd}
                  className="w-1/4 button-filled"
                >
                  Add
                </button>
              </label>
              <div className="flex gap-4">
                {formData.whatWillYouLearn.map((req) => (
                  <div key={req}>
                    {req}
                    <CancelIcon
                      onClick={() => handlewhatWillYouLearnDelete(req)}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            {allinstructors ? (
              <div className="flex flex-col w-full">
                <label className="text-lg font-normal poppins">
                  Instructors:
                </label>
                <div className="flex flex-wrap gap-4">
                  {allinstructors.map((instructor) => (
                    <div key={instructor.instructorId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.instructors.some(
                              (c) => c.instructorId === instructor.instructorId
                            )}
                            onChange={() =>
                              handleInstructorChange(
                                instructor.instructorId,
                                instructor.instructorName
                              )
                            }
                          />
                        }
                        label={instructor.instructorName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Spinnerf />
            )}

            <div className="flex flex-col w-full">
              <label className="text-lg font-normal poppins">Level:</label>
              <RadioGroup
                name="level"
                value={formData.level}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    level: event.target.value,
                  });
                }}
                className="flex flex-wrap gap-4"
              >
                <FormControlLabel
                  value="beginner"
                  control={<Radio />}
                  label="Beginner"
                />
                <FormControlLabel
                  value="intermediate"
                  control={<Radio />}
                  label="Intermediate"
                />
                <FormControlLabel
                  value="advance"
                  control={<Radio />}
                  label="Advance"
                />
              </RadioGroup>
            </div>
            <TextField
              label="Language"
              type="text"
              className="w-full"
              value={formData.language}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  language: e.target.value,
                }))
              }
            />
            <button className="w-full button-filled py-3">Create New!</button>
          </form>
        </Box>
      </Modal>
      <Panel tab="Courses" />
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {allcourses && (
            <div
              className="flex flex-wrap md:flex-col justify-between gap-8 w-3/4 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              <Card
                className="flex flex-col items-center justify-center cursor-pointer AdminCourses-card"
                onClick={handleOpen}
                style={{ backgroundColor: "#F1F3F2", maxWidth: 345 }}
              >
                <img
                  style={{ objectFit: "contain" }}
                  src={plus}
                  className="w-1/2"
                />
                <CardContent>
                  <p className="font-bold text-2xl md:text-xl">
                    Create New Course
                  </p>
                </CardContent>
              </Card>
              {allcourses.map((item, index) => (
                <Link to={`/admin/courses/${item.courseId}`}>
                  <Card
                    key={item.courseId}
                    className="cursor-pointer relative AdminCourses-card"
                    style={{ maxWidth: 345 }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.thumbmail || imgplaceholder}
                      style={{ objectFit: "contain" }}
                    />

                    <div className="p-4">
                      <Chip
                        label={item.payment}
                        variant={
                          item.payment === "free" ? "outlined" : "filled"
                        }
                        style={{
                          backgroundColor:
                            item.payment === "free" ? "transparent" : "#5A81EE",
                          color: item.payment === "free" ? "black" : "white",
                        }}
                        className="absolute top-3 right-3 z-50"
                      />

                      <div className="flex items-center w-full justify-center absolute">
                        <Rating
                          value={item.rating}
                          precision={0.25}
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          readOnly
                          className="z-50 -top-14 absolute"
                        />
                      </div>

                      <div className="flex flex-col gap-2 w-11/12 self-center m-auto">
                        <p className="font-semibold text-2xl md:text-xl">
                          {item.courseName}
                        </p>
                        <p className="text-xl md:text-lg font-bold">
                          <span className="text-2xl font-bold">
                            {item.courseInfo.totalEnrollments}
                          </span>
                          enrollments
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.courseCategory.map((category, index) => (
                          <Chip
                            key={category.categoryId}
                            label={category.categoryName}
                            variant="outlined"
                            style={{
                              backgroundColor: "#5A81EE",
                              color: "white",
                            }}
                            className="text-normal font-semibold OpenSauceSans w-fit"
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
