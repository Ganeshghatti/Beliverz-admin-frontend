import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCoursesPage.scss";
import { useParams } from "react-router-dom";
import Panel from "../Panel/Panel";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinnerf from "../../../Components/Spinnerf";
import imgplaceholder from "./imgplaceholder.jpg";
import plus from "./plus.jpg";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextField, Select, MenuItem } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import CancelIcon from "@mui/icons-material/Cancel";
import Checkbox from "@mui/material/Checkbox";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { app } from "../../../config/Firebase";

const storage = getStorage(app);

export default function AdminCoursePage() {
  const { courseId } = useParams();
  const admin = useSelector((state) => state.admin.admin);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin && courseId) {
          setLoading(true);
          console.log(courseId);
          const response = await axios.get(
            `https://beliverz-admin-server.vercel.app/admin/courses/${courseId}`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response);
          setFormData(response.data.course);
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
            {error.response}
          </Alert>
        );
        setTimeout(() => setAlert(null), 5000);
        setLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  return (
    <div className="AdminCoursePage flex">
      {courseId && <Panel tab={courseId} />}
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {formData && formData.courseName ? (
            <div
              className="flex flex-wrap md:flex-col justify-between gap-8 w-3/4 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              {formData.courseName}
            </div>
          ) : (
            <div
              className="flex flex-wrap md:flex-col justify-between gap-8 w-3/4 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              <h1>Data Not Available</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}
