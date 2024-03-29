import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.scss";
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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { SERVER_URL } from "../../../config/server";

export default function Dashboard() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [allusers, setallusers] = useState();
  const admin = useSelector((state) => state.admin.admin);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.isAdmin) {
          setLoading(true);
          const response = await axios.get(
            `${SERVER_URL}/admin/get-all-users`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response.data.users);
          setallusers(response.data.users);
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
    <div id="AdminDashboard" className="AdminDashboard flex">
      <Panel tab="Dashboard" />
      <Stack spacing={2}>{alert}</Stack>
      {loading ? (
        <Spinnerf />
      ) : (
        <>
          {allusers && allusers.length > 0 && (
            <TableContainer
              className="flex flex-wrap md:flex-col justify-between w-3/4 h-full md:items-center overflow-x-auto"
              style={{ marginLeft: "1vw", marginTop: "10vh" }}
            >
              <Table aria-label="basic table" className="overflow-x-auto">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-white">Users</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>createdAt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allusers.map((item, index) => (
                    <TableRow>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </div>
  );
}
