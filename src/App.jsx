import React, { useCallback, useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Pages/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import AdminCourses from "./Pages/Admin/Courses/AdminCourses";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { saveadmin } from "./features/Admin";
import AdminInstructors from "./Pages/Admin/Instructors/AdminInstructors";
import AdminDashboard from "./Pages/Admin/Dashboard/Dashboard";
import InstructorDashboard from "./Pages/Instructor/Dashboard/InstructorDashboard";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import InstructorProtectedRoute from "./Components/InstructorProtectedRoute";
import InstructorCourses from "./Pages/Instructor/Courses/InstructorCourses";
import { saveinstructor } from "./features/Instructor";
import AdminCategory from "./Pages/Admin/Category/AdminCategory";
import Adminsettings from "./Pages/Admin/Settings/Adminsettings";
import AdminForm from "./Pages/Admin/Form/AdminForm";
import Instructorsettings from "./Pages/Instructor/Settings/Instructorsettings";
import AdminCoursePage from "./Pages/Admin/AdminCoursesPage/AdminCoursePage";
import InstructorCoursesPage from "./Pages/Instructor/InstructorCoursesPage/InstructorCoursesPage";
import DeleteCourse from "./Pages/Admin/DeleteCourse/DeleteCourse";
import AdminLogin from "./Pages/Admin/AdminLogin/AdminLogin";
import AdminTestseries from "./Pages/Admin/Testseries/AdminTestseries";
import TestseriesPage from "./Pages/Admin/TestseriesPage/TestseriesPage";

export default function App() {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const instructor = JSON.parse(localStorage.getItem("instructor"));

  const dispatch = useDispatch();

  useEffect(() => {
    if (admin) {
      dispatch(
        saveadmin({
          email: admin.email,
          token: admin.token,
          isAdmin: admin.isAdmin,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (instructor) {
      dispatch(
        saveinstructor({
          email: instructor.email,
          token: instructor.token,
          isInstructor: instructor.isInstructor,
        })
      );
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <AdminProtectedRoute>
                <AdminCourses />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/testseries"
            element={
              <AdminProtectedRoute>
                <AdminTestseries />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/instructors"
            element={
              <AdminProtectedRoute>
                <AdminInstructors />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/category"
            element={
              <AdminProtectedRoute>
                <AdminCategory />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute>
                <Adminsettings />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/form"
            element={
              <AdminProtectedRoute>
                <AdminForm />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId"
            element={
              <AdminProtectedRoute>
                <AdminCoursePage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/testseries/:testseriesId"
            element={
              <AdminProtectedRoute>
                <TestseriesPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/delete-course"
            element={
              <AdminProtectedRoute>
                <DeleteCourse />
              </AdminProtectedRoute>
            }
          />

          {/* Instructor */}
          <Route
            path="/instructor/dashboard"
            element={
              <InstructorProtectedRoute>
                <InstructorDashboard />
              </InstructorProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses"
            element={
              <InstructorProtectedRoute>
                <InstructorCourses />
              </InstructorProtectedRoute>
            }
          />
          <Route
            path="/instructor/settings"
            element={
              <InstructorProtectedRoute>
                <Instructorsettings />
              </InstructorProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:courseId"
            element={
              <InstructorProtectedRoute>
                <InstructorCoursesPage />
              </InstructorProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
