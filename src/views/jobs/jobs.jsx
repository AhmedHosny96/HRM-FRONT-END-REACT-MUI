import React from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import JobForm from "./jobForm";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

export default function jobs() {
  const classes = useStyles();
  return (
    <div>
      <Paper elevation={10} className={classes.pageContent}>
        <JobForm />
      </Paper>
    </div>
  );
}
