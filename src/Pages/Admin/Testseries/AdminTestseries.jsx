import React, { useState, useEffect } from "react";
import axios from "axios";
import Panel from "../Panel/Panel";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import "./AdminTestseries.scss";
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
import plus from "./plus.jpg";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import QuizIcon from "@mui/icons-material/Quiz";

const storage = getStorage(app);

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

export default function AdminTestseries() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const admin = useSelector((state) => state.admin.admin);
  const [alltestseries, setalltestseries] = useState();
  const [allinstructors, setallinstructors] = useState();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    testseriesName: "",
    payment: "free",
    amountInINR: 0,
    testseriesDescription: "",
    numberofQuestions: 0,
    testInstructions: [],
    testInstructionsInput: "",
    instructors: [],
    selectedInstructors: [],
    maxTime:0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `https://api.beliverzjrf.com/admin/get-all-testseries`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `https://api.beliverzjrf.com/admin/get-all-instructors`,
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

  const handletestInstructionsAdd = (e) => {
    e.preventDefault();

    if (formData.testInstructionsInput.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        testInstructions: [
          ...prevData.testInstructions,
          prevData.testInstructionsInput,
        ],
        testInstructionsInput: "",
      }));
    }
  };

  const handletestInstructionsDelete = (testInstructionsDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      testInstructions: prevData.testInstructions.filter(
        (req) => req !== testInstructionsDelete
      ),
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(
        "https://api.beliverzjrf.com/admin/create-testseries",
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
          <p>Test Series Created Successfully</p>
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
    <div className="AdminTestseries flex">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="text-4xl font-semibold poppins text-center my-6">
            Create New Test Series!
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-8"
          >
            <TextField
              label="Test Series Name"
              type="text"
              className="w-full"
              value={formData.testseriesName}
              required
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  testseriesName: e.target.value,
                }))
              }
            />
            <label className="flex flex-col w-full gap-2">
              <p className="text-lg font-normal poppins">Payment:</p>
              <Select
                value={formData.payment}
                label="Test Series type"
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
                label="Test Series Amount in INR"
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
            <TextField
              label="Timer"
              className="w-full"
              type="number"
              value={formData.maxTime}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  maxTime: parseInt(e.target.value),
                }))
              }
            />
            <TextareaAutosize
              className="w-full border-2 border-solid border-gray2 border-opacity-50 rounded p-2"
              aria-label="minimum height"
              minRows={3}
              placeholder="Fill Test Series Description"
              value={formData.testseriesDescription}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  testseriesDescription: e.target.value,
                }))
              }
            />

            <div className="flex flex-col w-full">
              <p className="text-lg font-normal poppins">Test Instructions</p>
              <p className="text-sm font-normal poppins text-gray">
                To fit best in design, add 4-7 points, each point consisting
                around 12 words
              </p>
              <label className="flex w-full justify-between gap-3">
                <TextField
                  type="text"
                  placeholder="Enter Test Instructions"
                  className="w-3/4"
                  value={formData.testInstructionsInput}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      testInstructionsInput: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={handletestInstructionsAdd}
                  className="w-1/4 button-filled"
                >
                  Add
                </button>
              </label>
              <div className="flex gap-4">
                {formData.testInstructions.map((req) => (
                  <div key={req}>
                    {req}
                    <CancelIcon
                      onClick={() => handletestInstructionsDelete(req)}
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
            <button className="w-full button-filled py-3">Create New!</button>
          </form>
        </Box>
      </Modal>
      <Panel tab="Test Series" />
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {alltestseries && (
            <div
              className="flex flex-wrap md:flex-col justify-center gap-8 w-3/4 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              <div
                className="flex flex-col items-center justify-center cursor-pointer admin-testseries-card bg-[#F1F3F2]"
                onClick={handleOpen}
              >
                <QuizIcon style={{ fontSize: "75px" }} />
                <p className="font-bold text-2xl md:text-xl">
                  Create New Test Series
                </p>
              </div>
              {alltestseries.map((item, index) => (
                <Link to={`/admin/testseries/${item.testseriesId}`}>
                  <div
                    className="cursor-pointer relative admin-testseries-card gap-1 rounded-xl flex flex-col items-center"
                    key={item.testseriesId}
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
                      variant={item.payment === "free" ? "filled" : "outlined"}
                      style={{
                        backgroundColor: "#5A81EE",
                        color: "white",
                      }}
                      className="absolute top-3 right-3 z-50"
                    />
                    <div className="w-11/12 flex justify-between my-3">
                      <p className="font-medium text-black1 text-xl">
                        {item.testseriesName}
                      </p>

                      <p className="text-sm font-normal text-black1">
                        {item.totalEnrollments} enrollments
                      </p>
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
