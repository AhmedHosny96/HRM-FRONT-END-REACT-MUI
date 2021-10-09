import React from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserForm from "./userForm";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));
export default function users() {
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.pageContent}>
        <UserForm />
      </Paper>
    </div>
  );
}
