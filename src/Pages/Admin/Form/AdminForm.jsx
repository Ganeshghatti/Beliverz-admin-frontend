import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./AdminForm.scss";
import Panel from "../Panel/Panel";
import Spinnerf from "../../../Components/Spinnerf";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "@mui/joy/Table";

export default function AdminForm() {
  const [formData, setformData] = useState();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const admin = useSelector((state) => state.admin.admin);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `https://beliverz-admin-server.vercel.app/admin/get-formdata`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response.data.formData);
          setformData(response.data.formData);
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

  return (
    <div id="AdminForm" className="AdminForm flex">
      <Panel tab="Form" />
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {formData && formData.length > 1 && (
            <div
              className="flex flex-wrap md:flex-col justify-between gap-8 w-3/4 h-full md:items-center"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              <Table aria-label="basic table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>query</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.map((item, index) => (
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.query}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
