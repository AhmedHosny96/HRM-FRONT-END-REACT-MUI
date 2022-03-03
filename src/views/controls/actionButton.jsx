import React from "react";
import { Button, makeStyles, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    margin: theme.spacing(0.5),
  },
  secondary: {
    "& .MuiButton-label": {
      color: theme.palette.secondary.main,
    },
  },
  primary: {
    "& .MuiButton-label": {
      color: theme.palette.primary.main,
    },
  },
}));
export default function ActionButton(props) {
  const classes = useStyles();
  const { color, children, onClick, title, ...rest } = props;
  return (
    <Tooltip title={title}>
      <Button
        className={`${classes.root} ${classes[color]}`}
        onClick={onClick}
        {...rest}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
