import React, { useState, useEffect } from "react";
import {
  InputAdornment,
  Paper,
  Toolbar,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import EmployeeForm from "./employeeForm";
import { makeStyles } from "@material-ui/core/styles";
import { useTable } from "../common/useTable";

import { getEmployees } from "../../services/employeeService";
import Controls from "../../views/controls/controls";
import FormStepper from "../../views/controls/FormStepper";
// import EmployeeForm from "./employeeForm";
import { Add, Search, EditOutlined, DeleteOutlined } from "@material-ui/icons/";
import Popup from "../../views/controls/Popup";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  search: {
    width: "40%",
    position: "absolute",
    right: "10px",
  },
  newButton: {
    textTransform: "none",
    marginRight: theme.spacing(6),
  },
}));

//column header configurations

const headCells = [
  { id: "fullName", label: "Full Name" },
  { id: "email", label: "Email" },
  { id: "phoneNumber", label: "Phone Number" },
  { id: "jobId", label: "Job Title" },
  { id: "branchId", label: "Branch" },
  { id: "action", label: "Action" },
];

export default function employees() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [openPopup, setOpenPopup] = useState(false); // pop dialog
  const [recordForEdit, setRecordForEdit] = useState(null); // for populate data into pop up dialog
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const {
    TableContainer,
    TableHeader,
    recordsAfterPagingAndSorting,
    Pagination,
  } = useTable(records, headCells, filterFn);

  //populate data into pop dialog

  const openInPopup = (item) => {
    setOpenPopup(true);
    setRecordForEdit(item);
  };

  //handle search bar on change

  const handleSearch = (e) => {
    let target = e.target;

    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((item) =>
            item.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const fetchData = async () => {
    const { data } = await getEmployees();
    setRecords(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Paper elevation={2} className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className={classes.search}
            onChange={handleSearch}
          ></Controls.Input>

          <Controls.Button
            text="Add employee"
            variant="outlined"
            size="medium"
            startIcon={<Add />}
            onClick={() => setOpenPopup(true)}
            className={classes.newButton}
          ></Controls.Button>
        </Toolbar>
        <TableContainer>
          <TableHeader />
          <TableBody>
            {recordsAfterPagingAndSorting().map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.fullName}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.phoneNumber}</TableCell>
                <TableCell>{record.job.name}</TableCell>
                <TableCell>{record.branch.name}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => openInPopup(record)}
                  >
                    <EditOutlined />
                  </Controls.ActionButton>
                  <Controls.ActionButton color="secondary">
                    <DeleteOutlined />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        <Pagination />
      </Paper>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <FormStepper />

        <EmployeeForm recordForEdit={recordForEdit} />
      </Popup>
    </div>
  );
}
