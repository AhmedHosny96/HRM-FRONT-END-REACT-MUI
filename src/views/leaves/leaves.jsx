import React from "react";
import { Paper } from "@material-ui/core";
import LeaveForm from "./leaveForm";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  pagecontent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

export default function leaves() {
  const classes = useStyles();
  return (
    <Paper className={classes.pagecontent}>
      <LeaveForm />
    </Paper>
  );
}
