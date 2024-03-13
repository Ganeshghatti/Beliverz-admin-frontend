import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TestseriesPage.scss";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import LinearProgress from "@mui/joy/LinearProgress";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "@mui/joy/Avatar";
import AccordionGroup from "@mui/joy/AccordionGroup";
import { v4 as uuidv4 } from "uuid";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const storage = getStorage(app);
const videoStyle = {
  width: "100%",
  height: "auto",
};

export default function TestseriesPage() {
  const { testseriesId } = useParams();
  const admin = useSelector((state) => state.admin.admin);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({});
  const [thumbnailUploadLoader, setthumbnailUploadLoader] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [instructors, setinstructors] = useState();
  const [instructorloading, setinstructorLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin && testseriesId) {
          setLoading(true);
          console.log(testseriesId);
          const response = await axios.get(
            `https://api.beliverzjrf.com/testseries/${testseriesId}`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          setFormData(response.data.testseries);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.messsage);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (testseriesId && admin.token) {
          setinstructorLoading(true);
          const response = await axios.get(
            `https://api.beliverzjrf.com/testseries/${testseriesId}/instructors`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          setinstructors(response.data.instructors);
          setinstructorLoading(false);
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
            {error.response}
          </Alert>
        );
        setTimeout(() => setAlert(null), 5000);
        setinstructorLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `https://api.beliverzjrf.com/testseries/${testseriesId}`,
        { updatedtestseriesDetails: formData, email: admin.email },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
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
          Test details updated successfully!
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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

  const handletestInstructionsDelete = (testInstructionsToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      testInstructions: prevData.testInstructions.filter(
        (req) => req !== testInstructionsToDelete
      ),
    }));
  };

  const handlethumbnailupload = async (e) => {
    if (!formData.testseriesId) {
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3", left: "2", zIndex: "999" }}
          variant="filled"
          severity="warning"
        >
          Test Series ID not found
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      return;
    }
    try {
      setthumbnailUploadLoader(true);
      const file = e.target.files[0];
      const storageRef = ref(
        storage,
        `testseries/${formData.testseriesId}/thumbnail`
      );

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setFormData((prevData) => ({
        ...prevData,
        thumbnail: downloadURL,
      }));

      setthumbnailUploadLoader(false);
    } catch (error) {
      console.log(error);
      setthumbnailUploadLoader(false);
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3", left: "2", zIndex: "999" }}
          variant="filled"
          severity="warning"
        >
          Upload Failed
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleAddQuestion = () => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          questionText: "",
          options: [
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
          ],
        },
      ],
    }));
  };

  // Function to handle editing question text
  const handleEditQuestionText = (questionIndex, newText) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex].questionText = newText;
      return { ...prevData, questions: updatedQuestions };
    });
  };

  // Function to handle editing option text
  const handleEditOptionText = (questionIndex, optionIndex, newText) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex].options[optionIndex].optionText = newText;
      return { ...prevData, questions: updatedQuestions };
    });
  };

  const handleToggleCorrectOption = (questionIndex, optionIndex) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedOptions = updatedQuestions[questionIndex].options.map(
        (option, index) => ({
          ...option,
          isCorrect: index === optionIndex,
        })
      );
      updatedQuestions[questionIndex].options = updatedOptions;
      return { ...prevData, questions: updatedQuestions };
    });
  };

  // Function to handle deleting a question
  const handleDeleteQuestion = (questionIndex) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions.splice(questionIndex, 1);
      return { ...prevData, questions: updatedQuestions };
    });
  };

  return (
    <div className="TestseriesPage flex flex-col relative">
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          <button
            onClick={handleSubmit}
            className="button-filled fixed left-1/2 bottom-10 z-50"
          >
            save
          </button>
          {formData && formData.testseriesName ? (
            <>
              <section className="flex CourseDescription-sec1 w-screen h-screen md:h-auto md:items-center flex-col justify-center pt-10 md:pt-0">
                <div className="CourseDescription-sec1-details w-2/5 md:w-full md:h-screen md:bg-[#ebeffb] md:justify-center flex flex-col ml-40 md:m-0 gap-4 md:px-6 md:gap-6">
                  <TextField
                    name="testseriesName"
                    label="Test Series Name"
                    value={formData.testseriesName}
                    onChange={handleInputChange}
                    fullWidth
                    className="text-black1 text-4xl md:text-3xl font-semibold"
                  />
                  <TextField
                    name="TestSeriesDescription"
                    label="Test Series Description"
                    value={formData.TestSeriesDescription}
                    onChange={handleInputChange}
                    multiline
                    fullWidth
                    className="text-black1 text-lg md:text-base font-normal"
                  />
                  <TextField
                    label="Timer in minutes"
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
                  <div className="flex flex-col gap-1">
                    <p className="text-black1 text-4xl md:text-3xl font-semibold">
                      {formData.totalEnrollments}+
                    </p>
                    <span className="text-sm">Already Enrolled</span>
                  </div>
                </div>
              </section>
              <section className="flex justify-around gap-10 items-center w-full md:flex-col-reverse py-16">
                <div className="flex flex-col gap-8 w-1/2 md:w-11/12">
                  <div className="flex flex-col gap-4">
                    <p className="text-black1 text-2xl md:text-xl font-semibold">
                      Test Instructions
                    </p>
                    <p className="text-sm font-normal poppins text-gray">
                      To fit best in design, add 4-7 points, each point
                      consisting around 12 words
                    </p>
                    <label className="flex w-full justify-between gap-3">
                      <TextField
                        type="text"
                        placeholder=" Ex:- Complete syllabus with Revision classes and test Series"
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
                    <ul className="flex flex-wrap md:flex-col justify-between gap-y-4">
                      {formData.testInstructions.map((req) => (
                        <li
                          key={req}
                          className="text-lg text-black2 md:text-base font-normal flex items-start custom-width-45 md:w-full"
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-blue font-bold text-xl pr-2 pt-1"
                          />
                          {req}
                          <CancelIcon
                            onClick={() => handletestInstructionsDelete(req)}
                            className="cursor-pointer"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-1/3 md:w-11/12">
                  <label className="flex flex-col w-full gap-2">
                    <p className="text-lg font-normal poppins">Thumbnail</p>

                    {thumbnailUploadLoader ? (
                      <LinearProgress
                        color="primary"
                        determinate={false}
                        size="md"
                        variant="soft"
                      />
                    ) : (
                      <>
                        {formData.thumbnail && (
                          <img src={formData.thumbnail} className="w-full" />
                        )}
                      </>
                    )}
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={handlethumbnailupload}
                    />
                  </label>
                </div>
              </section>
              <section className="flex flex-col gap-8 w-11/12 mx-auto md:w-11/12 pb-20">
                <div className="flex flex-col gap-4">
                  <p className="text-black1 text-2xl md:text-xl font-semibold">
                    Questions
                  </p>
                  {formData.questions.map((question, questionIndex) => (
                    <Accordion
                      key={questionIndex}
                      expanded={expandedPanel === questionIndex}
                      onChange={handleChange(questionIndex)}
                    >
                      <AccordionSummary
                        expandIcon={<KeyboardArrowDownIcon />}
                        aria-controls={`question-panel-${questionIndex}-content`}
                        id={`question-panel-${questionIndex}-header`}
                      >
                        <Typography>{`Question ${
                          questionIndex + 1
                        }`}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="flex flex-col gap-4">
                          <TextareaAutosize
                            value={question.questionText}
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Enter Question"
                            onChange={(e) =>
                              handleEditQuestionText(
                                questionIndex,
                                e.target.value
                              )
                            }
                          />

                          <div>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-4">
                                <Radio
                                  checked={option.isCorrect}
                                  onChange={() =>
                                    handleToggleCorrectOption(
                                      questionIndex,
                                      optionIndex
                                    )
                                  }
                                />
                                <TextField
                                  value={option.optionText}
                                  onChange={(e) =>
                                    handleEditOptionText(
                                      questionIndex,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>

                          <IconButton
                            onClick={() => handleDeleteQuestion(questionIndex)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>

                <button
                  onClick={handleAddQuestion}
                  className="w-1/4 button-filled"
                >
                  Add Question
                </button>
              </section>
            </>
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
