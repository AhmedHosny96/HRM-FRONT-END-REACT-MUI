import React from "react";
import { Snackbar, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { CheckCircleOutline } from "@material-ui/icons";

// custom css styles

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));
export default function Notifications(props) {
  const classes = useStyles();
  const { notify, setNotify } = props;

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={5000}
      onClose={() =>
        setNotify({
          isOpen: false,
        })
      }
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      className={classes.root}
    >
      <Alert
        severity={notify.type}
        iconMapping={{
          success: <CheckCircleOutline fontSize="inherit" />,
        }}
      >
        {notify.message}
      </Alert>
    </Snackbar>
  );
}
