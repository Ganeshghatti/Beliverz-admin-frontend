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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import instructoricon from "./instructoricon.png";
import LinearProgress from "@mui/joy/LinearProgress";

const storage = getStorage(app);
const videoStyle = {
  width: "100%",
  height: "auto",
};

export default function AdminCoursePage() {
  const { courseId } = useParams();
  const admin = useSelector((state) => state.admin.admin);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({});
  const [videoUploadLoader, setvideoUploadLoader] = useState(false);
  const [thumbnailUploadLoader, setthumbnailUploadLoader] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin && courseId) {
          setLoading(true);
          console.log(courseId);
          const response = await axios.get(
            `https://beliverz-admin-server.vercel.app/courses/${courseId}`,
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

  const handleSubmit = async () => {
    try {
      console.log(formData);
      setLoading(true);
      const response = await axios.put(
        `https://beliverz-admin-server.vercel.app/courses/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
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
          Course details updated successfully!
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

  const handleTagAdd = (e) => {
    e.preventDefault();

    if (formData.tagInput.trim() !== "") {
      setFormData((prevData) => ({
        ...prevData,
        courseDetail: {
          ...prevData.courseDetail,
          tags: [...prevData.courseDetail.tags, prevData.tagInput],
        },
        tagInput: "",
      }));
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      courseDetail: {
        ...prevData.courseDetail,
        tags: prevData.courseDetail.tags.filter((tag) => tag !== tagToDelete),
      },
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

  const handleVideoUpload = async (e) => {
    if (!formData.courseId) {
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3", left: "2", zIndex: "999" }}
          variant="filled"
          severity="warning"
        >
          Course ID not found
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      return;
    }
    try {
      setvideoUploadLoader(true);
      const file = e.target.files[0];
      const storageRef = ref(
        storage,
        `courses/${formData.courseId}/introVideo`
      );

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setFormData((prevData) => ({
        ...prevData,
        introVideo: downloadURL,
      }));
      setvideoUploadLoader(false);
    } catch (error) {
      setvideoUploadLoader(false);
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
  const handlethumbnailupload = async (e) => {
    if (!formData.courseId) {
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3", left: "2", zIndex: "999" }}
          variant="filled"
          severity="warning"
        >
          Course ID not found
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
        `courses/${formData.courseId}/thumbnail`
      );

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setFormData((prevData) => ({
        ...prevData,
        thumbnail: downloadURL,
      }));

      setthumbnailUploadLoader(false);
    } catch (error) {
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

  return (
    <div className="AdminCoursePage flex flex-col relative">
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          <button
            onClick={handleSubmit}
            className="button-filled fixed left-1/2 bottom-10"
          >
            save
          </button>
          {formData && formData.courseName ? (
            <>
              <section className="flex CourseDescription-sec1 w-screen h-screen md:h-auto md:items-center flex-col justify-center pt-10 md:pt-0">
                <div className="CourseDescription-sec1-details w-2/5 md:w-full md:h-screen md:bg-[#ebeffb] md:justify-center flex flex-col ml-40 md:m-0 gap-4 md:px-6 md:gap-6">
                  <TextField
                    name="courseName"
                    label="Course Name"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    fullWidth
                    className="text-black1 text-4xl md:text-3xl font-semibold"
                  />
                  <TextField
                    name="courseDescription"
                    label="Course Description"
                    value={formData.courseDescription}
                    onChange={handleInputChange}
                    multiline
                    fullWidth
                    className="text-black1 text-lg md:text-base font-normal"
                  />

                  <p className="text-black1 text-base font-normal">
                    {formData.courseDescription && (
                      <span className="flex gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path
                            d="M8.15117 9.9L10.6133 12.3664L9.70234 14.5664L6.6 11.4426L2.96914 15.0734L1.43086 13.5094L5.04023 9.9L4.07344 8.9332C3.48906 8.34883 2.97344 7.50234 2.64258 6.6H5.06172C5.225 6.90938 5.42695 7.18437 5.62461 7.36914L6.6043 8.35742L7.57109 7.39062C8.23281 6.70742 8.8043 5.32383 8.8043 4.4H0V2.2H5.5V0H7.7V2.2H13.2V4.4H11C11 5.9082 10.1879 7.86328 9.13086 8.9332L8.14258 9.9H8.15117ZM12.375 18.7L11 22H8.8L14.3 8.8H16.5L22 22H19.8L18.425 18.7H12.375ZM13.2902 16.5H17.5141L15.4043 11.4383L13.2902 16.5Z"
                            fill="#262626"
                          />
                        </svg>
                        Taught in{" "}
                        <TextField
                          name="language"
                          label="Language"
                          value={formData.language}
                          onChange={handleInputChange}
                        />
                      </span>
                    )}
                  </p>
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
                  <div className="flex flex-col gap-1">
                    <p className="text-black1 text-4xl md:text-3xl font-semibold">
                      {formData.courseInfo.totalEnrollments}+
                    </p>
                    <span className="text-sm">Already Enrolled</span>
                  </div>
                </div>
                <div className="CourseDescription-sec1-stats md:block flex flex-col md:w-full gap-5 p-8">
                  <ul className="flex">
                    {formData.courseCategory.map((item, index) => (
                      <li className="text-black1 text-2xl md:text-xl font-medium pr-2">
                        {item.categoryName}
                      </li>
                    ))}
                  </ul>{" "}
                  <RadioGroup
                    name="level"
                    value={formData.courseInfo.level}
                    onChange={(event) => {
                      setFormData({
                        ...formData.courseInfo,
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
                  <div className="flex flex-col gap-1">
                    <Rating
                      value={formData.rating}
                      precision={0.25}
                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      readOnly
                    />
                    <span className="flex gap-6 items-center">
                      <span className="text-black1 text-2xl md:text-xl font-medium">
                        {formData.rating}
                      </span>
                      <span className="text-[#586174] text-base md:text-sm font-normal">
                        ({formData.NumberOfRatings})
                      </span>
                    </span>
                  </div>
                  <TextField
                    label="Number of Hours"
                    className="w-full"
                    value={formData.courseDetail.totalHours}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        courseDetail: {
                          ...prevData.courseDetail,
                          totalHours: e.target.value,
                        },
                      }))
                    }
                  />
                  <p className="text-black1 text-2xl md:text-xl font-medium">
                    {formData.courseDetail.numberOfChapters} Chapters
                  </p>{" "}
                  <p className="text-black1 text-2xl md:text-xl font-medium">
                    Earn a certificate
                  </p>
                </div>
              </section>
              <section className="flex justify-around gap-10 items-center w-full md:flex-col-reverse py-16">
                <div className="flex flex-col gap-8 w-1/2 md:w-11/12">
                  <div className="flex flex-col gap-4">
                    <p className="text-black1 text-2xl md:text-xl font-semibold">
                      What you'll learn
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
                    <ul className="flex flex-wrap md:flex-col justify-between gap-y-4">
                      {formData.whatWillYouLearn.map((req) => (
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
                            onClick={() => handlewhatWillYouLearnDelete(req)}
                            className="cursor-pointer"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-black1 text-2xl md:text-xl font-semibold">
                    Skills you'll gain
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    {formData.courseDetail.tags.map((tag) => (
                      <div key={tag} className="flex">
                        <Chip
                          label={tag}
                          variant="filled"
                          style={{
                            backgroundColor: "#5A81EE",
                            color: "white",
                          }}
                        />
                        <CancelIcon
                          onClick={() => handleTagDelete(tag)}
                          className="cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
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
                    <button
                      onClick={handleTagAdd}
                      className="w-1/4 button-filled"
                    >
                      Add
                    </button>
                  </label>
                </div>
                <div className="flex flex-col gap-4 w-1/3 md:w-11/12">
                  <label className="flex flex-col w-full gap-2">
                    <p className="text-lg font-normal poppins">Intro Video:</p>

                    {videoUploadLoader ? (
                      <LinearProgress
                        color="primary"
                        determinate={false}
                        size="md"
                        variant="soft"
                      />
                    ) : (
                      <>
                        {formData.introVideo && (
                          <video style={videoStyle} controls>
                            <source
                              src={formData.introVideo}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </>
                    )}

                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                    />
                  </label>
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
              <div
                id="course-instructors"
                className="bg-black w-screen h-screen"
              ></div>
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
