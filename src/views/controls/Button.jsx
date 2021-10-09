import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    "& .MuiButton-label": {
      textTransform: "none",
    },
  },
}));

export default function useButton(props) {
  const classes = useStyles();

  const { text, onClick, ...rest } = props;
  return (
    <div className={classes.root}>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={onClick}
        {...rest}
      >
        {text}
      </Button>
    </div>
  );
}
