import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    margin: theme.spacing(0.5),
  },
  secondary: {
    backgroundColor: theme.palette.secondary.light,
    "& .MuiButton-label": {
      color: theme.palette.secondary.main,
    },
  },

  primary: {
    backgroundColor: theme.palette.primary.light,
    "& .MuiButton-label": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function actionButton(props) {
  const classes = useStyles();
  const { color, children, onClick } = props;
  return (
    <Button color={`${classes.root} ${classes[color]}`} onClick={onClick}>
      {children}
    </Button>
  );
}
