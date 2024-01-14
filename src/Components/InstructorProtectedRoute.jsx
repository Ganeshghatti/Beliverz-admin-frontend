import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const InstructorProtectedRoute = ({ children }) => {
  const instructor = JSON.parse(localStorage.getItem("instructor"));
  if (instructor) {
    const decodedtoken = jwtDecode(instructor.token);
    if (instructor.isInstructor && instructor.email === decodedtoken.email) {
      return children;
    }
  } else {
    return <Navigate to="/" />;
  }
};

export default InstructorProtectedRoute;
