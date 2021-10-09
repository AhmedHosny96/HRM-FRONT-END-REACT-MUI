import { Paper } from "@material-ui/core";
import React from "react";
import EmployeeForm from "./employeeForm";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

export default function employees() {
  const classes = useStyles();
  return (
    <div>
      <Paper elevation={0} className={classes.pageContent}>
        <EmployeeForm />
      </Paper>
    </div>
  );
}
