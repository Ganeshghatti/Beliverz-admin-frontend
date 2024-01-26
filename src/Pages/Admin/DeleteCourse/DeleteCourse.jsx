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
import imgplaceholder from "./imgplaceholder.png";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

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

export default function DeleteCourse() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [allcourses, setallcourses] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const admin = useSelector((state) => state.admin.admin);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:5000/admin/get-all-course`,
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
                <Link to={`/admin/courses/${item.courseId}`}>
                  <div
                    className="cursor-pointer relative admin-delete-courses-card gap-1 rounded-xl flex flex-col items-center"
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
                    </p>

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
