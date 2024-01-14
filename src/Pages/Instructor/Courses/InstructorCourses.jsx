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
import "./InstructorCourses.scss";
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
import imgplaceholder from "./imgplaceholder.jpg";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import sad from "./sad.png";

const storage = getStorage(app);

export default function InstructorCourses() {
  const navigate = useNavigate();

  const instructor = useSelector((state) => state.instructor.instructor);
  const [allcourses, setallcourses] = useState();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (instructor.isInstructor) {
          setLoading(true);

          const response = await axios.get(
            `https://beliverz-admin-server.vercel.app/instructor/get-accessible-course`,
            {
              headers: {
                Authorization: `Bearer ${instructor.token}`,
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
  }, [instructor]);

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

  return (
    <div className="InstructorCourses flex">
      <Panel tab="Courses"/>
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {allcourses && (
            <div
              className="flex flex-wrap md:flex-col justify-center gap-8 w-3/4 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              {allcourses.length === 0 && (
                <Card
                  className="flex flex-col items-center justify-center p-4"
                  style={{ backgroundColor: "#F1F3F2", maxWidth: 345 }}
                >
                  <img
                    style={{ objectFit: "contain" }}
                    src={sad}
                    className="w-1/2"
                  />
                  <CardContent className="flex flex-col gap-2 items-center">
                    <p className="font-bold text-2xl md:text-xl text-center">
                      You don't have access to any course
                    </p>
                    <p className="font-medium text-lg md:text-base text-center">
                      Please request admin to grant access to courses
                    </p>
                  </CardContent>
                </Card>
              )}
              {allcourses.map((item, index) => (
                <Card
                  key={item.courseId}
                  className="cursor-pointer relative InstructorCourses-card"
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
                      variant={item.payment === "free" ? "outlined" : "filled"}
                      style={{
                        backgroundColor:
                          item.payment === "free" ? "transparent" : "#FF9D03",
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
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.courseCategory.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          variant="outlined"
                          style={{ backgroundColor: "#FF9D03", color: "white" }}
                          className="text-normal font-semibold OpenSauceSans w-fit"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
