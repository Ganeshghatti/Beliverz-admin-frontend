import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCategory.scss";
import Panel from "../Panel/Panel";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Spinnerf from "../../../Components/Spinnerf";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import imgplaceholder from "./imgplaceholder.jpg";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../../config/Firebase";
import { TextField } from "@mui/material";

const storage = getStorage(app);

export default function AdminCategory() {
  const [allcourses, setallcourses] = useState();
  const [allcategory, setallcategory] = useState();
  const admin = useSelector((state) => state.admin.admin);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const responseCourses = await axios.get(
            `https://beliverz-admin-server.vercel.app/admin/get-all-course`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          setallcourses(responseCourses.data.courses);

          const responseCategories = await axios.get(
            `https://beliverz-admin-server.vercel.app/admin/get-all-category`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(responseCategories.data.category);
          setallcategory(responseCategories.data.category);

          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          return navigate(`/`);
        }
        setAlert(
          <Alert
            style={{
              position: "fixed",
              bottom: "3%",
              left: "2%",
              zIndex: 999,
            }}
            variant="filled"
            severity="error"
          >
            {error.response.data.error}
          </Alert>
        );
        setTimeout(() => setAlert(null), 5000);
      }
    };

    fetchData();
  }, [admin]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        "https://beliverz-admin-server.vercel.app/admin/edit-category",
        {
          categories: allcategory,
        },
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      setLoading(false);
      console.log(response);
      window.location.reload();
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
          {response.data.msg}
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
    } catch (error) {
      setAlert(
        <Alert
          style={{
            position: "fixed",
            bottom: "3%",
            left: "2%",
            zIndex: 999,
          }}
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

  const handleAddNewItemImgChange = async (categoryId, e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const storageRef = ref(storage, `categories/${categoryId}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        setallcategory((prevCategories) => {
          return prevCategories.map((category) =>
            category.categoryId === categoryId
              ? { ...category, categoryImg: downloadURL }
              : category
          );
        });
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
    }
  };
  const handleCategoryNameChange = (e, categoryId) => {
    const newCategoryName = e.target.value;

    setallcategory((prevCategories) => {
      return prevCategories.map((category) =>
        category.categoryId === categoryId
          ? { ...category, categoryName: newCategoryName }
          : category
      );
    });
  };

  const handleCategoryChange = (categoryId, courseName, courseId) => {
    setallcategory((prevCategories) => {
      const updatedCategories = [...prevCategories];
      const categoryIndex = updatedCategories.findIndex(
        (category) => category.categoryId === categoryId
      );

      if (categoryIndex !== -1) {
        const selectedCourses = updatedCategories[categoryIndex].courses;

        if (
          selectedCourses.some((course) => course.courseName === courseName)
        ) {
          updatedCategories[categoryIndex].courses = selectedCourses.filter(
            (course) => course.courseName !== courseName
          );
        } else {
          updatedCategories[categoryIndex].courses = [
            ...selectedCourses,
            { courseId, courseName },
          ];
        }
      }

      return updatedCategories;
    });
  };

  return (
    <div id="AdminCategory" className="flex">
      <Panel tab="Categories" />
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {allcategory && (
            <div
              className="flex flex-wrap flex-col items-center justify-center w-11/12 h-full md:items-center gap-16"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              <div className="w-full flex justify-around md:flex-col">
                {allcategory.map((category, index) => (
                  <Card
                    key={category.categoryId}
                    className="cursor-pointer relative AdminCourses-card w-1/5 h-auto"
                  >
                    <CardMedia
                      component="img"
                      image={category.categoryImg}
                      style={{ objectFit: "cover" }}
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleAddNewItemImgChange(category.categoryId, e)
                      }
                    />

                    <div className="p-4">
                      <Chip
                        label={category.categoryId}
                        variant="filled"
                        style={{
                          backgroundColor: "#FF9D03",
                          color: "white",
                        }}
                        className="absolute top-3 right-3 z-50"
                      />
                      <TextField
                        className="font-semibold text-2xl md:text-xl"
                        value={category.categoryName}
                        label="Category Name"
                        onChange={(e) =>
                          handleCategoryNameChange(e, category.categoryId)
                        }
                      />

                      {allcourses ? (
                        <div className="flex flex-wrap gap-1">
                          {allcourses.map((course, index) => (
                            <label
                              key={course.courseName}
                              className="text-lg font-normal poppins cursor-pointer"
                            >
                              <Checkbox
                                type="checkbox"
                                checked={category.courses.some(
                                  (c) => c.courseName === course.courseName
                                )}
                                onChange={() =>
                                  handleCategoryChange(
                                    category.categoryId,
                                    course.courseName,
                                    course.courseId
                                  )
                                }
                              />
                              {course.courseName}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <Spinnerf />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="button-filled px-8 py-2 w-fit"
              >
                Update
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
