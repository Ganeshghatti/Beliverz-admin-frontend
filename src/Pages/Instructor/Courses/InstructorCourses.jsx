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
import imgplaceholder from "./imgplaceholder.png";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import sad from "./sad.png";
import { Link } from "react-router-dom";

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
            `https://beliverz-server.vercel.app/instructor/get-accessible-course`,
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

    fetchData();
  }, [instructor]);

  return (
    <div className="InstructorCourses flex">
      <Panel tab="Courses" />
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
                <Link to={`/instructor/courses/${item.courseId}`}>
                  <div
                    className="cursor-pointer relative admin-courses-card gap-1 rounded-xl flex flex-col items-center"
                    key={item.courseId}
                  >
                    <img
                      src={item.thumbnail || imgplaceholder}
                      className="h-72 w-full object-cover rounded-xl"
                    />

                    <Chip
                      label={item.payment}
                      variant={item.payment === "free" ? "filled" : "outlined"}
                      style={{
                        backgroundColor: "#5A81EE",
                        color: "white",
                      }}
                      className="absolute top-3 right-3 z-50"
                    />

                    <div className="flex justify-between w-11/12 items-center py-4">
                      <p className="w-11/12 font-medium text-black1 text-xl">
                        {item.courseName}
                      </p>{" "}
                      <Rating
                        value={item.courserating}
                        precision={0.25}
                        emptyIcon={
                          <StarBorderIcon style={{ fontSize: "18px" }} />
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
