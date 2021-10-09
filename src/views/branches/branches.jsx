import React from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BranchForm from "./branchForm";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
    padding: theme.spacing(2),
  },
}));

export default function branches() {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.pageContent}>
        <BranchForm />
      </Paper>
    </div>
  );
}
