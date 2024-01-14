import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminProtectedRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (admin) {
    const decodedtoken = jwtDecode(admin.token);
    if (admin.isAdmin && admin.email === decodedtoken.email) {
      return children;
    }
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminProtectedRoute;
