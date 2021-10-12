import React, { useState, useEffect } from "react";
import { Paper, TableBody, TableCell, TableRow } from "@material-ui/core";
// import EmployeeForm from "./employeeForm";
import { makeStyles } from "@material-ui/core/styles";
import { useTable } from "../common/useTable";

import { getEmployees } from "../../services/employeeService";
// import EmployeeForm from "./employeeForm";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

//column header configurations

const headCells = [
  { id: "fullName", label: "Full Name" },
  { id: "email", label: "Email" },
  { id: "phoneNumber", label: "Phone Number" },
  { id: "jobId", label: "Job Title" },
  { id: "branchId", label: "Branch" },
];

export default function employees() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const { TableContainer, TableHeader } = useTable(records, headCells);

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
        {/* <EmployeeForm /> */}

        <TableContainer>
          <TableHeader />
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.fullName}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.phoneNumber}</TableCell>
                <TableCell>{record.job.name}</TableCell>
                <TableCell>{record.branch.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </Paper>
    </div>
  );
}
