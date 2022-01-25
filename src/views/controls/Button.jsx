import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    backgroundColor: "#6F117D",
    "&:hover": {
      backgroundColor: "purple",
    },
    "& .MuiButton-label": {
      textTransform: "none",
      color: "white",
    },
  },
}));

export default function useButton(props) {
  const classes = useStyles();

  const { text, color, onClick, ...rest } = props;
  return (
    <Button
      className={classes.root}
      size="large"
      color="primary"
      variant="contained"
      onClick={onClick}
      {...rest}
    >
      {text}
    </Button>
  );
}
